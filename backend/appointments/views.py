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
        if user.is_patient:
            return Appointment.objects.filter(patient=user)
        elif user.is_professional:
            return Appointment.objects.filter(professional=user)
        return Appointment.objects.none()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AppointmentCreateSerializer
        return AppointmentSerializer
    
    def perform_create(self, serializer):
        if self.request.user.is_patient:
            serializer.save(patient=self.request.user)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_patient:
            return Appointment.objects.filter(patient=user)
        elif user.is_professional:
            return Appointment.objects.filter(professional=user)
        return Appointment.objects.none()