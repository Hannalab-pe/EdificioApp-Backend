# Dockerfile para Security Service
FROM node:20-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias (incluyendo dev para el build)
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY . .

# Build del security-service específicamente sin webpack
RUN npx nest build security-service --webpack=false

# Etapa de producción
FROM node:20-alpine AS production

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Cambiar al usuario no root
USER nestjs

# Exponer puerto del security-service
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV AUTH_SERVICE_PORT=3001

# Comando para iniciar el security-service
CMD ["node", "dist/apps/security-service/main.js"]