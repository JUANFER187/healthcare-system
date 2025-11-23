# Usamos imagen oficial de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo (modo desarrollo con recarga en caliente)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]