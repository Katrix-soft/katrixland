# Etapa 1: Construcción (Build)
FROM node:20-alpine as build
WORKDIR /app

# Copiar dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (Node.js)
FROM node:20-alpine

WORKDIR /app

# Copiar server.js y dependencias
COPY package*.json ./
# Instalar solo dependencias de producción
RUN npm install express nodemailer cors --omit=dev

# Copiar el archivo del servidor
COPY server.js .

# Copiar los archivos compilados de Angular desde la etapa anterior
COPY --from=build /app/dist/katrix-landing /app/dist/katrix-landing

# Exponer el puerto 80
EXPOSE 80

# Iniciar el servidor Node.js
CMD ["node", "server.js"]
