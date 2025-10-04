import { NextResponse, type NextRequest } from "next/server"

/**
 * Simplified middleware for Edge Runtime
 * 
 * Note: Middleware runs in Edge Runtime which doesn't support Node.js modules
 * like crypto, bcrypt, jsonwebtoken, or pg. Therefore, we only check for the
 * presence of the auth token cookie here. Actual JWT verification and database
 * checks happen in the page components using the server-side API.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value

  // Protect admin routes - just check if token exists
  // Full verification happens server-side in the page components
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/admin-login"
      return NextResponse.redirect(url)
    }
  }

  return response
}
