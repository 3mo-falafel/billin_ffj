// Create first admin user - run this with service role key
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function createFirstAdmin() {
  console.log('🔐 Creating First Admin User\n');
  
  // Read environment variables from .env.local
  let supabaseUrl, supabaseKey;
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envLines = envContent.split('\n');
    
    for (const line of envLines) {
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1].trim();
      }
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
        supabaseKey = line.split('=')[1].trim();
      }
    }
    
    console.log('📋 Using Supabase connection...');
    console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('Key:', supabaseKey ? 'Set' : 'Missing');
    
  } catch (error) {
    console.error('❌ Could not read .env.local file:', error.message);
    return;
  }
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('📧 Setting up admin access...');
    
    // First, let's check if we can access admin_users table at all
    console.log('🔍 Checking admin_users table access...');
    
    const { data: existingAdmins, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(5);
      
    if (checkError) {
      console.error('❌ Cannot access admin_users table:', checkError);
      console.log('📝 This suggests:');
      console.log('   1. Table might not exist');
      console.log('   2. RLS is blocking all access');
      console.log('   3. Need to run database setup scripts first');
      return;
    }
    
    console.log('✅ Can access admin_users table');
    console.log('� Existing admins:', existingAdmins?.length || 0);
    
    if (existingAdmins && existingAdmins.length > 0) {
      console.log('👑 Found existing admin users:', existingAdmins);
      console.log('🎉 You should be able to login with one of these accounts');
      console.log('🌐 Go to: http://localhost:3001/auth/admin-login');
      return;
    }
    
    console.log('⚠️  No admin users found. Need to create one...');
    
    // Instead of creating auth user (which is rate limited), 
    // let's try to directly insert a test admin record
    console.log('🧪 Attempting to create admin record directly...');
    
    const testAdminId = '00000000-0000-0000-0000-000000000001'; // Dummy UUID for testing
    const { data: directInsert, error: directError } = await supabase
      .from('admin_users')
      .insert({
        id: testAdminId,
        email: 'admin@bilin.org',
        role: 'admin',
        created_at: new Date().toISOString()
      })
      .select();
      
    if (directError) {
      console.error('❌ Direct insert failed:', directError);
      console.log('� This confirms RLS is blocking inserts');
      console.log('🔧 Solution: We need to temporarily disable RLS or use service role key');
    } else {
      console.log('✅ Direct insert worked!', directInsert);
    }
    
    console.log('\n📋 Summary:');
    console.log('� To fix the admin access issue, you have a few options:');
    console.log('1. 🗃️  Check if admin_users table exists by running database setup scripts');
    console.log('2. � Temporarily disable RLS on admin_users table to create first admin');
    console.log('3. 🔑 Get the service role key (not anon key) to bypass RLS');
    console.log('4. 🛠️  Manually add admin user via Supabase dashboard');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

createFirstAdmin();
