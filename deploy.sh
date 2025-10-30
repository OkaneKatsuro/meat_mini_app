#\!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main

# Stop and remove old containers
echo -e "${YELLOW}🛑 Stopping old containers...${NC}"
docker-compose down

# Remove old images (optional, comment out if you want to keep cache)
# echo -e "${YELLOW}🗑️  Removing old images...${NC}"
# docker-compose rm -f

# Build new images
echo -e "${YELLOW}🔨 Building new images...${NC}"
docker-compose build --no-cache

# Start containers
echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Run database migrations
echo -e "${YELLOW}📊 Running database migrations...${NC}"
docker-compose exec -T api sh -c "cd /app && npx prisma migrate deploy" || echo "Migrations skipped"

# Show logs
echo -e "${GREEN}✅ Deployment complete\!${NC}"
echo -e "${GREEN}📝 Showing logs (Ctrl+C to exit):${NC}"
docker-compose logs -f --tail=50
