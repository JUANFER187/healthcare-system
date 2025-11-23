from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from django.utils import timezone

class Service(models.Model):
    """Modelo para servicios médicos"""
    name = models.CharField(max_length=100, verbose_name='Nombre del servicio')
    description = models.TextField(blank=True, verbose_name='Descripción')
    duration = models.PositiveIntegerField(default=30, verbose_name='Duración en minutos')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Precio')
    
    class Meta:
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'
    
    def __str__(self):
        return self.name

class Appointment(models.Model):
    """Modelo para citas médicas"""
    
    STATUS_CHOICES = (
        ('scheduled', 'Programada'),
        ('confirmed', 'Confirmada'),
        ('in_progress', 'En progreso'),
        ('completed', 'Finalizada'),
        ('cancelled', 'Cancelada'),
        ('no_show', 'No presentado'),
    )
    
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_appointments',
        limit_choices_to={'user_type': 'patient'},
        verbose_name='Paciente'
    )
    professional = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='professional_appointments',
        limit_choices_to={'user_type': 'professional'},
        verbose_name='Profesional'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        verbose_name='Servicio'
    )
    appointment_date = models.DateField(verbose_name='Fecha de la cita')
    appointment_time = models.TimeField(verbose_name='Hora de la cita')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled',
        verbose_name='Estado'
    )
    notes = models.TextField(blank=True, verbose_name='Notas adicionales')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Campos para recordatorios
    reminder_sent = models.BooleanField(default=False, verbose_name='Recordatorio enviado')
    reminder_sent_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas'
        ordering = ['-appointment_date', 'appointment_time']
        unique_together = ['professional', 'appointment_date', 'appointment_time']
    
    def __str__(self):
        return f"Cita {self.patient.get_full_name()} con {self.professional.get_full_name()} - {self.appointment_date}"
    
    @property
    def is_past_due(self):
        """Verifica si la cita ya pasó"""
        appointment_datetime = timezone.make_aware(
            timezone.datetime.combine(self.appointment_date, self.appointment_time)
        )
        return appointment_datetime < timezone.now()
    
    @property
    def can_be_cancelled(self):
        """Verifica si la cita puede ser cancelada"""
        appointment_datetime = timezone.make_aware(
            timezone.datetime.combine(self.appointment_date, self.appointment_time)
        )
        # Permitir cancelación hasta 2 horas antes
        return (appointment_datetime - timezone.now()).total_seconds() > 7200