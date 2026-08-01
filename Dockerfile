# ── Base: Node 20 Alpine (imagen pequeña) ─────────────────
FROM node:20-alpine AS base
WORKDIR /app

# Copiar solo package.json primero (cachea npm install)
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de NestJS
EXPOSE 3000

# En desarrollo usamos start para hot reload
CMD ["npm", "run", "start"]