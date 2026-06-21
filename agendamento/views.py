from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect, reverse 
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, ListView, DetailView, FormView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from agendamento.models import Agendamento, Avaliacao, Servico, Barbeiro, Disponibilidade
from django.http import JsonResponse
import json
from .forms import FormLogin, FormCriarConta
from django.core.mail import send_mail


# Create your views here.

def homepage(request):
    avaliacoes = Avaliacao.objects.all()
    return render(request, 'homepage.html', {'avaliacoes': avaliacoes})


class HomePage(TemplateView):
    template_name = 'homepage.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('agendamento:homepage')
        else:
            return super().get(request, *args, **kwargs)

class Login(LoginView):
    template_name = 'login.html'
    form_class = FormLogin
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy('agendamento:agendamento')


class CriarConta(CreateView):
    template_name = 'login.html'
    form_class = FormCriarConta
    success_url = reverse_lazy('agendamento:login')



class EfetuarAgendamento(LoginRequiredMixin, CreateView):
    template_name = 'agendamento.html'
    model = Agendamento
    fields = ['barbeiro', 'servico', 'data', 'horario']
    success_url = reverse_lazy('agendamento:agendamento')

    def form_valid(self, form):
        form.instance.usuario = self.request.user
        return super().form_valid(form)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['barbeiros'] = Barbeiro.objects.all()
        context['servicos'] = Servico.objects.all()
        return context
        
    

def salvarAvaliacao(request):
    if request.method == 'POST':
        try:
            dados = json.loads(request.body)
            nome = dados.get('nome')
            nota = dados.get('nota')
            comentario = dados.get('comentario')

            Avaliacao.objects.create(nome=nome, nota=nota, comentario=comentario)

            return JsonResponse({'status': 'sucesso'})
        except Exception as e:
            return JsonResponse({'status': 'erro', 'mensagem': str(e)}, status=400)
            
    return JsonResponse({'status': 'invalido'}, status=405)


def processar_agendamento(request):
    if request.method == 'POST':
        try:
            dados = json.loads(request.body)
            
            nome_cliente = dados.get('nomeCliente')
            email_cliente = dados.get('emailCliente')
            barbeiro_id = dados.get('barbeiroId')

            horario_ocupado = Agendamento.objects.filter(
                data=dados['data'], 
                horario=dados['horario'],
                barbeiro_id=barbeiro_id
            ).exists()

            if horario_ocupado:
                return JsonResponse({'status': 'erro', 'mensagem': 'Horário indisponível!'}, status=400)

            novo_agendamento = Agendamento.objects.create(
                barbeiro_id=barbeiro_id,
                servico_id=dados['servicoId'],
                data=dados['data'],
                horario=dados['horario'],
                status=True
            )

            barbeiro = Barbeiro.objects.get(id=barbeiro_id)
            servico = Servico.objects.get(id=dados['servicoId'])

            if email_cliente:
                send_mail(
                    subject='Confirmação de Agendamento - Odivelas Barbearia',
                    message=f"Olá, {nome_cliente}!\n\nSeu agendamento foi confirmado:\nProfissional: {barbeiro.nome}\nServiço: {servico.nome}\nData: {dados['data']}\nHorário: {dados['horario']}\n\nTe esperamos lá!",
                    from_email='seu-email@gmail.com', 
                    recipient_list=[email_cliente],
                    fail_silently=True,
                )

            if barbeiro.email:
                send_mail(
                    subject='NOVO AGENDAMENTO RECEBIDO!',
                    message=f"Olá {barbeiro.nome},\n\nVocê tem um novo cliente agendado!\n\nCliente: {nome_cliente}\nServiço: {servico.nome}\nData: {dados['data']}\nHorário: {dados['horario']}",
                    from_email='seu-email@gmail.com',
                    recipient_list=[barbeiro.email],
                    fail_silently=True,
                )

            return JsonResponse({'status': 'sucesso'})

        except Exception as e:
            return JsonResponse({'status': 'erro', 'mensagem': str(e)}, status=500)
            
    return JsonResponse({'status': 'invalido'}, status=405)

def buscar_horarios_ocupados(request):
    data_escolhida = request.GET.get('data')
    barbeiro_id = request.GET.get('barbeiro_id')
    
    agendamentos = Agendamento.objects.filter(data=data_escolhida, barbeiro_id=barbeiro_id)
    
    horarios_ocupados = [ag.horario.strftime('%H:%M') for ag in agendamentos]
    
    return JsonResponse({'ocupados': horarios_ocupados})