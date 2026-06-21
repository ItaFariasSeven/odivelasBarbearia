from django.contrib import admin
from .models import Barbeiro, Servico, Agendamento, Disponibilidade, Avaliacao

# Register your models here.
admin.site.register(Barbeiro)
admin.site.register(Servico)
admin.site.register(Agendamento)
admin.site.register(Disponibilidade)
admin.site.register(Avaliacao)