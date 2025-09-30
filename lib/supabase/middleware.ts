import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Allow graceful fallback if env vars not injected by host yet.
  const fallbackUrl = "https://didfgzifinegynyjcsbw.supabase.co"
  const fallbackAnon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZGZnemlmaW5lZ3lueWpjc2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MTA0NjcsImV4cCI6MjA3MTk4NjQ2N30.kjlczAuxYHuD2l8cnwna3Wnyj0tHkcGHBsqvnCs3zlE"
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackAnon
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Using fallback Supabase credentials embedded in middleware. Set env vars to override.")
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/admin-login"
      return NextResponse.redirect(url)
    }

    // Check if user is admin
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

    if (!adminUser) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
