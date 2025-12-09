# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app


# Esto optimiza el caché de Docker.
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente del proyecto
COPY . .

# Expone el puerto que usará el servicio
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]