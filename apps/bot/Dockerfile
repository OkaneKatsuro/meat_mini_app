FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/bot/package*.json ./

# Install dependencies (use npm install since there's no lockfile)
RUN npm install --omit=dev --no-progress --no-fund

# Copy source code and verify it ends up in the image
COPY apps/bot/src /app/src
RUN ls -la /app && ls -la /app/src && test -f /app/src/index.js

# Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 botuser
USER botuser

CMD ["node", "/app/src/index.js"]
