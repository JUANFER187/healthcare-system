from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserSerializer
)

# ==================== SERIALIZER PERSONALIZADO PARA JWT ====================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado que usa email en lugar de username"""
    username_field = 'email'  # Cambiar de 'username' a 'email'
    
    def validate(self, attrs):
        # Extraer email y password
        email = attrs.get("email")
        password = attrs.get("password")
        
        if not email or not password:
            raise serializers.ValidationError(
                {"error": "Debe proporcionar email y contraseña"},
                code='authorization'
            )
        
        # Autenticar usando email
        user = authenticate(
            request=self.context.get('request'),
            username=email,  # Usar email como username
            password=password
        )
        
        if user is None:
            raise serializers.ValidationError(
                {"error": "Credenciales inválidas"},
                code='authorization'
            )
        
        if not user.is_active:
            raise serializers.ValidationError(
                {"error": "Usuario inactivo"},
                code='authorization'
            )
        
        # Generar token
        refresh = self.get_token(user)
        
        data = {
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        return data

# ==================== VISTA PERSONALIZADA PARA JWT ====================

class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada que usa email para login"""
    serializer_class = CustomTokenObtainPairSerializer

# ==================== VISTAS DE AUTENTICACIÓN ====================

class UserRegistrationView(generics.CreateAPIView):
    """Vista para registro de nuevos usuarios"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

# ==================== VISTAS DE PERFIL ====================

class UserProfileView(APIView):
    """View para obtener el perfil del usuario logueado"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            return Response({
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type,
                'is_active': user.is_active,
                'date_joined': user.date_joined
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )

# ==================== VISTAS PARA PROFESIONALES ====================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def professionals_list_view(request):
    """Lista todos los profesionales - compatible con frontend actual"""
    try:
        professionals = User.objects.filter(user_type='professional', is_active=True)
        data = []
        for prof in professionals:
            data.append({
                'id': prof.id,
                'first_name': prof.first_name,
                'last_name': prof.last_name,
                'email': prof.email,
                'specialty': prof.specialty if hasattr(prof, 'specialty') else 'General',
                'license_number': prof.license_number if hasattr(prof, 'license_number') else '',
                'phone_number': prof.phone if hasattr(prof, 'phone') else '',
                'user_type': prof.user_type
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)