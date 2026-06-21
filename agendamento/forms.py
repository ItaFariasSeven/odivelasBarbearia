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
    nome_completo = forms.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.username = self.cleaned_data['email']
        user.first_name = self.cleaned_data['nome_completo']
        user.set_password(self.cleaned_data['password'])
        
        if commit:
            user.save()
        return user