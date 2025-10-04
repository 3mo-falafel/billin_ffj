#!/usr/bin/env node

/**
 * VPS Diagnostic Script
 * Run this on the VPS to diagnose connection issues
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function diagnose() {
  console.log('🔍 Starting VPS Diagnostics...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  DATABASE_HOST:', process.env.DATABASE_HOST || '❌ NOT SET');
  console.log('  DATABASE_PORT:', process.env.DATABASE_PORT || '❌ NOT SET');
  console.log('  DATABASE_NAME:', process.env.DATABASE_NAME || '❌ NOT SET');
  console.log('  DATABASE_USER:', process.env.DATABASE_USER || '❌ NOT SET');
  console.log('  DATABASE_PASSWORD:', process.env.DATABASE_PASSWORD ? '✓ SET' : '❌ NOT SET');
  console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✓ SET' : '❌ NOT SET');
  console.log('  JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? '✓ SET' : '❌ NOT SET');
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log();

  // Test database connection
  console.log('🔌 Testing Database Connection...');
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    database: process.env.DATABASE_NAME || 'bilin_website',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    connectionTimeoutMillis: 10000, // 10 seconds for diagnostic
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Test query
    console.log('📊 Testing Database Query...');
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Query successful!');
    console.log('  Current Time:', result.rows[0].current_time);
    console.log('  PostgreSQL Version:', result.rows[0].pg_version);
    console.log();

    // Check tables
    console.log('📁 Checking Database Tables...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.rows.length === 0) {
      console.log('❌ No tables found! Database schema not created.');
    } else {
      console.log(`✅ Found ${tables.rows.length} tables:`);
      tables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }
    console.log();

    // Check admin users
    console.log('👤 Checking Admin Users...');
    const adminCheck = await client.query('SELECT COUNT(*) as count FROM admin_users');
    console.log(`✅ Found ${adminCheck.rows[0].count} admin user(s)`);
    
    await client.end();
    console.log('\n✅ All diagnostics passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Diagnostic failed!');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('  1. Database server not running');
    console.error('  2. Wrong connection credentials in .env.local');
    console.error('  3. Database not created or schema not imported');
    console.error('  4. Firewall blocking connection');
    console.error('  5. PostgreSQL not configured to accept connections');
    
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // Ignore
      }
    }
    process.exit(1);
  }
}

diagnose();
