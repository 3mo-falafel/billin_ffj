// Database connection test utility
import { getPool, query } from './connection'

export async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test basic connection
    const pool = getPool()
    console.log('✅ Database pool created successfully')
    
    // Test simple query
    const result = await query('SELECT NOW() as current_time, version() as postgres_version')
    console.log('✅ Database query successful:', result.rows[0])
    
    // Test if our tables exist
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    console.log('✅ Found tables:', tablesResult.rows.map(r => r.table_name))
    
    // Test admin_users table specifically
    const adminCheck = await query('SELECT COUNT(*) as count FROM admin_users')
    console.log('✅ Admin users table accessible, count:', adminCheck.rows[0].count)
    
    return { success: true, message: 'Database connection successful' }
    
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Full error:', error)
    
    return { 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        hostname: error.hostname
      }
    }
  }
}

export async function createTestAdmin() {
  try {
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const result = await query(`
      INSERT INTO admin_users (email, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
      RETURNING id, email, role
    `, ['admin@billin.org', hashedPassword, 'admin', true])
    
    console.log('✅ Test admin user created/updated:', result.rows[0])
    return { success: true, user: result.rows[0] }
    
  } catch (error: any) {
    console.error('❌ Failed to create test admin:', error)
    return { success: false, error: error.message }
  }
}