from rest_framework import generics, permissions
from .models import Appointment, Service
from .serializers import AppointmentSerializer, AppointmentCreateSerializer, ServiceSerializer

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class AppointmentListView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # CORREGIR: usar user_type en lugar de is_patient/is_professional
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
        # CORREGIDO: usar user_type en lugar de is_patient
        if self.request.user.user_type == 'patient':
            serializer.save(patient=self.request.user)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # CORREGIR: usar user_type en lugar de is_patient/is_professional
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'professional':
            return Appointment.objects.filter(professional=user)
        return Appointment.objects.none()