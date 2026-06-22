from xml.dom import ValidationErr

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

    def clean_email(self):
        email = self.cleaned_data.get('email')
        
        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            raise ValidationErr("Esse usuário Já existe")
            
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.username = self.cleaned_data['email'] 
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user