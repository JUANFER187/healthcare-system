from django.urls import path
from .views import ServiceListView, AppointmentListView, AppointmentDetailView

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='services-list'),
    path('', AppointmentListView.as_view(), name='appointments-list'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]