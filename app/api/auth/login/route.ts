import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth/auth'
import { setAuthCookies } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Login attempt for:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Authenticate user
    const result = await signIn(email, password)

    if (!result) {
      console.log('Login failed: Invalid credentials')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('Login successful for user:', result.user.email)

    // Set authentication cookies
    await setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken)

    console.log('Cookies set successfully')

    // Return success response with redirect URL
    return NextResponse.json({
      success: true,
      redirectTo: '/admin',
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}