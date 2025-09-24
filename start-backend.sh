#!/bin/bash

echo "🚀 Starting OneMoment Backend..."

# Create .env file if not exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOF
# PocketBase
PB_ENCRYPT_KEY=defaultkey123456789012345678901234

# API URLs
POCKETBASE_URL=http://localhost:8090
REDIS_URL=redis://localhost:6379

# App Config
NODE_ENV=development
EOF
fi

# Create directories if not exist
mkdir -p pb_data pb_public

# Start Docker containers
echo "Starting Docker containers..."
docker-compose up -d

# Wait for PocketBase to be ready
echo "Waiting for PocketBase to start..."
sleep 5

# Check health
curl -f http://localhost:8090/api/health || {
  echo "❌ PocketBase failed to start"
  exit 1
}

echo "✅ Backend is running!"
echo ""
echo "📌 Access points:"
echo "   PocketBase Admin: http://localhost:8090/_/"
echo "   API: http://localhost:8090/api/"
echo "   Redis: localhost:6379"
echo ""
echo "📝 First time setup:"
echo "   1. Go to http://localhost:8090/_/"
echo "   2. Create admin account"
echo "   3. Import collections from pb_migrations/"
echo ""
echo "🛑 To stop: docker-compose down"
