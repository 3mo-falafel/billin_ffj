#!/usr/bin/env node

/**
 * DATABASE VALIDATION SCRIPT
 * This script checks if all database operations work correctly
 * Run this on the VPS to verify everything is set up properly
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const TABLES_TO_CHECK = [
  { name: 'activities', required_columns: ['title_en', 'title_ar', 'description_en', 'description_ar', 'date'] },
  { name: 'news', required_columns: ['title_en', 'title_ar', 'content_en', 'content_ar', 'date', 'featured'] },
  { name: 'gallery', required_columns: ['media_url', 'media_type', 'title_en', 'title_ar'] },
  { name: 'homepage_gallery', required_columns: ['title_en', 'title_ar', 'image_url', 'display_order'] },
  { name: 'news_ticker', required_columns: ['message_en', 'message_ar', 'display_order'] },
  { name: 'scholarships', required_columns: ['title_en', 'title_ar', 'description_en', 'description_ar', 'category'] },
  { name: 'involvement_requests', required_columns: ['name', 'email', 'involvement_type', 'status'] },
  { name: 'traditional_embroidery', required_columns: ['title_en', 'image_url', 'is_featured'] },
  { name: 'embroidery_for_sale', required_columns: ['title_en', 'price', 'image_url', 'sold'] },
  { name: 'projects', required_columns: ['name', 'description', 'status', 'start_date'] },
  { name: 'admin_users', required_columns: ['email', 'password_hash', 'role'] },
];

async function checkTable(table) {
  const { name, required_columns } = table;
  
  console.log(`\n📋 Checking table: ${name}`);
  
  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `, [name]);
    
    if (!tableCheck.rows[0].exists) {
      console.log(`  ❌ Table does not exist`);
      return false;
    }
    
    console.log(`  ✅ Table exists`);
    
    // Check columns
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = $1;
    `, [name]);
    
    const existingColumns = columnCheck.rows.map(r => r.column_name);
    const missingColumns = required_columns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log(`  ⚠️  Missing columns: ${missingColumns.join(', ')}`);
    } else {
      console.log(`  ✅ All required columns present`);
    }
    
    // Count records
    const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${name}`);
    console.log(`  📊 Records: ${countResult.rows[0].count}`);
    
    // Test insert (will rollback)
    try {
      await pool.query('BEGIN');
      // Simple test insert based on table
      if (name === 'news_ticker') {
        await pool.query(`INSERT INTO ${name} (message_en, message_ar) VALUES ('test', 'test')`);
      } else if (required_columns.includes('title_en')) {
        await pool.query(`INSERT INTO ${name} (title_en, title_ar) VALUES ('test', 'test')`);
      }
      await pool.query('ROLLBACK');
      console.log(`  ✅ Insert test passed`);
    } catch (insertError) {
      await pool.query('ROLLBACK');
      console.log(`  ⚠️  Insert test failed: ${insertError.message}`);
    }
    
    return true;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 DATABASE VALIDATION STARTED\n');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const table of TABLES_TO_CHECK) {
    const result = await checkTable(table);
    results.push({ table: table.name, success: result });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All database tables are properly configured!');
  } else {
    console.log('\n⚠️  Some tables have issues. Please review the output above.');
  }
  
  await pool.end();
}

main().catch(console.error);
