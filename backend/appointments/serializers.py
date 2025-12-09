from rest_framework import serializers
from .models import Appointment, Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    professional_name = serializers.CharField(source='professional.get_full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    can_be_cancelled = serializers.BooleanField(read_only=True)
    is_past_due = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'professional', 'service', 'service_name',
            'appointment_date', 'appointment_time', 'status', 'notes',
            'patient_name', 'professional_name', 'can_be_cancelled', 'is_past_due',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        appointment_date = attrs.get('appointment_date')
        appointment_time = attrs.get('appointment_time')
        professional = attrs.get('professional')
        
        if appointment_date and appointment_time and professional:
            # Verificar que el profesional sea realmente un profesional
            if not professional.is_professional:
                raise serializers.ValidationError("El profesional seleccionado no es un profesional de la salud")
            
            # Verificar disponibilidad
            conflicting_appointments = Appointment.objects.filter(
                professional=professional,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                status__in=['scheduled', 'confirmed']
            )
            
            if self.instance:  # Si es una actualización, excluir la cita actual
                conflicting_appointments = conflicting_appointments.exclude(id=self.instance.id)
            
            if conflicting_appointments.exists():
                raise serializers.ValidationError("El profesional no está disponible en ese horario")
        
        return attrs

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['professional', 'service', 'appointment_date', 'appointment_time', 'notes']
    
    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # CORREGIDO: usar user_type en lugar de is_patient
            if request.user.user_type != 'patient':
                raise serializers.ValidationError("Solo los pacientes pueden crear citas")
        return super().validate(attrs)