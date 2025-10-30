FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/bot/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/bot/src ./src

# Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 botuser
USER botuser

CMD ["node", "src/index.js"]
