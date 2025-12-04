FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/bot/package*.json ./

# Install dependencies (use npm install since there's no lockfile)
RUN npm install --omit=dev

# Copy source code
COPY apps/bot/src ./src

# Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 botuser
USER botuser

CMD ["node", "src/index.js"]
