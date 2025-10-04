# 🚀 Final VPS Deployment Script

## ✅ All Issues Fixed!

The following issues have been resolved:
- ✅ Separated client and server database imports
- ✅ Added browser-safe client stub
- ✅ Implemented auth.getUser() for admin authentication
- ✅ Added dynamic rendering to all pages to prevent prerendering errors
- ✅ Build completes successfully

---

## 📋 Run These Commands on Your VPS

Copy and paste these commands **one by one** into your VPS terminal:

```bash
# Step 1: Navigate to project directory
cd /var/www/billin_ffj

# Step 2: Pull latest changes
git pull origin main

# Step 3: Install any new dependencies (if any)
npm install --legacy-peer-deps

# Step 4: Build the application
npm run build

# Step 5: Restart PM2
pm2 restart bilin-website

# Step 6: Check status
pm2 status

# Step 7: View logs (press Ctrl+C to exit)
pm2 logs bilin-website --lines 50
```

---

## 🧪 Test Your Application

After deployment, test these URLs:

1. **Homepage**: `http://31.97.72.28:3001`
2. **Admin Login**: `http://31.97.72.28:3001/auth/admin-login`
   - Email: `admin@bilin-website.com`
   - Password: `admin123`
3. **Admin Dashboard**: `http://31.97.72.28:3001/admin`

---

## 🔒 Important Security Steps

**IMMEDIATELY after testing**, change the default admin password:

```bash
cd /var/www/billin_ffj

# Generate new password hash
npm run hash:password

# Copy the hash, then update database
sudo -u postgres psql -d bilin_website -c "UPDATE admin_users SET password_hash = 'YOUR_NEW_HASH_HERE' WHERE email = 'admin@bilin-website.com';"
```

---

## 🎯 Next Steps (Optional but Recommended)

### 1. Setup Nginx Reverse Proxy

```bash
sudo apt install nginx -y

sudo nano /etc/nginx/sites-available/bilin-website
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name 31.97.72.28;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/bilin-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Now access via: `http://31.97.72.28` (port 80)

### 2. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 Monitoring Commands

```bash
# View real-time logs
pm2 logs bilin-website

# Monitor CPU/Memory
pm2 monit

# Restart if needed
pm2 restart bilin-website

# Stop application
pm2 stop bilin-website

# Start application
pm2 start bilin-website
```

---

## ✅ Migration Complete!

Your application is now fully migrated from Supabase to PostgreSQL and deployed on your VPS! 🎉
