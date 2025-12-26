# Usar la imagen oficial de Nginx basada en Alpine (ligera)
FROM nginx:alpine

# Copiar los archivos de la aplicación al directorio de Nginx
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY service-worker.js /usr/share/nginx/html/
COPY manifest.json /usr/share/nginx/html/

# Copiar configuración personalizada de Nginx si es necesaria
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
