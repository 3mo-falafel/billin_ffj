/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
