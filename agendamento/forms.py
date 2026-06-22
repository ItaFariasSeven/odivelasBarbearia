from django.core.exceptions import ValidationError
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .models import User
from django import forms

class FormLogin(AuthenticationForm):
    username = forms.EmailField(
        label=False,
        widget=forms.EmailInput(attrs={
            'class': 'input-padrao',
            'placeholder': 'seu@email.com',
            'id': 'email'
        })
    )

class FormCriarConta(forms.ModelForm):
    
    class Meta:
        model = User 
        fields = ['email', 'password'] 

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            raise ValidationError("Esse usuário já existe.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        senha = cleaned_data.get("password")
        
        confirmar_senha = self.data.get("confirmarSenha") 

        if senha and confirmar_senha and senha != confirmar_senha:
            raise ValidationError("As senhas não coincidem. Tente novamente.")
            
        return cleaned_data
        
    def save(self, commit=True):
        user = super().save(commit=False)
        user.username = self.cleaned_data['email'] 
        user.email = self.cleaned_data['email']
        
        user.set_password(self.cleaned_data['password']) 
        
        nome_completo = self.data.get('nome_completo', '')
        if nome_completo:
            partes_nome = nome_completo.split(' ', 1)
            user.first_name = partes_nome[0]
            if len(partes_nome) > 1:
                user.last_name = partes_nome[1]
        
        if commit:
            user.save()
        return user