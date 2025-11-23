from django.db import models
from django.conf import settings

class ClinicVisit(models.Model):
    """Modelo para historial de consultorios visitados por pacientes"""
    
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='clinic_visits',
        limit_choices_to={'user_type': 'patient'},
        verbose_name='Paciente'
    )
    professional = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_visits',
        limit_choices_to={'user_type': 'professional'},
        verbose_name='Profesional'
    )
    
    # Información de la visita
    first_visit_date = models.DateField(verbose_name='Fecha primera visita')
    last_visit_date = models.DateField(verbose_name='Fecha última visita')
    total_visits = models.PositiveIntegerField(default=1, verbose_name='Total de visitas')
    
    # Información del consultorio
    clinic_name = models.CharField(max_length=200, verbose_name='Nombre del consultorio')
    clinic_address = models.TextField(verbose_name='Dirección del consultorio')
    clinic_phone = models.CharField(max_length=20, blank=True, verbose_name='Teléfono del consultorio')
    
    # Especialidad del profesional en esa visita
    specialty_visited = models.CharField(max_length=100, verbose_name='Especialidad visitada')
    
    # Calificación y comentarios del paciente
    rating = models.PositiveIntegerField(
        blank=True, 
        null=True, 
        choices=[(i, i) for i in range(1, 6)],
        verbose_name='Calificación (1-5)'
    )
    patient_notes = models.TextField(blank=True, verbose_name='Notas del paciente')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Visita a Consultorio'
        verbose_name_plural = 'Historial de Consultorios Visitados'
        unique_together = ['patient', 'professional']
        ordering = ['-last_visit_date']
    
    def __str__(self):
        return f"{self.patient.get_full_name()} → {self.clinic_name} ({self.total_visits} visitas)"
    
    def update_visit_stats(self):
        """Actualiza estadísticas cuando hay una nueva cita completada"""
        from appointments.models import Appointment
        recent_appointments = Appointment.objects.filter(
            patient=self.patient,
            professional=self.professional,
            status='completed'
        ).order_by('appointment_date')
        
        if recent_appointments.exists():
            self.first_visit_date = recent_appointments.first().appointment_date
            self.last_visit_date = recent_appointments.last().appointment_date
            self.total_visits = recent_appointments.count()
            self.save()