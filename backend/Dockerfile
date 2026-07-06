# ─────────────────────────────────────────────
# Imagen base: node:20-alpine
# (package.json no define engines.node, se usa LTS 20)
# ─────────────────────────────────────────────
FROM node:24-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# ─────────────────────────────────────────────
# Copiar manifiestos primero para aprovechar
# el cache de capas de Docker.
# Si package.json/package-lock.json no cambian,
# la capa de instalación se reutiliza.
# ─────────────────────────────────────────────
COPY package*.json ./

# Instalar solo dependencias de producción.
# package-lock.json está presente → usamos npm ci
# (más rápido y reproducible que npm install)
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
