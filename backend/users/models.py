from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El usuario debe tener un email')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        ('patient', 'Paciente'),
        ('professional', 'Profesional de la Salud'),
    )
    
    email = models.EmailField(unique=True, verbose_name='Correo electrónico')
    first_name = models.CharField(max_length=30, verbose_name='Nombre')
    last_name = models.CharField(max_length=30, verbose_name='Apellido')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Teléfono')
    user_type = models.CharField(
        max_length=15, 
        choices=USER_TYPE_CHOICES,
        verbose_name='Tipo de usuario'
    )
    
    # Campos para profesionales
    specialty = models.CharField(max_length=100, blank=True, null=True, verbose_name='Especialidad')
    license_number = models.CharField(max_length=50, blank=True, null=True, verbose_name='Número de licencia')
    clinic_name = models.CharField(max_length=200, blank=True, null=True, verbose_name='Nombre del consultorio')
    clinic_address = models.TextField(blank=True, null=True, verbose_name='Dirección del consultorio')
    
    # Campos para pacientes
    date_of_birth = models.DateField(blank=True, null=True, verbose_name='Fecha de nacimiento')
    
    # Campos de control
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'user_type']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_short_name(self):
        return self.first_name
    
    @property
    def is_patient(self):
        return self.user_type == 'patient'
    
    @property
    def is_professional(self):
        return self.user_type == 'professional'