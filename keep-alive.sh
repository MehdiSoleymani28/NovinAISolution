#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="file:/home/z/my-project/db/custom.db"
export NODE_OPTIONS="--max-old-space-size=512"

# Wait for port 3000 to be free
while ss -tlnp | grep -q ':3000 '; do
  sleep 2
done

# Start the dev server
echo "[$(date)] Starting Next.js dev server..." >> /tmp/keep-alive.log
npx next start --port 3000 >> /tmp/keep-alive.log 2>&1
echo "[$(date)] Server exited with code $?" >> /tmp/keep-alive.log
