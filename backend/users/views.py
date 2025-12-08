from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserSerializer
)

# ==================== VISTAS DE AUTENTICACIÓN ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login_view(request):
    """Vista para login de usuarios"""
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
            'user': UserProfileSerializer(user).data,
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
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'},
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
                'specialty': prof.specialty,
                'license_number': prof.license_number,
                'phone_number': prof.phone,
                'user_type': prof.user_type
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfessionalListView(generics.ListAPIView):
    """Vista para listar profesionales (APIView style)"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(user_type='professional', is_active=True)