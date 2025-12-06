# 🚨 URGENT: Deployment Conflict Resolution

## The Error on Your Server:
```
error: Your local changes to the following files would be overwritten by merge:
        package-lock.json
        package.json
error: The following untracked working tree files would be overwritten by merge:
        ecosystem.config.js
```

## Quick Fix - Run This on Your Server:

### Option 1: Safe Deploy (Recommended - Keeps Backup)
```bash
cd /var/www/billin_ffj
curl -O https://raw.githubusercontent.com/3mo-falafel/billin_ffj/main/safe-deploy.sh
bash safe-deploy.sh
```

### Option 2: Manual Steps
```bash
cd /var/www/billin_ffj

# Step 1: Stash local changes (creates backup)
git stash

# Step 2: Remove the conflicting ecosystem file
rm ecosystem.config.js

# Step 3: Pull updates
git pull origin main

# Step 4: Apply PM2 fix
bash fix-pm2-error.sh

# Step 5: (Optional) Check what was stashed
git stash list
```

### Option 3: Force Update (Discards Local Changes)
⚠️ **WARNING: This will DELETE your local changes!**
```bash
cd /var/www/billin_ffj
git reset --hard HEAD
rm ecosystem.config.js
git pull origin main
bash fix-pm2-error.sh
```

## What These Commands Do:

1. **`git stash`** - Saves your local changes in a backup (safe)
2. **`rm ecosystem.config.js`** - Removes the conflicting file
3. **`git pull`** - Gets the latest code from GitHub
4. **`bash fix-pm2-error.sh`** - Fixes the PM2 error

## After Running the Fix:

Check that everything works:
```bash
pm2 status                          # Should show "online"
pm2 logs bilin-website --lines 20   # Should NOT show setRawMode error
curl http://localhost:3000          # Should return HTML
```

## Understanding the Conflicts:

- **`package.json` & `package-lock.json`**: These were modified on the server (probably during npm install)
- **`ecosystem.config.js`**: This is a NEW file that didn't exist before

The `git stash` command safely saves these changes so they don't block the update.

## If Something Goes Wrong:

Restore your backup:
```bash
git stash pop
```

---

## Copy-Paste Solution:

**Just run this single command:**
```bash
cd /var/www/billin_ffj && git stash && rm -f ecosystem.config.js && git pull origin main && bash fix-pm2-error.sh
```

This will:
✅ Backup local changes
✅ Remove conflicting file
✅ Pull latest code
✅ Fix PM2 error
✅ Start your website
