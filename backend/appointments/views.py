from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from datetime import datetime
from .models import Appointment, Service
from .serializers import AppointmentSerializer, AppointmentCreateSerializer, ServiceSerializer
import logging

logger = logging.getLogger(__name__)

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class AppointmentListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'professional':
            return Appointment.objects.filter(professional=user)
        return Appointment.objects.none()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AppointmentCreateSerializer
        return AppointmentSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        # Asignar paciente automáticamente si es paciente
        if user.user_type == 'patient':
            serializer.save(patient=user, status='scheduled')
        else:
            # Si es profesional, necesita que se especifique el paciente
            serializer.save(status='scheduled')

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'professional':
            return Appointment.objects.filter(professional=user)
        return Appointment.objects.none()

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_slots_view(request):
    """Obtener horarios disponibles para un profesional"""
    professional_id = request.query_params.get('professional_id')
    date_str = request.query_params.get('date')
    
    if not professional_id or not date_str:
        return Response(
            {"error": "Se requieren professional_id y date"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        from users.models import User
        professional = User.objects.get(
            id=professional_id, 
            user_type='professional',
            is_active=True
        )
        
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        existing_appointments = Appointment.objects.filter(
            professional=professional,
            appointment_date=date,
            status__in=['scheduled', 'confirmed']
        ).values_list('appointment_time', flat=True)
        
        slots = []
        existing_times = [t.strftime('%H:%M:%S') for t in existing_appointments]
        
        for hour in range(9, 18):
            for minute in [0, 30]:
                if hour == 17 and minute == 30:
                    continue
                
                time_str = f"{hour:02d}:{minute:02d}:00"
                if time_str not in existing_times:
                    slots.append(time_str)
        
        return Response(slots)
        
    except User.DoesNotExist:
        return Response(
            {"error": "Profesional no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error en available_slots: {str(e)}")
        return Response(
            {"error": "Error interno del servidor"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )