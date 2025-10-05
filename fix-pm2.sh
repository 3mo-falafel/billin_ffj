#!/bin/bash

# Fix PM2 deployment issue
# This script diagnoses and fixes the PM2 startup problem

echo "=== PM2 Diagnostic and Fix Script ==="
echo ""

# Step 1: Check current status
echo "1. Current PM2 status:"
pm2 status

echo ""
echo "2. Checking if Next.js port is in use:"
netstat -tulpn | grep 3001 || echo "Port 3001 is free"

echo ""
echo "3. Stopping bilin-website:"
pm2 stop bilin-website

echo ""
echo "4. Deleting PM2 app:"
pm2 delete bilin-website

echo ""
echo "5. Checking for zombie processes:"
pkill -f "next start" || echo "No zombie processes found"

echo ""
echo "6. Navigating to project:"
cd /var/www/billin_ffj

echo ""
echo "7. Checking if .next directory exists:"
ls -la .next/ | head -10

echo ""
echo "8. Starting fresh PM2 instance:"
pm2 start npm --name "bilin-website" -- start

echo ""
echo "9. Saving PM2 configuration:"
pm2 save

echo ""
echo "10. Waiting 5 seconds for startup..."
sleep 5

echo ""
echo "11. Checking new status:"
pm2 status

echo ""
echo "12. Testing if app responds:"
curl -I http://localhost:3001 || echo "App not responding yet"

echo ""
echo "13. Viewing recent logs:"
pm2 logs bilin-website --lines 30 --nostream

echo ""
echo "=== Fix Complete ==="
echo ""
echo "If app still not responding, check:"
echo "1. .env.local exists: ls -la /var/www/billin_ffj/.env.local"
echo "2. Port 3001 is free: netstat -tulpn | grep 3001"
echo "3. Database is running: systemctl status postgresql"
