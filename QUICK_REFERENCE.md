# Quick Reference Guide - PostgreSQL Operations

## 🔍 Common Database Queries

### Check All Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Count Records in All Tables
```sql
SELECT 
  schemaname,
  tablename,
  (SELECT COUNT(*) FROM pg_catalog.pg_class WHERE relname = tablename) as count
FROM pg_tables
WHERE schemaname = 'public';
```

### View Table Structure
```sql
\d+ table_name

-- Or using SQL:
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'your_table_name';
```

---

## 👤 User Management

### Create New Admin User
```sql
-- First, hash your password using bcrypt
-- Then insert:
INSERT INTO admin_users (email, password_hash, role, is_active)
VALUES (
  'new-admin@example.com',
  '$2a$10$YOUR_BCRYPT_HASH_HERE',
  'admin',
  true
);
```

### Change Admin Password
```sql
UPDATE admin_users 
SET password_hash = '$2a$10$NEW_HASH_HERE',
    updated_at = NOW()
WHERE email = 'admin@example.com';
```

### List All Admins
```sql
SELECT id, email, role, is_active, created_at 
FROM admin_users 
ORDER BY created_at DESC;
```

### Deactivate Admin User
```sql
UPDATE admin_users 
SET is_active = false, updated_at = NOW() 
WHERE email = 'user@example.com';
```

---

## 📰 Content Management

### Get Recent Activities
```sql
SELECT id, title_en, date, is_active 
FROM activities 
ORDER BY date DESC 
LIMIT 10;
```

### Publish/Unpublish Content
```sql
-- Publish
UPDATE activities SET is_active = true WHERE id = 'uuid-here';

-- Unpublish
UPDATE activities SET is_active = false WHERE id = 'uuid-here';
```

### Featured Items
```sql
-- Set as featured
UPDATE projects SET is_featured = true WHERE id = 123;

-- Get all featured projects
SELECT * FROM projects WHERE is_featured = true AND is_active = true;
```

### Delete Old Records
```sql
-- Delete activities older than 1 year
DELETE FROM activities 
WHERE date < NOW() - INTERVAL '1 year' 
AND is_active = false;
```

---

## 🔍 Search Queries

### Search Activities
```sql
SELECT * FROM activities 
WHERE (
  title_en ILIKE '%search_term%' 
  OR description_en ILIKE '%search_term%'
)
AND is_active = true;
```

### Search News
```sql
SELECT * FROM news 
WHERE (
  title_en ILIKE '%keyword%' 
  OR content_en ILIKE '%keyword%'
)
ORDER BY date DESC;
```

### Find by Date Range
```sql
SELECT * FROM activities 
WHERE date BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY date DESC;
```

---

## 📊 Analytics Queries

### Count Records by Type
```sql
SELECT category, COUNT(*) as total
FROM scholarships
WHERE is_active = true
GROUP BY category;
```

### Project Funding Progress
```sql
SELECT 
  name,
  goal_amount,
  raised_amount,
  ROUND((raised_amount / goal_amount * 100)::numeric, 2) as percent_funded
FROM projects
WHERE is_active = true
ORDER BY percent_funded DESC;
```

### Involvement Requests by Status
```sql
SELECT status, COUNT(*) as count
FROM involvement_requests
GROUP BY status
ORDER BY count DESC;
```

### Monthly Activity Count
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as activity_count
FROM activities
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY month
ORDER BY month DESC;
```

---

## 🔧 Maintenance Commands

### Vacuum Database
```sql
VACUUM ANALYZE;
```

### Reindex Tables
```sql
REINDEX TABLE activities;
REINDEX TABLE news;
-- Or reindex entire database:
REINDEX DATABASE bilin_website;
```

### Check Table Sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('bilin_website'));
```

---

## 💾 Backup & Restore

### Create Backup
```bash
# Full database backup
pg_dump -U bilin_admin bilin_website > backup.sql

# Backup specific tables
pg_dump -U bilin_admin -t activities -t news bilin_website > content_backup.sql

# Compressed backup
pg_dump -U bilin_admin bilin_website | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore Backup
```bash
# Restore full backup
psql -U bilin_admin bilin_website < backup.sql

# Restore compressed backup
gunzip < backup_20241004.sql.gz | psql -U bilin_admin bilin_website
```

### Export to CSV
```sql
COPY (SELECT * FROM activities WHERE is_active = true) 
TO '/tmp/activities.csv' 
WITH CSV HEADER;
```

### Import from CSV
```sql
COPY activities(title_en, title_ar, description_en, description_ar, date)
FROM '/tmp/activities.csv'
WITH CSV HEADER;
```

---

## 🔒 Security

### Check Active Connections
```sql
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start
FROM pg_stat_activity
WHERE datname = 'bilin_website';
```

### Kill Idle Connections
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'bilin_website'
  AND state = 'idle'
  AND state_change < NOW() - INTERVAL '10 minutes';
```

### Grant Permissions
```sql
-- Grant all on database
GRANT ALL PRIVILEGES ON DATABASE bilin_website TO bilin_admin;

-- Grant all on tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bilin_admin;

-- Grant all on sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bilin_admin;
```

---

## 📈 Performance Monitoring

### Show Slow Queries
```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Index Usage
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### Table Statistics
```sql
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;
```

---

## 🛠️ Useful psql Commands

```bash
# Connect to database
psql -U bilin_admin -d bilin_website

# Inside psql:
\l              # List all databases
\dt             # List all tables
\d table_name   # Describe table
\du             # List users/roles
\dn             # List schemas
\df             # List functions
\dv             # List views
\di             # List indexes
\x              # Toggle expanded output
\q              # Quit
\?              # Help
\h SQL_COMMAND  # Help on specific SQL command

# Execute SQL file
\i /path/to/file.sql

# Change output format
\pset format wrapped
```

---

## 🚨 Emergency Procedures

### Database Not Responding
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Out of Disk Space
```bash
# Check disk usage
df -h

# Find large tables
psql -U bilin_admin -d bilin_website -c "
  SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
  FROM pg_tables WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"

# Clean up old data
# Run appropriate DELETE queries

# Vacuum to reclaim space
psql -U bilin_admin -d bilin_website -c "VACUUM FULL;"
```

### Corrupted Data
```bash
# Restore from latest backup
psql -U bilin_admin -d bilin_website < /backups/latest_backup.sql

# If backup is corrupted, try previous backup
psql -U bilin_admin -d bilin_website < /backups/previous_backup.sql
```

---

## 📞 Quick Contact

### Check Application Status
```bash
# PM2 status
pm2 status

# View logs
pm2 logs bilin-website

# Restart app
pm2 restart bilin-website
```

### Check Nginx Status
```bash
# Status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Restart
sudo systemctl restart nginx
```

### Test Database Connection from App
```bash
cd /var/www/bilin_ffj
node -e "
  const { query } = require('./lib/db/connection');
  query('SELECT NOW()').then(r => console.log('Connected:', r.rows[0]));
"
```

---

## 💡 Pro Tips

1. **Always backup before major changes**
```bash
pg_dump -U bilin_admin bilin_website > backup_before_changes.sql
```

2. **Use transactions for multiple updates**
```sql
BEGIN;
UPDATE activities SET is_active = false WHERE date < '2023-01-01';
UPDATE news SET is_active = false WHERE date < '2023-01-01';
-- Check results, then:
COMMIT;
-- Or if something is wrong:
ROLLBACK;
```

3. **Explain query plans**
```sql
EXPLAIN ANALYZE 
SELECT * FROM activities WHERE is_active = true;
```

4. **Create indexes for frequently queried columns**
```sql
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
```

5. **Regular maintenance schedule**
```bash
# Add to crontab:
0 2 * * * psql -U bilin_admin -d bilin_website -c "VACUUM ANALYZE;"
0 3 * * 0 pg_dump -U bilin_admin bilin_website > /backups/weekly_$(date +\%Y\%m\%d).sql
```

---

*Last Updated: October 4, 2025*
