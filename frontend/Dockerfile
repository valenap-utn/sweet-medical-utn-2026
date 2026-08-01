# ─────────────────────────────────────────────
# Stage 1 - BUILD
# Compila Next en archivos estáticos
# ─────────────────────────────────────────────
FROM node:24-alpine AS build

WORKDIR /app

# Copiar manifiestos primero para aprovechar cache
COPY package*.json ./

# Instalar dependencias necesarias para compilar
RUN npm install

# Copiar código fuente
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_BASE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build


# ─────────────────────────────────────────────
# Stage 2 - SERVE
# Sirve los archivos estáticos con Nginx
# ─────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copiar resultado del build al directorio web de Nginx
COPY --from=build /app/out /usr/share/nginx/html

# Configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]