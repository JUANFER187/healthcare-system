from django.urls import path
from .views import (
    UserRegistrationView, 
    UserProfileView, 
    professionals_list_view,
    EmailTokenObtainPairView,
    compatible_login_view,
    verify_token_view
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    # 🔐 Autenticación principal (recomendado)
    path('login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 🔄 Endpoints para compatibilidad con tu frontend ACTUAL
    path('auth/login/', compatible_login_view, name='compatible_login'),
    path('auth/token/', compatible_login_view, name='legacy_token'),
    
    # 🔄 Token refresh/verify
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='legacy_token_refresh'),
    path('auth/token/verify/', verify_token_view, name='legacy_token_verify'),
    
    # 👤 Registro y perfil
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('me/', UserProfileView.as_view(), name='user-me'),  # Para tu frontend
    
    # 👨‍⚕️ Profesionales
    path('professionals/', professionals_list_view, name='professionals-list'),
]