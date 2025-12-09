from django.urls import path
from .views import (
    ServiceListView, 
    AppointmentListView, 
    AppointmentDetailView,
    available_slots_view
)

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='services-list'),
    path('available-slots/', available_slots_view, name='available-slots'),
    path('', AppointmentListView.as_view(), name='appointments-list'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]