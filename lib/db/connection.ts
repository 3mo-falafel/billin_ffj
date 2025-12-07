// Server-only database connection pool
// This file uses Node.js modules and should only be imported server-side
import 'server-only';
import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg'

// Get password - must be a non-empty string or undefined
const dbPassword = process.env.DATABASE_PASSWORD && process.env.DATABASE_PASSWORD.trim() !== '' 
  ? process.env.DATABASE_PASSWORD 
  : undefined

// PostgreSQL connection configuration
const poolConfig: PoolConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'bilin_website',
  user: process.env.DATABASE_USER || 'postgres',
  password: dbPassword,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 20000, // Return an error after 20 seconds if connection could not be established
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
}

// Log configuration for debugging (without password)
console.log('Database configuration:', {
  host: poolConfig.host,
  port: poolConfig.port,
  database: poolConfig.database,
  user: poolConfig.user,
  ssl: poolConfig.ssl,
  hasPassword: !!poolConfig.password,
  passwordLength: poolConfig.password ? String(poolConfig.password).length : 0
})

// Create a single pool instance to be shared across the application
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(poolConfig)
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err)
      process.exit(-1)
    })
  }
  
  return pool
}

// Query helper function
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool()
  const start = Date.now()
  
  try {
    const result = await pool.query<T>(text, params)
    const duration = Date.now() - start
    
    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: result.rowCount })
    }
    
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Close pool connection (useful for graceful shutdown)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
