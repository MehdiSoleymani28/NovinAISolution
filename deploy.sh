#!/bin/bash
# Deployment script for NovinAISolution
# Run this on your production server after pulling the latest code

set -e

echo "🚀 Starting deployment..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Generate Prisma client
echo "⚙️ Generating Prisma client..."
npx prisma generate

# 3. Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# 4. Check database health
echo "🏥 Checking database..."
HEALTH=$(curl -s http://localhost:3000/api/health 2>/dev/null || echo "server_not_running")

if echo "$HEALTH" | grep -q '"empty"'; then
  echo "📊 Database is empty, seeding..."
  curl -X POST http://localhost:3000/api/seed
  echo ""
fi

# 5. Build
echo "🔨 Building project..."
npm run build

# 6. Start server
echo "✅ Starting production server..."
npm start

echo "🎉 Deployment complete!"
