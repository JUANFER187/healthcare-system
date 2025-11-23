import os
import django
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_system.settings')
django.setup()

from appointments.models import Service

def create_initial_services():
    services = [
        {
            'name': 'Consulta General',
            'description': 'Evaluación médica general y revisión de salud completa',
            'duration': 30,
            'price': 500.00
        },
        {
            'name': 'Cardiología',
            'description': 'Consulta especializada en enfermedades del corazón y sistema cardiovascular',
            'duration': 45,
            'price': 800.00
        },
        {
            'name': 'Dermatología',
            'description': 'Diagnóstico y tratamiento de enfermedades de la piel, pelo y uñas',
            'duration': 40,
            'price': 700.00
        },
        {
            'name': 'Pediatría', 
            'description': 'Atención médica especializada para niños y adolescentes desde 0 a 18 años',
            'duration': 35,
            'price': 600.00
        },
        {
            'name': 'Ginecología',
            'description': 'Salud femenina, sistema reproductivo y controles ginecológicos',
            'duration': 45,
            'price': 750.00
        },
        {
            'name': 'Ortopedia',
            'description': 'Diagnóstico y tratamiento de problemas musculoesqueléticos y lesiones óseas',
            'duration': 40,
            'price': 750.00
        },
        {
            'name': 'Neurología',
            'description': 'Evaluación y tratamiento de enfermedades del sistema nervioso',
            'duration': 50,
            'price': 850.00
        },
        {
            'name': 'Psiquiatría',
            'description': 'Salud mental, diagnóstico y tratamiento de trastornos psicológicos',
            'duration': 60,
            'price': 900.00
        },
        {
            'name': 'Oftalmología',
            'description': 'Cuidado de la vista, diagnóstico y tratamiento de enfermedades oculares',
            'duration': 35,
            'price': 650.00
        },
        {
            'name': 'Odontología General',
            'description': 'Salud dental, limpiezas, caries y cuidado bucal general',
            'duration': 40,
            'price': 600.00
        },
        {
            'name': 'Medicina Interna',
            'description': 'Diagnóstico y tratamiento de enfermedades en adultos',
            'duration': 40,
            'price': 700.00
        },
        {
            'name': 'Endocrinología',
            'description': 'Especialidad en diabetes, tiroides y trastornos hormonales',
            'duration': 45,
            'price': 800.00
        },
        {
            'name': 'Gastroenterología',
            'description': 'Enfermedades del sistema digestivo y órganos abdominales',
            'duration': 40,
            'price': 750.00
        },
        {
            'name': 'Neumología',
            'description': 'Especialidad en enfermedades respiratorias y pulmonares',
            'duration': 40,
            'price': 750.00
        },
        {
            'name': 'Urología',
            'description': 'Enfermedades del sistema urinario y reproductor masculino',
            'duration': 45,
            'price': 800.00
        }
    ]
    
    created_count = 0
    existing_count = 0
    
    print("🚀 Creando servicios médicos...\n")
    
    for service_data in services:
        service, created = Service.objects.get_or_create(
            name=service_data['name'],
            defaults=service_data
        )
        if created:
            print(f'✅ SERVICIO CREADO: {service.name}')
            print(f'   📝 Descripción: {service.description}')
            print(f'   ⏱️  Duración: {service.duration} minutos')
            print(f'   💰 Precio: ${service.price}')
            print()
            created_count += 1
        else:
            print(f'📝 SERVICIO EXISTENTE: {service.name}')
            existing_count += 1
    
    print("=" * 50)
    print(f"📊 RESUMEN:")
    print(f"✅ Servicios creados: {created_count}")
    print(f"📝 Servicios existentes: {existing_count}")
    print(f"📦 Total de servicios: {Service.objects.count()}")
    print("=" * 50)
    
    if created_count > 0:
        print("🎉 ¡Servicios creados exitosamente!")
    else:
        print("ℹ️  Todos los servicios ya existían en la base de datos.")

if __name__ == '__main__':
    try:
        create_initial_services()
    except Exception as e:
        print(f"❌ Error al crear servicios: {e}")
        sys.exit(1)