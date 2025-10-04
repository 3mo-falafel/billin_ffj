/**
 * Database Connection Test Script
 * 
 * This script tests the PostgreSQL database connection
 * Usage: node scripts/test-db-connection.js
 */

const { query, closePool } = require('../lib/db/connection');

async function testConnection() {
  console.log('🔍 Testing PostgreSQL database connection...\n');
  console.log('Configuration:');
  console.log('- Host:', process.env.DATABASE_HOST || 'localhost');
  console.log('- Port:', process.env.DATABASE_PORT || '5432');
  console.log('- Database:', process.env.DATABASE_NAME || 'bilin_website');
  console.log('- User:', process.env.DATABASE_USER || 'postgres');
  console.log('- SSL:', process.env.DATABASE_SSL === 'true' ? 'Enabled' : 'Disabled');
  console.log('\n');

  try {
    // Test 1: Basic connection
    console.log('Test 1: Basic Connection');
    const result1 = await query('SELECT NOW(), version()');
    console.log('✅ Connected successfully!');
    console.log('  Server time:', result1.rows[0].now);
    console.log('  PostgreSQL version:', result1.rows[0].version.split('\n')[0]);
    console.log('');

    // Test 2: Check tables exist
    console.log('Test 2: Check Tables');
    const result2 = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const expectedTables = [
      'activities',
      'admin_users',
      'embroidery_for_sale',
      'gallery',
      'handmade_items',
      'homepage_gallery',
      'involvement_requests',
      'news',
      'news_ticker',
      'projects',
      'scholarships',
      'traditional_embroidery'
    ];
    
    const actualTables = result2.rows.map(row => row.table_name).sort();
    const missingTables = expectedTables.filter(t => !actualTables.includes(t));
    
    if (missingTables.length === 0) {
      console.log('✅ All tables exist!');
      console.log(`  Found ${actualTables.length} tables:`, actualTables.join(', '));
    } else {
      console.log('⚠️  Some tables are missing:');
      console.log('  Missing:', missingTables.join(', '));
      console.log('  Found:', actualTables.join(', '));
      console.log('\n  Run: psql -U bilin_admin -d bilin_website -f database/01_schema.sql');
    }
    console.log('');

    // Test 3: Check admin users
    console.log('Test 3: Check Admin Users');
    const result3 = await query('SELECT COUNT(*) as count FROM admin_users');
    const adminCount = parseInt(result3.rows[0].count);
    
    if (adminCount > 0) {
      console.log(`✅ Found ${adminCount} admin user(s)`);
      const admins = await query('SELECT email, role, is_active FROM admin_users');
      admins.rows.forEach(admin => {
        console.log(`  - ${admin.email} (${admin.role}) - ${admin.is_active ? 'Active' : 'Inactive'}`);
      });
    } else {
      console.log('⚠️  No admin users found');
      console.log('  Run: psql -U bilin_admin -d bilin_website -f database/02_seed_data.sql');
      console.log('  Or use: node scripts/hash-password.js your-password');
    }
    console.log('');

    // Test 4: Check sample data
    console.log('Test 4: Check Sample Data');
    const tables = ['activities', 'news', 'projects', 'scholarships'];
    let hasData = false;
    
    for (const table of tables) {
      try {
        const result = await query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        if (count > 0) {
          console.log(`✅ ${table}: ${count} records`);
          hasData = true;
        } else {
          console.log(`⚠️  ${table}: No records`);
        }
      } catch (error) {
        console.log(`❌ ${table}: Error - ${error.message}`);
      }
    }
    
    if (!hasData) {
      console.log('\n  Consider running: psql -U bilin_admin -d bilin_website -f database/02_seed_data.sql');
    }
    console.log('');

    // Test 5: Check indexes
    console.log('Test 5: Check Indexes');
    const result5 = await query(`
      SELECT COUNT(*) as count 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);
    const indexCount = parseInt(result5.rows[0].count);
    console.log(`✅ Found ${indexCount} indexes`);
    console.log('');

    // Test 6: Check functions/triggers
    console.log('Test 6: Check Functions/Triggers');
    const result6 = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.routines 
      WHERE routine_schema = 'public'
    `);
    const functionCount = parseInt(result6.rows[0].count);
    console.log(`✅ Found ${functionCount} function(s)`);
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('✅ All tests completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\nYour database is ready to use! 🎉\n');

  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting steps:');
    console.error('1. Check if PostgreSQL is running:');
    console.error('   sudo systemctl status postgresql');
    console.error('');
    console.error('2. Verify your .env.local file has correct credentials');
    console.error('');
    console.error('3. Test connection manually:');
    console.error('   psql -U bilin_admin -d bilin_website -h localhost');
    console.error('');
    console.error('4. Check PostgreSQL logs:');
    console.error('   sudo tail -f /var/log/postgresql/postgresql-14-main.log');
    console.error('');
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Run the test
testConnection();
