from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings

class Review(models.Model):
    RATING_CHOICES = [
        (1, '1 Estrella'),
        (2, '2 Estrellas'),
        (3, '3 Estrellas'),
        (4, '4 Estrellas'),
        (5, '5 Estrellas'),
    ]
    
    # Relaciones
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='reviews_given',
        limit_choices_to={'user_type': 'patient'}
    )
    professional = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='reviews_received',
        limit_choices_to={'user_type': 'professional'}
    )
    appointment = models.OneToOneField(
        'appointments.Appointment', 
        on_delete=models.CASCADE,
        related_name='review'
    )
    
    # Campos principales
    rating = models.IntegerField(
        choices=RATING_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(max_length=500, blank=True, null=True)
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)  # Para moderación
    
    class Meta:
        db_table = 'reviews'
        verbose_name = 'Reseña'
        verbose_name_plural = 'Reseñas'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Reseña de {self.patient.get_full_name()} para {self.professional.get_full_name()} - {self.rating}★"
    
    def save(self, *args, **kwargs):
        from django.core.exceptions import ValidationError
        
        # Verificar que el paciente tuvo la cita con el profesional
        if self.appointment.patient != self.patient:
            raise ValidationError("Solo el paciente de la cita puede dejar reseña")
        if self.appointment.professional != self.professional:
            raise ValidationError("La reseña debe ser para el profesional de la cita")
        
        # Verificar que la cita está completada (Finalizada)
        if self.appointment.status != 'completed':
            raise ValidationError("Solo se pueden dejar reseñas para citas finalizadas")
            
        super().save(*args, **kwargs)