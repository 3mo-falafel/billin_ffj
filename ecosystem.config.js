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
    env_file: '.env.local',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      // Disable Next.js interactive features for PM2
      CI: 'true'
      // Database credentials should be in .env.local file on the server
      // DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD
    },
    error_file: '/var/www/billin_ffj/logs/pm2-error.log',
    out_file: '/var/www/billin_ffj/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
