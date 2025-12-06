#!/bin/bash

# Safe deployment with local changes handling
# This script safely handles local changes before pulling updates

echo "🔧 Safe Deployment - Handling Local Changes..."
echo "================================================"

cd /var/www/billin_ffj || exit 1

# Show what's changed locally
echo "📋 Checking local changes..."
git status --short

# Backup local changes
echo ""
echo "💾 Backing up local changes..."
git stash push -m "Backup before update $(date +%Y-%m-%d_%H-%M-%S)"

# Remove the ecosystem.config.js if it exists (we'll get the new one from git)
if [ -f "ecosystem.config.js" ]; then
  echo "🗑️  Removing old ecosystem.config.js (will be replaced by git version)..."
  rm ecosystem.config.js
fi

# Pull latest changes
echo ""
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
  echo "❌ Git pull failed! Restoring backup..."
  git stash pop
  exit 1
fi

# Check if there were stashed changes
STASH_COUNT=$(git stash list | grep -c "Backup before update")
if [ "$STASH_COUNT" -gt 0 ]; then
  echo ""
  echo "ℹ️  Your local changes have been saved in git stash"
  echo "   To view: git stash list"
  echo "   To restore: git stash pop"
  echo ""
  echo "   Most common local changes (package.json, package-lock.json)"
  echo "   are usually safe to discard if you haven't intentionally"
  echo "   modified dependencies."
fi

# Now run the PM2 fix
echo ""
echo "🚀 Applying PM2 fix..."
bash fix-pm2-error.sh

echo ""
echo "================================================"
echo "✅ Deployment Complete!"
echo "================================================"
