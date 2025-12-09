# Usa la misma imagen base para consistencia
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente del proyecto
COPY . .

# Expone el puerto que usará este servicio
EXPOSE 3001 
#Usamos un puerto diferente al Auth-Service (3000)

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]