# Multi-stage build for Berichts-Heft
#_________________________________________
#stage1: planed is to build react and vite frontend
#_________________________________________

FROM node:20-alpine AS frontend-builder

WORKDIR /app

#copy the manifest first so npm install is cached if no dependencies change 
COPY package*.json ./
RUN npm run ci

#now the frontend should have been preped so next step in stage 1 is to copy everithing and build the frontend the user can see it from this point onward
COPY . .
RUN npm run client:build

#________________________________________
#Stage 2: Prisma client generating it needs more dependencies to generate thatn to run it so extra stage
#_______________________________________
FROM node:20-alpine AS prisma-builder

WORKDIR /app

COPY package*.json ./
#install all dependencies to make it work I hope if it did not hapen already in which case it should already have crashed so yea I do not know what I did when ading this 30 min ago
RUN npm run ci

# db stuf
COPY prisma ./prisma

#generate prisma client
RUN npx prisma generate

# ___________________________________
#stage 3 Lean Production Image
#___________________________________
FROM node:20-alpine AS production

#Install dumb-init to handle signal handling inside Docker
RUN apk add --no-cache dumb-init

WORKDIR /app

# create a non root user for securety reason we do not need any one having access to the host system
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy generated Prisma client from builder
COPY --from=prisma-builder /app/generated ./generated

# Copy Prisma schema (needed at runtime by @prisma/client)
COPY prisma ./prisma

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist

# Copy server source & static assets
COPY src/server ./src/server
COPY public ./public

# Create a persistent data directory for the  DB and sessions.
# Mount a Docker volume here so data survives container restarts.
RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

# Switch to non-root user
USER appuser

# Runtime environment defaults
# DATABASE_URL and SESSION_SECRET should be provided via docker-compose / -e flags
ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_URL=file:/app/data/berichtsheft.db \
    BCRYPT_SALT_ROUNDS=10

EXPOSE 3000

# Healthcheck: ping the server every 60 s, fail after 20 misses
HEALTHCHECK --interval=60s --timeout=20s --start-period=30s --retries=20 \
#if helth check failed 20 times it exist and I have to manualy restart it so hopfully it does not need to be restarted.
  CMD wget -qO- http://localhost:3000/health || exit 1

# dumb-init ensures signals (SIGTERM/SIGINT) reach Node.js properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server/index.js"]
