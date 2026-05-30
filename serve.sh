#!/bin/sh
# Persistent Next.js server runner with auto-restart
# Keeps the server alive by monitoring and restarting when it crashes

cd /home/z/my-project
export DATABASE_URL="file:/home/z/my-project/db/custom.db"

echo "🔄 Starting persistent Next.js server..."

while true; do
  echo "[$(date '+%H:%M:%S')] Starting Next.js production server..."
  node --max-old-space-size=512 node_modules/.bin/next start --port 3000 2>&1
  EXIT_CODE=$?
  echo "[$(date '+%H:%M:%S')] Server exited with code $EXIT_CODE"
  echo "[$(date '+%H:%M:%S')] Restarting in 2 seconds..."
  sleep 2
done
