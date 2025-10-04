import { NextResponse, type NextRequest } from "next/server"
import { verifyToken } from "../auth/auth"
import { query } from "../db/connection"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value

  // Verify token and get user
  let user = null
  if (token) {
    user = verifyToken(token)
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/admin-login"
      return NextResponse.redirect(url)
    }

    // Check if user is admin in database
    try {
      const result = await query(
        "SELECT * FROM admin_users WHERE id = $1",
        [user.id]
      )

      if (result.rows.length === 0) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Admin check error:', error)
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return response
}
