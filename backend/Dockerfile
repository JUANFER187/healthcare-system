FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema (ya están bien)
# Incluimos gcc para psycopg2-binary y postgresql-client para comandos de DB
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# COPIA CRÍTICA: Copiar el script de entrada y darle permisos de ejecución
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copiar el resto del código del proyecto (incluye manage.py, settings.py, etc.)
COPY . .

# Puerto expuesto
EXPOSE 8000

# Usar el script como punto de entrada (Este se ejecuta primero)
ENTRYPOINT ["entrypoint.sh"]

# El comando a ejecutar (que será ejecutado por 'exec "$@"' dentro del script)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]