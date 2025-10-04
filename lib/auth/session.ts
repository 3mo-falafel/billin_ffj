import { cookies } from 'next/headers'
import { verifyToken, User } from './auth'

const SESSION_COOKIE_NAME = 'auth_token'
const REFRESH_COOKIE_NAME = 'refresh_token'

/**
 * Set auth cookies
 */
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  
  // For HTTP (IP address access), secure must be false
  // Only use secure: true if accessing via HTTPS domain
  const isProduction = process.env.NODE_ENV === 'production'
  const useSecure = isProduction && process.env.USE_HTTPS === 'true'
  
  // Set access token cookie (7 days)
  cookieStore.set(SESSION_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: useSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  // Set refresh token cookie (30 days)
  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: useSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  
  console.log('Cookies set with options:', {
    httpOnly: true,
    secure: useSecure,
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    console.log('getCurrentUser - Token exists:', !!token)

    if (!token) {
      console.log('getCurrentUser - No token found')
      return null
    }

    const user = verifyToken(token)
    console.log('getCurrentUser - User verified:', user ? user.email : 'null')
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Clear auth cookies (logout)
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies()
  
  cookieStore.delete(SESSION_COOKIE_NAME)
  cookieStore.delete(REFRESH_COOKIE_NAME)
}

/**
 * Get access token from cookies
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value || null
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null && user.role === 'admin'
}
