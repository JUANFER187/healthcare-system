from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_name', 'professional_name', 'rating', 'appointment_date', 'is_verified', 'created_at']
    list_filter = ['rating', 'is_verified', 'created_at']
    search_fields = [
        'patient__first_name', 
        'patient__last_name', 
        'professional__first_name', 
        'professional__last_name',
        'appointment__id'
    ]
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_verified']
    
    def patient_name(self, obj):
        return obj.patient.get_full_name()
    patient_name.short_description = 'Paciente'
    
    def professional_name(self, obj):
        return obj.professional.get_full_name()
    professional_name.short_description = 'Profesional'
    
    def appointment_date(self, obj):
        return obj.appointment.appointment_date
    appointment_date.short_description = 'Fecha Cita'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('patient', 'professional', 'appointment')