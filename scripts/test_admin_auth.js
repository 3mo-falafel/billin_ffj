// Test admin authentication - paste this in browser console on /admin/activities page

const testAdminAuth = async () => {
  console.log('🔐 Testing Admin Authentication');
  
  const { createClient } = await import('/lib/supabase/client.js');
  const supabase = createClient();
  
  // 1. Check current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('❌ Auth error:', userError);
    return;
  }
  
  if (!user) {
    console.log('❌ No authenticated user found');
    console.log('🔧 You need to login first at /auth/admin-login');
    return;
  }
  
  console.log('✅ Authenticated user:', {
    id: user.id,
    email: user.email,
    role: user.role
  });
  
  // 2. Check admin status
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (adminError) {
    console.error('❌ Admin check error:', adminError);
    console.log('🔧 You might not be in the admin_users table');
    return;
  }
  
  if (!adminUser) {
    console.log('❌ User not found in admin_users table');
    console.log('🔧 Need to add user to admin_users table');
    return;
  }
  
  console.log('✅ Admin user confirmed:', adminUser);
  
  // 3. Test activity insert with auth
  console.log('🧪 Testing activity insert with authentication...');
  
  const testActivity = {
    title_en: 'AUTH TEST - ' + Date.now(),
    title_ar: 'اختبار المصادقة - ' + Date.now(),
    description_en: 'This is a test to check if authentication allows database operations',
    description_ar: 'هذا اختبار للتحقق من أن المصادقة تسمح بعمليات قاعدة البيانات',
    date: new Date().toISOString().split('T')[0]
  };
  
  const { data: insertResult, error: insertError } = await supabase
    .from('activities')
    .insert(testActivity)
    .select();
    
  if (insertError) {
    console.error('❌ Insert still failed even with auth:', insertError);
    console.log('🔧 This suggests RLS policies or table structure issues');
  } else {
    console.log('✅ Insert successful with authentication!', insertResult);
    console.log('🎉 The admin system should work now');
    
    // Clean up test
    if (insertResult && insertResult[0]) {
      await supabase
        .from('activities')
        .delete()
        .eq('id', insertResult[0].id);
      console.log('🧹 Test activity cleaned up');
    }
  }
};

testAdminAuth();
