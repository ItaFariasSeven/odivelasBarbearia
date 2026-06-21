import datetime

from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

ESPECIALIDADE = [
    ("CABELEREIRO", "Cabelereiro"),
    ("BARBEIRO", "Barbeiro"),
    ("CABELEREIRO_BARBEIRO", "Cabelereiro_barbeiro")
]

DISPONIBILDIADE = [
    ("DISPONIVEL", "Disponível"),
    ("OCUPADO", "Ocupado")
]


class Barbeiro(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="barbeiro_perfil")
    nome = models.CharField(max_length=100)
    especialidade = models.CharField(choices=ESPECIALIDADE, max_length=50)
    email = models.EmailField(max_length=254, blank=True, null=True)


    def __str__(self):
        return self.nome

class Servico (models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(max_length=250)
    preco = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duracao = models.IntegerField(default=30)

    def __str__(self):
        return self.nome
    
class Agendamento(models.Model):
    data = models.DateField()
    horario = models.TimeField()
    status = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="meus_agendamentos", null=True, blank=True)
    barbeiro = models.ForeignKey(Barbeiro, on_delete=models.CASCADE, related_name="agendamentos")
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE)


    def __str__(self):
        nome = self.usuario.username if self.usuario else "Visitante"
        return f'{nome} - {self.data} às {self.horario}'


class Disponibilidade(models.Model):
    data = models.DateField()
    horario_inicio = models.TimeField()
    horario_fim = models.TimeField()
    status = models.CharField(choices=DISPONIBILDIADE, max_length=50, default="DISPONIVEL")

    barbeiro = models.ForeignKey(Barbeiro, on_delete=models.CASCADE,  related_name="horarios_disponiveis")

    def __str__(self):
        return f'{self.barbeiro.nome} - {self.data} - {self.horario_inicio} - {self.horario_fim}'
    

class Avaliacao(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome do CLiente")
    nota = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Nota de (1 a 5)"
    )
    comentario = models.TextField(max_length=500, verbose_name="Depoimento")
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data da Avaliação")

    class Meta:
        verbose_name = "Avaliação"
        verbose_name_plural = "Avaliações"
        ordering = ['-data_criacao']

    def __str__(self):
        return f"{self.nome} - {self.nota}★"