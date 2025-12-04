from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from users.views import user_login_view, UserProfileView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # ✅ Simple JWT endpoints estándar
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # ✅ Tu endpoint personalizado (opcional - mantener ambos)
    path('api/auth/login/', user_login_view, name='login'),
    
    # ✅ Endpoint para obtener perfil del usuario logueado
    path('api/users/me/', UserProfileView.as_view(), name='user-profile'),
    
    # Tus otras apps
    path('api/users/', include('users.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/reviews/', include('reviews.urls')),
    # path('api/clinic-history/', include('clinic_history.urls')),
]