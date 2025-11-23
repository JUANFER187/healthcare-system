from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    professional_name = serializers.CharField(source='professional.get_full_name', read_only=True)
    appointment_date = serializers.DateField(source='appointment.appointment_date', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'patient', 'professional', 'appointment', 
            'rating', 'comment', 'created_at', 'updated_at',
            'is_verified', 'patient_name', 'professional_name', 'appointment_date'
        ]
        read_only_fields = ['patient', 'professional', 'appointment', 'is_verified', 'created_at', 'updated_at']
    
    def validate(self, data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            # En creación, validamos a través del serializer específico
            pass
        return data

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['appointment', 'rating', 'comment']
    
    def validate_appointment(self, value):
        request = self.context.get('request')
        
        # Verificar que la cita existe y pertenece al usuario
        if value.patient != request.user:
            raise serializers.ValidationError("No tienes permiso para reseñar esta cita")
        
        # Verificar que la cita está finalizada
        if value.status != 'completed':
            raise serializers.ValidationError("Solo puedes reseñar citas finalizadas")
        
        # Verificar que no existe ya una reseña para esta cita
        if Review.objects.filter(appointment=value).exists():
            raise serializers.ValidationError("Ya has dejado una reseña para esta cita")
            
        return value

class ProfessionalReviewStatsSerializer(serializers.Serializer):
    professional_id = serializers.IntegerField()
    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField()