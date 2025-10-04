# 🔧 VPS 500 Error Troubleshooting Guide

## Quick Diagnosis

Run this command on your VPS to diagnose the issue:

```bash
cd /var/www/billin_ffj
npm run diagnose
```

This will check:
- ✓ Environment variables are set correctly
- ✓ Database connection works
- ✓ Database tables exist
- ✓ Admin user exists

---

## Common Issues & Solutions

### Issue 1: Environment Variables Not Set

**Symptoms:** `DATABASE_HOST: ❌ NOT SET` or similar in diagnostic output

**Solution:**
```bash
cd /var/www/billin_ffj
nano .env.local
```

Verify your `.env.local` contains:
```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bilin_website
DATABASE_USER=bilin_admin
DATABASE_PASSWORD=iyadSK2008
DATABASE_SSL=false

JWT_SECRET=K8mP3nR7qT2wX9jL5vH4bN6cM1aZ8dF0gY3sE7uI2oQ5
JWT_REFRESH_SECRET=W9xC4vB2nM7aS5dF8gH1jK3lP0qR6tY4zE9uI7oA2wQ5
JWT_EXPIRES_IN=7d

NODE_ENV=production
NEXT_PUBLIC_SITE_URL=http://31.97.72.28:3001
```

After editing, restart PM2:
```bash
pm2 restart bilin-website --update-env
```

---

### Issue 2: Database Connection Failed

**Symptoms:** `connection refused` or `timeout` in diagnostic

**Check PostgreSQL is running:**
```bash
sudo systemctl status postgresql
```

If not running:
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Check PostgreSQL accepts connections:**
```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Ensure:
```
listen_addresses = 'localhost'  # or '*' for all
port = 5432
```

**Check pg_hba.conf:**
```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Add this line if not present:
```
local   all             bilin_admin                             md5
host    all             bilin_admin     127.0.0.1/32            md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

### Issue 3: Database Not Created

**Symptoms:** `database "bilin_website" does not exist`

**Solution:**
```bash
sudo -u postgres psql
```

Then:
```sql
CREATE DATABASE bilin_website;
CREATE USER bilin_admin WITH PASSWORD 'iyadSK2008';
GRANT ALL PRIVILEGES ON DATABASE bilin_website TO bilin_admin;
\c bilin_website
GRANT ALL ON SCHEMA public TO bilin_admin;
\q
```

---

### Issue 4: Tables Not Created

**Symptoms:** `No tables found!` in diagnostic output

**Solution - Import database schema:**
```bash
cd /var/www/billin_ffj
psql -U bilin_admin -d bilin_website -f database/01_schema.sql
psql -U bilin_admin -d bilin_website -f database/02_seed_data.sql
```

If you get password prompt, the password is: `iyadSK2008`

---

### Issue 5: Permission Denied

**Symptoms:** `permission denied for schema public`

**Solution:**
```bash
sudo -u postgres psql bilin_website
```

Then:
```sql
GRANT ALL ON SCHEMA public TO bilin_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bilin_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bilin_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bilin_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bilin_admin;
\q
```

---

### Issue 6: Port 3001 Already in Use

**Check what's using the port:**
```bash
sudo lsof -i :3001
```

**Kill the process:**
```bash
pm2 delete bilin-website
pm2 start ecosystem.config.js
```

---

## Verify Database Manually

```bash
# Connect to database
psql -U bilin_admin -d bilin_website

# Check tables
\dt

# Check admin users
SELECT id, email, full_name, created_at FROM admin_users;

# Exit
\q
```

---

## Check PM2 Logs for Errors

```bash
# View logs
pm2 logs bilin-website --lines 100

# View only error logs
pm2 logs bilin-website --err --lines 50

# Clear logs and restart
pm2 flush
pm2 restart bilin-website
pm2 logs bilin-website
```

---

## Manual Build Check

```bash
cd /var/www/billin_ffj

# Check if .next folder exists
ls -la .next/

# If not, rebuild
npm run build

# Start manually to see errors
npm start
# Press Ctrl+C to stop, then use PM2 again
pm2 start ecosystem.config.js
```

---

## Nuclear Option: Complete Reset

If nothing works, do a complete reset:

```bash
# Stop PM2
pm2 delete bilin-website

# Drop and recreate database
sudo -u postgres psql
DROP DATABASE IF EXISTS bilin_website;
CREATE DATABASE bilin_website;
GRANT ALL PRIVILEGES ON DATABASE bilin_website TO bilin_admin;
\c bilin_website
GRANT ALL ON SCHEMA public TO bilin_admin;
\q

# Reimport schema
cd /var/www/billin_ffj
psql -U bilin_admin -d bilin_website -f database/01_schema.sql
psql -U bilin_admin -d bilin_website -f database/02_seed_data.sql

# Verify .env.local exists and is correct
cat .env.local

# Rebuild
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 logs bilin-website
```

---

## Test Connection from Command Line

```bash
cd /var/www/billin_ffj

# Test database connection
npm run db:test

# Run diagnostic
npm run diagnose

# If both pass, the issue might be in the application code
```

---

## Get Help

If you still see 500 errors after trying these steps:

1. Run `npm run diagnose` and share the output
2. Run `pm2 logs bilin-website --lines 100` and share the error logs
3. Run `cat .env.local` (hide the passwords) and verify variables are set

---

## Success Indicators

When everything works:
- ✅ `npm run diagnose` - All checks pass
- ✅ `pm2 status` - Shows "online" status
- ✅ `pm2 logs bilin-website` - No errors, shows "ready on port 3001"
- ✅ Browser at http://31.97.72.28:3001 - Shows homepage
