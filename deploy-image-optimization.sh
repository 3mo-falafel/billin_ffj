#!/bin/bash

# Image Optimization Deployment Script for VPS
# Run this script on your VPS to deploy the image optimization system

echo "🚀 Starting Image Optimization System Deployment..."
echo "=================================================="

# Navigate to project directory
cd /var/www/billin_ffj || exit 1
echo "✅ Changed to project directory"

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main
echo "✅ Code updated"

# Install new dependencies
echo "📦 Installing dependencies (sharp and multer)..."
pnpm install --legacy-peer-deps
echo "✅ Dependencies installed"

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p public/uploads/images
mkdir -p public/uploads/thumbnails
echo "✅ Upload directories created"

# Set permissions
echo "🔐 Setting directory permissions..."
chmod 755 public/uploads
chmod 755 public/uploads/images
chmod 755 public/uploads/thumbnails
echo "✅ Permissions set"

# Build the application
echo "🔨 Building Next.js application..."
pnpm build
echo "✅ Build complete"

# Restart PM2
echo "🔄 Restarting PM2 process..."
pm2 restart bilin-website
echo "✅ PM2 restarted"

# Show PM2 status
echo ""
echo "📊 Current PM2 Status:"
pm2 status

echo ""
echo "=================================================="
echo "✅ Image Optimization System Deployed Successfully!"
echo ""
echo "📝 Next Steps:"
echo "1. Update Nginx configuration to serve static files with caching"
echo "2. Test image upload in admin dashboard"
echo "3. Verify images load correctly on frontend"
echo "4. Check PM2 logs: pm2 logs bilin-website"
echo ""
echo "⚠️  NGINX Configuration Needed:"
echo "Add this to your Nginx server block:"
echo ""
echo "location /uploads/ {"
echo "  alias /var/www/billin_ffj/public/uploads/;"
echo "  expires 30d;"
echo "  add_header Cache-Control \"public, immutable\";"
echo "}"
echo ""
echo "Then reload Nginx: sudo systemctl reload nginx"
echo "=================================================="
