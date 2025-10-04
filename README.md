# Bilin Website - PostgreSQL Version

A Next.js website for the Bilin community, fully powered by PostgreSQL on VPS.

## 🎯 About This Version

This project has been **completely migrated from Supabase to PostgreSQL**. All data is now stored and managed on your own VPS, giving you full control and ownership.

## ✨ Features

- 🏛️ Complete content management system
- 📰 News and activities management
- 🖼️ Photo and video gallery
- 🎓 Scholarship management
- 🤝 Community involvement requests
- 🧵 Traditional embroidery showcase
- 💰 Project funding tracking
- 🔐 Secure admin authentication
- 🌍 Bilingual support (English/Arabic)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone Repository

```bash
git clone https://github.com/3mo-falafel/billin_ffj.git
cd billin_ffj
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Setup Database

#### On VPS:

```bash
# Install PostgreSQL
sudo apt update && sudo apt install postgresql postgresql-contrib -y

# Create database and user
sudo -u postgres createdb bilin_website
sudo -u postgres psql -c "CREATE USER bilin_admin WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bilin_website TO bilin_admin;"

# Run migration scripts
psql -U bilin_admin -d bilin_website -f database/01_schema.sql
psql -U bilin_admin -d bilin_website -f database/02_seed_data.sql
```

### 4. Configure Environment

```bash
cp .env.example .env.local
nano .env.local
```

Update with your database credentials:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bilin_website
DATABASE_USER=bilin_admin
DATABASE_PASSWORD=your-secure-password
DATABASE_SSL=false

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 5. Test Database Connection

```bash
npm run db:test
```

### 6. Build & Start

```bash
# Build for production
npm run build

# Start production server
npm start

# Or for development
npm run dev
```

## 🔐 Default Admin Login

After running the seed data:

- **Email:** `admin@bilin-website.com`
- **Password:** `admin123`

**⚠️ Change this password immediately!**

Generate a new password hash:

```bash
npm run hash:password YourNewPassword123
```

Then update in database:

```sql
UPDATE admin_users 
SET password_hash = 'generated-hash-here' 
WHERE email = 'admin@bilin-website.com';
```

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete VPS deployment instructions
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Detailed migration information
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Common database operations

## 🗂️ Project Structure

```
billin_ffj/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/
│   ├── db/                # Database connection & client
│   │   ├── connection.ts  # PostgreSQL pool
│   │   └── client.ts      # Supabase-compatible API
│   ├── auth/              # Authentication
│   │   ├── auth.ts        # JWT & bcrypt functions
│   │   └── session.ts     # Session management
│   └── supabase/          # Legacy imports (redirects to db/)
├── database/              # SQL migration scripts
│   ├── 01_schema.sql      # Database schema
│   └── 02_seed_data.sql   # Sample data
├── scripts/               # Utility scripts
│   ├── hash-password.js   # Generate password hashes
│   └── test-db-connection.js  # Test database
├── public/                # Static files
└── middleware.ts          # JWT authentication middleware
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:test      # Test database connection
npm run hash:password [password]  # Generate password hash
```

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Admin authentication |
| `activities` | Community activities |
| `news` | News articles |
| `gallery` | Photo/video gallery |
| `homepage_gallery` | Homepage carousel |
| `news_ticker` | Ticker messages |
| `scholarships` | Scholarship programs |
| `involvement_requests` | Community involvement |
| `traditional_embroidery` | Embroidery showcase |
| `embroidery_for_sale` | Items for sale |
| `projects` | Community projects |
| `handmade_items` | Handmade crafts |

## 🔧 Common Tasks

### Create New Admin User

```bash
# Generate password hash
npm run hash:password MySecurePassword123

# Then in PostgreSQL:
psql -U bilin_admin -d bilin_website
```

```sql
INSERT INTO admin_users (email, password_hash, role, is_active)
VALUES ('new-admin@example.com', 'generated-hash', 'admin', true);
```

### Backup Database

```bash
pg_dump -U bilin_admin bilin_website > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
psql -U bilin_admin bilin_website < backup_20241004.sql
```

### View Logs (Production)

```bash
# Application logs (if using PM2)
pm2 logs bilin-website

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 🚨 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection manually
psql -U bilin_admin -d bilin_website -h localhost

# Check firewall
sudo ufw status
```

### Application Won't Start

```bash
# Check build errors
npm run build

# Verify environment variables
cat .env.local

# Test database connection
npm run db:test
```

### Permission Errors

```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE bilin_website TO bilin_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bilin_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bilin_admin;
```

## 📈 Performance Tips

1. **Enable PostgreSQL connection pooling** (already configured)
2. **Add indexes** for frequently queried columns
3. **Regular VACUUM** to optimize database
4. **Monitor slow queries** using `pg_stat_statements`
5. **Use CDN** for static assets
6. **Enable gzip compression** in Nginx

## 🔒 Security Checklist

- [x] Use strong JWT_SECRET (32+ characters)
- [x] Change default admin password
- [ ] Enable SSL for PostgreSQL in production
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Set up automated backups
- [ ] Enable HTTPS (SSL certificate)
- [ ] Implement rate limiting
- [ ] Regular database backups

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For deployment issues, refer to:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Common operations
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Migration details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [PostgreSQL](https://www.postgresql.org/)
- UI Components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Bilin Website** - Empowering the community through technology 🌟

*Migrated from Supabase to PostgreSQL - October 2025*

