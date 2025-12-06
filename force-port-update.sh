#!/bin/bash

echo "🔧 Force updating PM2 configuration to use port 3001..."

# Stop and delete the PM2 process completely
echo "Stopping and deleting PM2 process..."
pm2 stop bilin-website 2>/dev/null
pm2 delete bilin-website 2>/dev/null

# Kill anything on port 3000 and 3001
echo "Killing any processes on ports 3000 and 3001..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Verify the ecosystem.config.js has the correct port
echo "Checking ecosystem.config.js configuration..."
if grep -q "PORT: 3001" ecosystem.config.js; then
    echo "✅ ecosystem.config.js correctly configured for port 3001"
else
    echo "❌ ERROR: ecosystem.config.js does NOT have PORT: 3001"
    echo "Contents of env section:"
    grep -A 10 "env:" ecosystem.config.js
    exit 1
fi

# Clear PM2 cache
echo "Clearing PM2 cache..."
pm2 flush
pm2 cleardump

# Wait a moment
sleep 2

# Start fresh with the ecosystem config
echo "Starting PM2 with fresh configuration..."
pm2 start ecosystem.config.js

# Wait for startup
sleep 3

# Check status
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🔍 Checking port usage..."
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "✅ Port 3001 is now in use!"
    echo "Process on port 3001:"
    lsof -i:3001
else
    echo "❌ Port 3001 is not in use - checking logs..."
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  WARNING: Port 3000 is still in use by:"
    lsof -i:3000
fi

echo ""
echo "📋 Recent logs:"
pm2 logs bilin-website --lines 30 --nostream
