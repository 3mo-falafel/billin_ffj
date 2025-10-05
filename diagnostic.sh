#!/bin/bash

# Quick diagnostic for PM2 issue
echo "=== Quick Diagnostic ==="

cd /var/www/billin_ffj

echo "1. Check .env.local exists:"
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    echo "   DATABASE_URL present: $(grep -q DATABASE_URL .env.local && echo 'YES' || echo 'NO')"
    echo "   JWT_ACCESS_SECRET present: $(grep -q JWT_ACCESS_SECRET .env.local && echo 'YES' || echo 'NO')"
else
    echo "❌ .env.local MISSING!"
fi

echo ""
echo "2. Check .next build exists:"
if [ -d .next ]; then
    echo "✅ .next directory exists"
    ls -lh .next/ | head -5
else
    echo "❌ .next directory MISSING! Run: npm run build"
fi

echo ""
echo "3. Check Node.js version:"
node --version

echo ""
echo "4. Check if package.json has start script:"
grep -A 2 '"scripts"' package.json | grep start

echo ""
echo "5. Try starting manually (will exit after 3 seconds):"
timeout 3 npm start || echo "Manual start attempted"

echo ""
echo "6. Check PM2 logs:"
pm2 logs bilin-website --lines 10 --nostream 2>/dev/null || echo "PM2 app not running"

echo ""
echo "=== Diagnostic Complete ==="
