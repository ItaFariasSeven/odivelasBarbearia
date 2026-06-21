from django.contrib.auth.views import LogoutView
from django.urls import path
from . import views

app_name = 'agendamento'

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('login/', views.Login.as_view(), name='login'),
    path('registrar/', views.CriarConta.as_view(), name='registrar'),
    path('agendamento/', views.EfetuarAgendamento.as_view(), name='agendamento'),
    path('logout/', LogoutView.as_view(next_page='homepage'), name='logout'),
    path('salvaravaliacao/', views.salvarAvaliacao, name= 'salvaravaliacao'),
    path('api/processar-agendamento/', views.processar_agendamento, name='processar_agendamento'),
    path('api/horarios-ocupados/', views.buscar_horarios_ocupados, name='horarios_ocupados'),
]