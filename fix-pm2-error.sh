#!/bin/bash

# Quick Fix for PM2 setRawMode Error
# This script fixes the "setRawMode EIO" error when running Next.js with PM2

echo "🔧 Fixing PM2 Next.js Error..."
echo "================================"

# Navigate to project directory
cd /var/www/billin_ffj || exit 1

# Stop PM2 process
echo "⏹️  Stopping PM2 process..."
pm2 stop bilin-website 2>/dev/null || echo "Process not running"
pm2 delete bilin-website 2>/dev/null || echo "Process not found"

# Create logs directory if it doesn't exist
mkdir -p logs

# Method 1: Use ecosystem.config.js (RECOMMENDED)
if [ -f "ecosystem.config.js" ]; then
  echo "✅ Using ecosystem.config.js configuration"
  pm2 start ecosystem.config.js
else
  # Method 2: Start with environment variables
  echo "⚠️  No ecosystem.config.js found, using direct start"
  CI=true pm2 start npm --name "bilin-website" -- start
fi

# Save PM2 configuration
pm2 save

# Show status
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📋 Recent Logs:"
pm2 logs bilin-website --lines 20 --nostream

echo ""
echo "================================"
echo "✅ Fix Applied!"
echo ""
echo "The CI=true environment variable disables Next.js interactive features"
echo "that cause the 'setRawMode EIO' error in PM2."
echo ""
echo "To check logs: pm2 logs bilin-website"
echo "To restart: pm2 restart bilin-website"
echo "================================"
