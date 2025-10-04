'use server'

import { signIn } from '@/lib/auth/auth'
import { setAuthCookies } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('🔵 Server Action - Login attempt for:', email)

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    // Authenticate user
    const result = await signIn(email, password)

    if (!result) {
      console.log('🔴 Server Action - Login failed: Invalid credentials')
      return { error: 'Invalid email or password' }
    }

    console.log('✅ Server Action - Login successful for user:', result.user.email)

    // Set authentication cookies
    await setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken)

    console.log('✅ Server Action - Cookies set successfully')

    // Redirect happens server-side
    redirect('/admin')
  } catch (error) {
    console.error('🔴 Server Action - Login error:', error)
    return { error: 'An error occurred during login' }
  }
}
