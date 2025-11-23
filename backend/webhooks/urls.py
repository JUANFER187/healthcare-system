from django.urls import path
from .views import appointment_webhook

urlpatterns = [
    path('appointment/', appointment_webhook, name='appointment_webhook'),
]