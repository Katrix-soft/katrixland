# Etapa 1: Construcción (Build)
FROM node:20-alpine as build
WORKDIR /app

# Copiar dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados de Angular al directorio HTML de Nginx
COPY --from=build /app/dist/katrix-landing/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
