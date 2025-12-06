# 🚨 QUICK FIX - PM2 Error on Server

## The Error You're Seeing:
```
[Error: setRawMode EIO]
```

## One-Command Fix:

```bash
cd /var/www/billin_ffj && git pull && bash fix-pm2-error.sh
```

## OR Manual Steps:

```bash
# 1. Go to project directory
cd /var/www/billin_ffj

# 2. Pull latest code
git pull origin main

# 3. Stop current process
pm2 stop bilin-website
pm2 delete bilin-website

# 4. Start with fix
pm2 start ecosystem.config.js

# 5. Save configuration
pm2 save

# 6. Check status
pm2 status
pm2 logs bilin-website --lines 20
```

## What This Does:
- Adds `CI=true` environment variable
- Tells Next.js to run in non-interactive mode
- Works perfectly with PM2

## After Running the Fix:
1. Check website loads: http://your-domain.com
2. Check PM2 status: `pm2 status` → should show "online" ✅
3. No more setRawMode errors ✅

## Need Help?
See `PM2_FIX_GUIDE.md` for detailed troubleshooting.
