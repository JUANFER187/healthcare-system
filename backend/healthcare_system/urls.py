from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API principal - todo bajo /api/
    path('api/', include('users.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/reviews/', include('reviews.urls')),
    
    # Si necesitas estas rutas específicas, manténlas
    # path('api/clinic-history/', include('clinic_history.urls')),
]