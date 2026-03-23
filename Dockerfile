# Multi-stage build for Berichts-Heft

# Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run client:build

# Production server
FROM node:20-alpine
WORKDIR /app

# Install production dependencies only I hope
COPY package*.json ./
RUN npm install --omit=dev

# db stuf
COPY prisma ./prisma
RUN npx prisma generate

# should do frontend
COPY --from=frontend-builder /app/dist ./dist

# should do the server stuf
COPY src/server ./src/server
COPY public ./public

# Licence
COPY LICENSE ./LICENSE

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the API port
EXPOSE 3000

# server start
CMD ["node", "src/server/index.js"]

#I have high hopes for this it is to this date 23.03.2026 not tested