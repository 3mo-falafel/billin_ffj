# Bilin Website - PostgreSQL Migration & VPS Deployment Guide

## 🎯 Overview

This project has been **completely migrated from Supabase to PostgreSQL**. All Supabase dependencies have been removed and replaced with native PostgreSQL functionality running on your VPS.

## ✅ What Was Changed

### 1. **Dependencies Removed**
- `@supabase/supabase-js` ❌
- `@supabase/ssr` ❌

### 2. **Dependencies Added**
- `pg` (node-postgres) - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- TypeScript type definitions for all above

### 3. **Code Changes**
- Created `lib/db/connection.ts` - PostgreSQL connection pool
- Created `lib/db/client.ts` - Database client with Supabase-compatible API
- Created `lib/auth/auth.ts` - JWT-based authentication
- Created `lib/auth/session.ts` - Session management
- Updated `lib/supabase/*` files to use PostgreSQL
- Updated `middleware.ts` to use JWT tokens
- All existing component code works without changes (API-compatible)

### 4. **Database**
- Complete SQL schema in `database/01_schema.sql`
- Sample data in `database/02_seed_data.sql`
- 12 tables migrated with indexes and triggers

---

## 🚀 VPS Setup Instructions

### Step 1: Install PostgreSQL on VPS

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Step 2: Configure PostgreSQL

```bash
# Switch to postgres user
sudo -i -u postgres

# Create database
createdb bilin_website

# Create database user
psql -c "CREATE USER bilin_admin WITH PASSWORD 'your-secure-password';"

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE bilin_website TO bilin_admin;"

# Exit postgres user
exit
```

### Step 3: Configure PostgreSQL for Remote Access

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and update this line:
listen_addresses = '*'

# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line at the end (replace YOUR_IP with your server/allowed IP):
host    all             all             0.0.0.0/0               md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Step 4: Run Database Migration Scripts

```bash
# Copy SQL files to VPS
scp database/01_schema.sql user@your-vps:/tmp/
scp database/02_seed_data.sql user@your-vps:/tmp/

# On VPS, run the scripts
psql -U bilin_admin -d bilin_website -f /tmp/01_schema.sql
psql -U bilin_admin -d bilin_website -f /tmp/02_seed_data.sql

# Verify tables were created
psql -U bilin_admin -d bilin_website -c "\dt"
```

### Step 5: Configure Firewall

```bash
# Allow PostgreSQL port (if using external connections)
sudo ufw allow 5432/tcp

# Or for specific IP only:
sudo ufw allow from YOUR_IP to any port 5432

# Reload firewall
sudo ufw reload
```

---

## 📦 Application Deployment on VPS

### Step 1: Install Node.js

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Clone and Setup Application

```bash
# Clone your repository
cd /var/www
git clone https://github.com/3mo-falafel/billin_ffj.git
cd billin_ffj

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local
```

### Step 3: Configure Environment Variables

Edit `.env.local`:

```bash
nano .env.local
```

Update with your VPS details:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bilin_website
DATABASE_USER=bilin_admin
DATABASE_PASSWORD=your-secure-password
DATABASE_SSL=false

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Step 4: Build Application

```bash
# Build the Next.js application
npm run build

# Test the build
npm start
```

### Step 5: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start npm --name "bilin-website" -- start

# Configure PM2 to start on system boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs bilin-website
```

### Step 6: Setup Nginx as Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/bilin-website
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Upload directory for images/videos
    location /uploads {
        alias /var/www/bilin_ffj/public/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/bilin-website /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 7: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure Nginx for HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 🔐 Default Admin Credentials

After running the seed data script, you can login with:

- **Email:** `admin@bilin-website.com`
- **Password:** `admin123`

**⚠️ IMPORTANT: Change this password immediately after first login!**

To change the admin password, you can run this SQL query:

```sql
-- Generate new password hash (for "your-new-password")
-- Use bcrypt to hash your desired password
UPDATE admin_users 
SET password_hash = '$2a$10$YOUR_NEW_BCRYPT_HASH_HERE'
WHERE email = 'admin@bilin-website.com';
```

Or create a new admin user:

```sql
INSERT INTO admin_users (email, password_hash, role, is_active)
VALUES (
  'your-email@example.com',
  '$2a$10$YOUR_BCRYPT_HASH_HERE',
  'admin',
  true
);
```

---

## 📁 File Upload Configuration

The application now stores uploaded files in the `public/uploads` directory instead of Supabase Storage.

### Setup Upload Directory

```bash
# Create uploads directory
mkdir -p /var/www/bilin_ffj/public/uploads

# Set proper permissions
sudo chown -R www-data:www-data /var/www/bilin_ffj/public/uploads
sudo chmod -R 755 /var/www/bilin_ffj/public/uploads
```

### File Upload Implementation

You'll need to implement file upload handling. Here's a basic example for an API route:

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(process.cwd(), 'public/uploads', filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({
      url: `/uploads/${filename}`,
      success: true
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

---

## 🔍 Database Connection Testing

Test your database connection:

```typescript
// test-db.ts
import { query } from './lib/db/connection'

async function testConnection() {
  try {
    const result = await query('SELECT NOW()')
    console.log('✅ Database connected successfully!')
    console.log('Server time:', result.rows[0].now)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

testConnection()
```

Run it:

```bash
npx ts-node test-db.ts
```

---

## 🛠️ Troubleshooting

### Issue: Can't connect to PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Test connection manually
psql -U bilin_admin -d bilin_website -h localhost
```

### Issue: Permission denied for database

**Solution:**
```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE bilin_website TO bilin_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bilin_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bilin_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bilin_admin;
```

### Issue: Application won't start

**Solution:**
```bash
# Check PM2 logs
pm2 logs bilin-website

# Check build errors
npm run build

# Check environment variables
cat .env.local
```

### Issue: 502 Bad Gateway

**Solution:**
```bash
# Check if app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart bilin-website
sudo systemctl restart nginx
```

---

## 📊 Monitoring & Maintenance

### Monitor Application

```bash
# View PM2 dashboard
pm2 monit

# View logs
pm2 logs bilin-website

# Restart app
pm2 restart bilin-website

# View app info
pm2 info bilin-website
```

### Database Backup

```bash
# Create backup
pg_dump -U bilin_admin bilin_website > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U bilin_admin bilin_website < backup_20241004.sql

# Automated daily backup (add to crontab)
0 2 * * * pg_dump -U bilin_admin bilin_website > /backups/bilin_$(date +\%Y\%m\%d).sql
```

### Update Application

```bash
cd /var/www/bilin_ffj

# Pull latest changes
git pull origin main

# Install dependencies if package.json changed
npm install --legacy-peer-deps

# Rebuild
npm run build

# Restart PM2
pm2 restart bilin-website
```

---

## 🎉 Migration Complete!

Your Bilin website is now running entirely on PostgreSQL on your VPS with:
- ✅ No Supabase dependencies
- ✅ Full database control
- ✅ JWT-based authentication
- ✅ File storage on VPS
- ✅ Complete data ownership

For any issues or questions, refer to the troubleshooting section above.

---

## 📞 Support

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Next.js Documentation: https://nextjs.org/docs
- PM2 Documentation: https://pm2.keymetrics.io/docs/
- Nginx Documentation: https://nginx.org/en/docs/
