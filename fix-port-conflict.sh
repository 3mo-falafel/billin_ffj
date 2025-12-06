#!/bin/bash

# Fix Port 3001 Already in Use Error

echo "🔍 Finding process using port 3001..."

# Find what's using port 3001
PORT_PROCESS=$(lsof -ti:3001)

if [ -z "$PORT_PROCESS" ]; then
  echo "✅ Port 3001 is free"
else
  echo "⚠️  Port 3001 is being used by process: $PORT_PROCESS"
  echo "📋 Process details:"
  ps -p $PORT_PROCESS -o pid,ppid,cmd,user
  
  echo ""
  echo "🛑 Killing process on port 3001..."
  kill -9 $PORT_PROCESS
  sleep 2
  
  # Verify it's killed
  if lsof -ti:3001 > /dev/null 2>&1; then
    echo "❌ Failed to kill process, trying with sudo..."
    sudo kill -9 $PORT_PROCESS
  else
    echo "✅ Process killed successfully"
  fi
fi

# Stop PM2 process
echo ""
echo "⏹️  Stopping PM2 bilin-website..."
pm2 stop bilin-website
pm2 delete bilin-website

# Wait a moment
sleep 2

# Check again
if lsof -ti:3001 > /dev/null 2>&1; then
  echo "⚠️  Port still in use, force killing..."
  lsof -ti:3001 | xargs kill -9 2>/dev/null
  sleep 2
fi

# Start fresh
echo ""
echo "🚀 Starting bilin-website..."
cd /var/www/billin_ffj
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ Done! Checking if port 3001 is now in use by our app..."
sleep 3
if lsof -ti:3001 > /dev/null 2>&1; then
  echo "✅ Port 3001 is in use (by bilin-website)"
  pm2 logs bilin-website --lines 10 --nostream
else
  echo "❌ Port 3001 is still free - check logs for errors"
  pm2 logs bilin-website --err --lines 20 --nostream
fi
