import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from '../db/connection'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface User {
  id: string
  email: string
  role: string
  created_at?: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as any
  )
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '30d' } as any
  )
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    }
  } catch (error) {
    return null
  }
}

/**
 * Sign in user with email and password
 */
export async function signIn(email: string, password: string): Promise<{ user: User; tokens: AuthTokens } | null> {
  try {
    // Query admin_users table
    const result = await query(
      'SELECT id, email, role, password_hash FROM admin_users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return null
    }

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    const tokens = {
      accessToken: generateAccessToken(userWithoutPassword),
      refreshToken: generateRefreshToken(userWithoutPassword)
    }

    return { user: userWithoutPassword, tokens }
  } catch (error) {
    console.error('Sign in error:', error)
    return null
  }
}

/**
 * Sign up new user
 */
export async function signUp(email: string, password: string, role: string = 'admin'): Promise<{ user: User; tokens: AuthTokens } | null> {
  try {
    // Check if user already exists
    const existing = await query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    )

    if (existing.rows.length > 0) {
      throw new Error('User already exists')
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Insert new user
    const result = await query(
      `INSERT INTO admin_users (id, email, password_hash, role, created_at, updated_at) 
       VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) 
       RETURNING id, email, role`,
      [email, passwordHash, role]
    )

    const user = result.rows[0]

    const tokens = {
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    }

    return { user, tokens }
  } catch (error) {
    console.error('Sign up error:', error)
    return null
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await query(
      'SELECT id, email, role, created_at FROM admin_users WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

/**
 * Refresh access token using refresh token
 */
export function refreshAccessToken(refreshToken: string): string | null {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any
    const user: User = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    }
    return generateAccessToken(user)
  } catch (error) {
    return null
  }
}
