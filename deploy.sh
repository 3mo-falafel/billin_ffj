#!/bin/bash

echo "🚀 Starting deployment process..."

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the application
echo "🔨 Building application..."
npm run build

# Restart with PM2
echo "🔄 Restarting application..."
pm2 restart billin_ffj || pm2 start npm --name "billin_ffj" -- start

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be running at your domain"

# Show logs
echo "📊 Recent logs:"
pm2 logs billin_ffj --lines 10