# Deployment Guide - Billin FFJ Website

## VPS Information
- **IP Address:** 31.97.72.28
- **Port:** 3001
- **OS:** Ubuntu Noble
- **Database:** PostgreSQL 16
- **Process Manager:** PM2

## Project Information
- **Project Path:** /var/www/billin_ffj
- **PM2 App Name:** bilin-website
- **Database Name:** bilin_website
- **Database User:** bilin_admin
- **Database Password:** iyadSK2008

## Admin Credentials
- **Email:** ffjisk@billin.org
- **Password:** iyadSK2008
- **Login URL:** http://31.97.72.28:3001/auth/admin-login

---

## Quick Deployment

### One-Line Deploy Command
```bash
ssh root@31.97.72.28 "cd /var/www/billin_ffj && git pull origin main && npm install && rm -rf .next && npm run build && pm2 restart bilin-website && pm2 logs bilin-website --lines 20"
```

### Manual Step-by-Step

**Step 1:** Connect to VPS
```bash
ssh root@31.97.72.28
```

**Step 2:** Navigate and pull changes
```bash
cd /var/www/billin_ffj
git pull origin main
```

**Step 3:** Install dependencies (if needed)
```bash
npm install
```

**Step 4:** Build project
```bash
rm -rf .next
npm run build
```

**Step 5:** Restart PM2
```bash
pm2 restart bilin-website
```

**Step 6:** Verify
```bash
pm2 logs bilin-website --lines 50
```

---

## Troubleshooting Guide

### Issue: Admin Forms Don't Save

**Symptom:** Click "Save" but nothing happens

**Solution:**
1. Check browser console (F12) for errors
2. Check column names match database:
   ```bash
   psql -U bilin_admin -d bilin_website -h localhost -p 3001 -c "\d+ table_name"
   ```
3. Common mismatches:
   - News Ticker: Use `message_en/message_ar` NOT `text_en/text_ar`
   - Homepage Gallery: Use `display_order` NOT `order_index`

### Issue: Can't Login to Admin

**Solution:**
```sql
psql -U bilin_admin -d bilin_website -h localhost -p 3001

UPDATE admin_users 
SET password_hash = '$2a$10$WMZpPYYt6XMOyArZF//fFO27.UrLLS2ZF9XUqdPNv8Fb2ZAnS2jUS',
    is_active = true
WHERE email = 'ffjisk@billin.org';
```

### Issue: News Ticker Not Showing

**Solution:**
```sql
psql -U bilin_admin -d bilin_website -h localhost -p 3001

SELECT * FROM news_ticker WHERE is_active = true;

-- If empty, add test items:
INSERT INTO news_ticker (message_en, message_ar, display_order, is_active) VALUES
('Weekly demonstrations continue every Friday at 12 PM', 'المظاهرات الأسبوعية تستمر كل جمعة في الساعة 12 ظهراً', 1, true);
```

---

## PM2 Commands

```bash
# Status
pm2 status

# Logs (live)
pm2 logs bilin-website

# Restart
pm2 restart bilin-website

# Stop
pm2 stop bilin-website

# Start
pm2 start bilin-website

# View errors only
pm2 logs bilin-website --err --lines 100
```

---

## Database Commands

```bash
# Connect
psql -U bilin_admin -d bilin_website -h localhost -p 3001

# In psql:
\dt                # List tables
\d+ table_name     # Describe table
SELECT * FROM news_ticker LIMIT 5;  # View data
\q                 # Exit
```

---

## Quick Reference

**Check everything:**
```bash
pm2 status && systemctl status postgresql && df -h
```

**Emergency restart:**
```bash
pm2 restart bilin-website && pm2 logs bilin-website
```

**Database backup:**
```bash
pg_dump -U bilin_admin -d bilin_website > backup_$(date +%Y%m%d).sql
```

---

## Post-Deployment Testing

1. Visit http://31.97.72.28:3001
2. Check homepage loads
3. Check news ticker displays
4. Login to admin
5. Test 2-3 admin sections (add/edit/delete)
6. Check TESTING_CHECKLIST.md for full test suite

---

**Repository:** https://github.com/3mo-falafel/billin_ffj
