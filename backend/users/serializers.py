from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirmation = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'user_type',
            'specialty', 'license_number', 'clinic_name', 'clinic_address',
            'phone', 'date_of_birth',
            'password', 'password_confirmation'
        ]
        extra_kwargs = {
            'specialty': {'required': False},
            'license_number': {'required': False},
            'clinic_name': {'required': False},
            'clinic_address': {'required': False},
            'phone': {'required': False},
            'date_of_birth': {'required': False},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirmation'):
            raise serializers.ValidationError("Las contraseñas no coinciden")
        
        user_type = attrs.get('user_type')
        if user_type == 'professional':
            if not attrs.get('specialty'):
                raise serializers.ValidationError("Los profesionales deben tener una especialidad")
            if not attrs.get('license_number'):
                raise serializers.ValidationError("Los profesionales deben tener un número de licencia")
        
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Credenciales inválidas')
            if not user.is_active:
                raise serializers.ValidationError('Cuenta desactivada')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Email y contraseña requeridos')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'user_type',
            'specialty', 'license_number', 'clinic_name', 'clinic_address',
            'phone', 'date_of_birth', 'date_joined'
        ]
        read_only_fields = ['id', 'email', 'date_joined']