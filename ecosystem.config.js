module.exports = {
  apps: [{
    name: 'bilin-website',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/billin_ffj',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Disable Next.js interactive features for PM2
      CI: 'true',
      // Add your database credentials
      DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
      DATABASE_PORT: process.env.DATABASE_PORT || '5432',
      DATABASE_NAME: process.env.DATABASE_NAME || 'bilin_website',
      DATABASE_USER: process.env.DATABASE_USER || 'bilin_admin',
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
      // Add Supabase credentials if using
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    },
    error_file: '/var/www/billin_ffj/logs/pm2-error.log',
    out_file: '/var/www/billin_ffj/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
