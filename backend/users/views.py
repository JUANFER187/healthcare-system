from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
import logging

from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserSerializer
)

logger = logging.getLogger(__name__)

# ==================== SERIALIZER PERSONALIZADO PARA JWT ====================

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer que acepta tanto 'username' como 'email' para compatibilidad"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Permitir ambos campos para compatibilidad con frontend existente
        self.fields['email'] = self.fields.pop('username', None)
        self.fields['email'].required = False
        self.fields['username'] = self.fields.get('username', self.fields['email'].__class__())
        self.fields['username'].required = False
    
    def validate(self, attrs):
        # Determinar qué campo usar
        email = attrs.get('email')
        username = attrs.get('username')
        
        # Log para depuración
        logger.info(f"Intento de login - email: {email}, username: {username}")
        
        # Usar email si está presente, si no usar username
        auth_field = email if email else username
        
        if not auth_field:
            raise serializers.ValidationError(
                {"error": "Debe proporcionar email o nombre de usuario"},
                code='authorization'
            )
        
        password = attrs.get('password')
        
        if not password:
            raise serializers.ValidationError(
                {"error": "Debe proporcionar contraseña"},
                code='authorization'
            )
        
        # Autenticar usando el campo como email
        user = authenticate(
            request=self.context.get('request'),
            username=auth_field,  # Tratar como email
            password=password
        )
        
        if user is None:
            # Intentar buscar usuario por email
            try:
                user = User.objects.get(email=auth_field)
                if not user.check_password(password):
                    user = None
            except User.DoesNotExist:
                user = None
        
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
        
        logger.info(f"Login exitoso para usuario: {user.email}")
        return data

# ==================== VISTA PERSONALIZADA PARA JWT ====================

class EmailTokenObtainPairView(TokenObtainPairView):
    """Vista que acepta email o username para máxima compatibilidad"""
    serializer_class = EmailTokenObtainPairSerializer

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
                'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S') if user.date_joined else None
            })
        except Exception as e:
            logger.error(f"Error obteniendo perfil: {str(e)}")
            return Response(
                {'error': 'Error obteniendo perfil de usuario'},
                status=status.HTTP_404_NOT_FOUND
            )

# ==================== VISTA COMPATIBILIDAD PARA FRONTEND ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def compatible_login_view(request):
    """Vista de compatibilidad que acepta el formato antiguo del frontend"""
    try:
        # Obtener datos del request
        username = request.data.get('username')
        password = request.data.get('password')
        
        logger.info(f"Login compatibilidad - username recibido: {username}")
        
        if not username or not password:
            return Response(
                {'error': 'Usuario y contraseña requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Autenticar (username puede ser email)
        user = authenticate(request, username=username, password=password)
        
        if user is None:
            # Intentar con email
            try:
                user = User.objects.get(email=username)
                if not user.check_password(password):
                    user = None
            except User.DoesNotExist:
                user = None
        
        if user is None:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generar tokens
        refresh = RefreshToken.for_user(user)
        
        response_data = {
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
        
        logger.info(f"Login compatibilidad exitoso para: {user.email}")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error en login compatibilidad: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
                'specialty': getattr(prof, 'specialty', 'General'),
                'license_number': getattr(prof, 'license_number', ''),
                'phone_number': getattr(prof, 'phone', ''),
                'user_type': prof.user_type,
                'username': prof.email.split('@')[0]  # Para compatibilidad
            })
        return Response(data)
    except Exception as e:
        logger.error(f"Error obteniendo profesionales: {str(e)}")
        return Response(
            {'error': 'Error obteniendo lista de profesionales'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ==================== VISTA PARA VERIFICAR TOKEN ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_token_view(request):
    """Verificar si un token es válido"""
    from rest_framework_simplejwt.tokens import AccessToken
    from rest_framework_simplejwt.exceptions import TokenError
    
    token = request.data.get('token')
    
    if not token:
        return Response(
            {'error': 'Token requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Verificar token
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        
        try:
            user = User.objects.get(id=user_id)
            return Response({
                'valid': True,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_type': user.user_type
                }
            })
        except User.DoesNotExist:
            return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)
            
    except TokenError as e:
        return Response({'valid': False, 'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)