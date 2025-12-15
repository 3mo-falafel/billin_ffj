module.exports = {
  apps: [
    {
      name: "billin",
      cwd: "/home/deploy/apps/billin_ffj",
      script: "./node_modules/.bin/next",
      args: "start -p 3001 -H 127.0.0.1",
      env: {
        NODE_ENV: "production",
        DATABASE_HOST: "127.0.0.1",
        DATABASE_PORT: "5432",
        DATABASE_NAME: "billin_website_restored",
        DATABASE_USER: "billin_user",
        DATABASE_PASSWORD: "Falafel@12345",
        DATABASE_SSL: "false"
      }
    }
  ]
}

