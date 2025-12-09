from django.urls import path
from .views import (
    UserRegistrationView, 
    UserProfileView, 
    professionals_list_view,
    CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    # Autenticación con JWT usando email
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Registro y perfil
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Profesionales
    path('professionals/', professionals_list_view, name='professionals-list'),
]