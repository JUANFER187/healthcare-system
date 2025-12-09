from rest_framework import serializers
from .models import Appointment, Service
from users.models import User

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['id']

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    professional_name = serializers.CharField(source='professional.get_full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    can_be_cancelled = serializers.SerializerMethodField()
    is_past_due = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'professional', 'service', 'service_name',
            'appointment_date', 'appointment_time', 'status', 'notes',
            'patient_name', 'professional_name', 'can_be_cancelled', 'is_past_due',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'patient_name', 'professional_name', 
                          'service_name', 'can_be_cancelled', 'is_past_due', 'status']
    
    def get_can_be_cancelled(self, obj):
        return obj.can_be_cancelled
    
    def get_is_past_due(self, obj):
        return obj.is_past_due
    
    def validate(self, attrs):
        appointment_date = attrs.get('appointment_date')
        appointment_time = attrs.get('appointment_time')
        professional = attrs.get('professional')
        
        if appointment_date and appointment_time and professional:
            # Verificar que el profesional sea realmente un profesional
            if professional.user_type != 'professional':
                raise serializers.ValidationError(
                    {"professional": "El usuario seleccionado no es un profesional de la salud"}
                )
            
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
                raise serializers.ValidationError(
                    {"appointment_time": "El profesional no está disponible en ese horario"}
                )
        
        return attrs

class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer específico para creación de citas"""
    class Meta:
        model = Appointment
        fields = ['professional', 'service', 'appointment_date', 'appointment_time', 'notes']
    
    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Solo pacientes pueden crear citas
            if request.user.user_type != 'patient':
                raise serializers.ValidationError(
                    {"non_field_errors": ["Solo los pacientes pueden crear citas"]}
                )
        
        # Validar que el profesional sea realmente un profesional
        professional = attrs.get('professional')
        if professional and professional.user_type != 'professional':
            raise serializers.ValidationError(
                {"professional": ["El usuario seleccionado no es un profesional"]}
            )
        
        return super().validate(attrs)