import time
import os
import django
from django.db import connection
from django.db.utils import OperationalError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_system.settings')
django.setup()

def wait_for_db():
    """Espera a que la base de datos esté disponible"""
    print("⏳ Esperando a que la base de datos esté lista...")
    
    max_retries = 30
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            connection.ensure_connection()
            print("✅ Base de datos conectada exitosamente!")
            return True
        except OperationalError:
            retry_count += 1
            print(f"⚠️ Intento {retry_count}/{max_retries}: Base de datos no disponible, reintentando en 2 segundos...")
            time.sleep(2)
    
    print("❌ No se pudo conectar a la base de datos después de múltiples intentos")
    return False

if __name__ == "__main__":
    wait_for_db()