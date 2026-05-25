#!/bin/bash
# Quick dev server script for NovinAISolution
# Usage: ./dev.sh [dev|build|start|seed]

case "$1" in
  dev)
    echo "🚀 Starting dev server..."
    npx next dev -p 3000 --turbopack
    ;;
  build)
    echo "📦 Building production..."
    npx next build
    echo "✅ Build complete!"
    ;;
  start)
    echo "🚀 Starting production server..."
    npx next start -p 3000
    ;;
  seed)
    echo "🌱 Seeding database..."
    # Start server temporarily, seed, then stop
    npx next dev -p 3001 &
    SERVER_PID=$!
    sleep 10
    curl -X POST http://localhost:3001/api/seed
    echo ""
    kill $SERVER_PID 2>/dev/null
    echo "✅ Seed complete!"
    ;;
  test)
    echo "🧪 Quick test - starting dev server..."
    npx next dev -p 3000 --turbopack &
    SERVER_PID=$!
    sleep 10
    
    echo ""
    echo "=== Testing Pages ==="
    curl -s -o /dev/null -w "Home:        %{http_code}\n" http://localhost:3000/
    curl -s -o /dev/null -w "Blog:        %{http_code}\n" http://localhost:3000/blog
    curl -s -o /dev/null -w "Admin Login: %{http_code}\n" http://localhost:3000/admin/login
    
    echo ""
    echo "=== Testing API ==="
    curl -s -o /dev/null -w "Auth API:    %{http_code}\n" -X POST http://localhost:3000/api/auth \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@novinaisolution.com","password":"admin123"}'
    curl -s -o /dev/null -w "Articles:    %{http_code}\n" http://localhost:3000/api/articles
    curl -s -o /dev/null -w "Categories:  %{http_code}\n" http://localhost:3000/api/categories
    
    echo ""
    echo "✅ Tests done! Server still running (PID: $SERVER_PID)"
    echo "   Open: http://localhost:3000"
    echo "   Stop: kill $SERVER_PID"
    ;;
  *)
    echo "NovinAISolution Dev Tools"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev    Start development server"
    echo "  build  Build for production"
    echo "  start  Start production server"
    echo "  seed   Seed database with sample data"
    echo "  test   Quick test all pages & APIs"
    ;;
esac
