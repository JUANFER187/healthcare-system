from django.core.management.base import BaseCommand
import time
from django.db import connection
from django.db.utils import OperationalError

class Command(BaseCommand):
    """Comando Django para esperar la base de datos"""
    help = 'Espera a que la base de datos esté disponible'
    
    def handle(self, *args, **options):
        self.stdout.write('⏳ Esperando a que la base de datos esté lista...')
        
        max_retries = 30
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                connection.ensure_connection()
                self.stdout.write(self.style.SUCCESS('✅ Base de datos conectada exitosamente!'))
                return
            except OperationalError:
                retry_count += 1
                self.stdout.write(f'⚠️ Intento {retry_count}/{max_retries}: Base de datos no disponible, reintentando en 2 segundos...')
                time.sleep(2)
        
        self.stdout.write(self.style.ERROR('❌ No se pudo conectar a la base de datos'))