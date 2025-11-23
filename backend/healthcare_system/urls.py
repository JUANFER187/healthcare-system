from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import user_login_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', user_login_view, name='login'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('users.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/reviews/', include('reviews.urls')),
    # path('api/clinic-history/', include('clinic_history.urls')), <- Lo haremos después
]