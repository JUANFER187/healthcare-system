from django.urls import path
from .views import (
    ServiceListView, 
    AppointmentListView, 
    AppointmentDetailView,
    available_slots_view,
    upcoming_appointments_view
)

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='services-list'),
    path('available-slots/', available_slots_view, name='available-slots'),
    path('upcoming/', upcoming_appointments_view, name='upcoming-appointments'),
    path('', AppointmentListView.as_view(), name='appointments-list'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]