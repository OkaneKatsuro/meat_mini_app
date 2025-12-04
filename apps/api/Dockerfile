FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN npm ci

# Build the database package
FROM base AS database-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY packages/typescript-config ./packages/typescript-config
COPY packages/database ./packages/database
WORKDIR /app/packages/database
RUN npm run db:generate && npm run build

# Build the API
FROM base AS builder
WORKDIR /app
COPY --from=database-builder /app/node_modules ./node_modules
COPY --from=database-builder /app/packages/database ./packages/database
COPY packages/typescript-config ./packages/typescript-config
COPY apps/api ./apps/api
COPY tsconfig.json ./
WORKDIR /app/apps/api
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy necessary files
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=database-builder --chown=nestjs:nodejs /app/packages/database ./packages/database

USER nestjs

EXPOSE 3553

CMD ["node", "dist/main.js"]
