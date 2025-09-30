import { createBrowserClient } from "@supabase/ssr"

// Graceful client creation with proper env vars
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !anon) {
    throw new Error("Missing Supabase environment variables. Please check your .env.local file.")
  }
  
  return createBrowserClient(url, anon)
}
