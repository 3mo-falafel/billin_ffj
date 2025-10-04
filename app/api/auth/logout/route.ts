import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth/session'

export async function POST() {
  try {
    // Clear authentication cookies
    await clearAuthCookies()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}
