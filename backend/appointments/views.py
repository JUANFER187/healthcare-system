from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from datetime import datetime
from .models import Appointment, Service
from .serializers import AppointmentSerializer, AppointmentCreateSerializer, ServiceSerializer

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class AppointmentListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # CORREGIDO: usar user_type correctamente
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
        # CORREGIDO: asignar paciente automáticamente si es paciente
        if user.user_type == 'patient':
            serializer.save(patient=user)
        else:
            # Si es profesional, necesita que se especifique el paciente
            serializer.save()

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

# ==================== VISTAS ADICIONALES ====================

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
        # Verificar que el profesional existe y es profesional
        from users.models import User
        professional = User.objects.get(
            id=professional_id, 
            user_type='professional',
            is_active=True
        )
        
        # Convertir fecha
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        # Obtener citas existentes para ese profesional en esa fecha
        existing_appointments = Appointment.objects.filter(
            professional=professional,
            appointment_date=date,
            status__in=['scheduled', 'confirmed']
        ).values_list('appointment_time', flat=True)
        
        # Generar slots disponibles (9am a 5pm, cada 30 min)
        slots = []
        existing_times = [t.strftime('%H:%M:%S') for t in existing_appointments]
        
        for hour in range(9, 18):  # 9am a 5pm
            for minute in [0, 30]:
                if hour == 17 and minute == 30:  # Último slot a las 5:00
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
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def upcoming_appointments_view(request):
    """Obtener citas próximas del usuario"""
    user = request.user
    today = timezone.now().date()
    
    if user.user_type == 'patient':
        appointments = Appointment.objects.filter(
            patient=user,
            appointment_date__gte=today,
            status__in=['scheduled', 'confirmed']
        ).order_by('appointment_date', 'appointment_time')[:10]
    elif user.user_type == 'professional':
        appointments = Appointment.objects.filter(
            professional=user,
            appointment_date__gte=today,
            status__in=['scheduled', 'confirmed']
        ).order_by('appointment_date', 'appointment_time')[:10]
    else:
        appointments = Appointment.objects.none()
    
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)