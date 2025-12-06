# PM2 setRawMode Error - Fix Guide

## Problem
```
[Error: setRawMode EIO] {
  errno: -5,
  code: 'EIO',
  syscall: 'setRawMode'
}
```

## Root Cause
Next.js tries to use interactive terminal features (like reading from stdin) which are not available when running as a PM2 daemon process.

## Solutions

### Solution 1: Use Ecosystem Config (RECOMMENDED)

1. **Copy the ecosystem.config.js to your server:**
   ```bash
   cd /var/www/billin_ffj
   # File should already be in the repo after git pull
   ls -la ecosystem.config.js
   ```

2. **Stop and remove current PM2 process:**
   ```bash
   pm2 stop bilin-website
   pm2 delete bilin-website
   ```

3. **Start using ecosystem config:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   ```

4. **Verify it's running:**
   ```bash
   pm2 status
   pm2 logs bilin-website --lines 50
   ```

### Solution 2: Quick Fix with Environment Variable

If you don't have the ecosystem file, use this quick fix:

```bash
cd /var/www/billin_ffj
pm2 stop bilin-website
pm2 delete bilin-website
CI=true pm2 start npm --name "bilin-website" -- start
pm2 save
```

### Solution 3: Use the Fix Script

Run the automated fix script:

```bash
cd /var/www/billin_ffj
bash fix-pm2-error.sh
```

## What the Fix Does

The `CI=true` environment variable tells Next.js:
- Don't use interactive terminal features
- Don't try to read from stdin
- Run in non-interactive mode (suitable for CI/CD and daemons)

## Verification Steps

After applying the fix:

1. **Check PM2 Status:**
   ```bash
   pm2 status
   ```
   Should show: `status: online` ✅

2. **Check Logs:**
   ```bash
   pm2 logs bilin-website --lines 50
   ```
   Should NOT show the setRawMode error ✅

3. **Test the Website:**
   ```bash
   curl http://localhost:3000
   ```
   Should return HTML ✅

4. **Check in Browser:**
   Visit your domain - site should load ✅

## Troubleshooting

### If the error persists:

1. **Check Next.js version:**
   ```bash
   cd /var/www/billin_ffj
   grep "next" package.json
   ```
   Should be Next.js 15.5.2

2. **Rebuild the application:**
   ```bash
   cd /var/www/billin_ffj
   pnpm build
   pm2 restart bilin-website
   ```

3. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be v18+ or v20+

4. **Check PM2 logs for other errors:**
   ```bash
   pm2 logs bilin-website --err --lines 100
   ```

### If still not working:

1. **Clear PM2 logs:**
   ```bash
   pm2 flush
   ```

2. **Delete and recreate process:**
   ```bash
   pm2 delete bilin-website
   pm2 start ecosystem.config.js
   pm2 save
   ```

3. **Restart PM2 daemon:**
   ```bash
   pm2 kill
   pm2 resurrect
   ```

## Alternative: Using systemd instead of PM2

If PM2 continues to have issues, you can use systemd:

Create `/etc/systemd/system/bilin-website.service`:
```ini
[Unit]
Description=Bilin Website Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/billin_ffj
Environment="NODE_ENV=production"
Environment="PORT=3000"
Environment="CI=true"
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable bilin-website
sudo systemctl start bilin-website
sudo systemctl status bilin-website
```

## Prevention

To avoid this error in the future:

1. **Always use `CI=true` with PM2:**
   - Add to ecosystem.config.js
   - Or use in command: `CI=true pm2 start ...`

2. **Use ecosystem.config.js:**
   - Standardizes configuration
   - Easier to maintain
   - Version controlled

3. **Test locally before deploying:**
   ```bash
   # On dev machine
   CI=true npm run build
   CI=true npm start
   ```

## Summary

✅ **Quick Fix**: `pm2 delete bilin-website && CI=true pm2 start npm --name "bilin-website" -- start && pm2 save`

✅ **Proper Fix**: Use `ecosystem.config.js` with CI=true environment variable

✅ **Root Cause**: Next.js interactive features incompatible with PM2 daemon mode

✅ **Prevention**: Always set CI=true when running Next.js with PM2
