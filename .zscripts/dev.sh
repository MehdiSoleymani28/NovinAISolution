#!/bin/bash
# Custom dev script for Z.ai platform
# This script is called by the platform's start.sh on container startup
# Uses production build with webpack for better memory efficiency

cd /home/z/my-project

echo "[DEV] Installing dependencies..."
bun install

echo "[DEV] Setting up database..."
DATABASE_URL="file:/home/z/my-project/db/custom.db" bun run db:push

echo "[DEV] Generating Prisma client..."
bun run db:generate

echo "[DEV] Building production bundle..."
DATABASE_URL="file:/home/z/my-project/db/custom.db" bun run build 2>/dev/null || true

echo "[DEV] Starting production server..."
export DATABASE_URL="file:/home/z/my-project/db/custom.db"
export NODE_OPTIONS="--max-old-space-size=128"

# Double-fork to daemonize properly
(
  node --max-old-space-size=128 node_modules/.bin/next start --port 3000 >> /tmp/next-server.log 2>&1 &
  echo $! > /tmp/next-server.pid
  sleep 2
) &

# Wait for server to be ready
echo "[DEV] Waiting for server to start..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
    echo "[DEV] Server is ready on port 3000!"
    break
  fi
  sleep 2
done

echo "[DEV] Setup complete."
