#!/bin/sh

# Este script se ejecuta al inicio del contenedor.

# 1. Esperar a que la DB esté lista (usa el script que ya existe)
echo "⏳ Ejecutando script de espera de DB..."
python wait_for_db.py

# Verificar si la conexión fue exitosa
if [ $? -ne 0 ]; then
    echo "❌ Error: La base de datos no está disponible. Saliendo."
    exit 1
fi

# 2. Ejecutar las migraciones
echo "🚀 Aplicando migraciones de Django..."
# La bandera --noinput hace que no pregunte nada al ejecutar
python manage.py migrate --noinput

# 3. Iniciar el servidor (Ejecuta el comando CMD original de Django)
echo "✅ Iniciando servidor Django..."
# exec "$@" es el patrón estándar para pasar el control al CMD
exec "$@"