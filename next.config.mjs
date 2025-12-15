/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  // Rewrite /uploads/* to /api/uploads/* to serve dynamically uploaded files
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ]
  },
  // TEMP: embed Supabase public env fallbacks so v0.app build doesn't fail if vars not injected.
  // Remove once environment variables are correctly set in the hosting platform.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://didfgzifinegynyjcsbw.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZGZnemlmaW5lZ3lueWpjc2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MTA0NjcsImV4cCI6MjA3MTk4NjQ2N30.kjlczAuxYHuD2l8cnwna3Wnyj0tHkcGHBsqvnCs3zlE",
  },
}

export default nextConfig
