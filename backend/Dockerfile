# ─────────────────────────────────────────────
# Imagen base: Node LTS
# ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copiar manifiestos primero para aprovechar cache
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --omit=dev

# Copiar código fuente
COPY . .

EXPOSE 4000

CMD ["npm", "start"]
