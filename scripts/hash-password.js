/**
 * Password Hash Generator
 * 
 * This script generates bcrypt hashes for admin passwords.
 * Usage: node scripts/hash-password.js your-password-here
 */

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.error('❌ Error: Please provide a password as an argument');
    console.log('Usage: node scripts/hash-password.js your-password-here');
    process.exit(1);
  }

  if (password.length < 8) {
    console.warn('⚠️  Warning: Password is less than 8 characters. Consider using a stronger password.');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('\n✅ Password hash generated successfully!\n');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nUse this SQL to create/update admin user:\n');
    console.log(`INSERT INTO admin_users (email, password_hash, role, is_active)`);
    console.log(`VALUES ('your-email@example.com', '${hash}', 'admin', true);`);
    console.log('\nOr to update existing user:\n');
    console.log(`UPDATE admin_users`);
    console.log(`SET password_hash = '${hash}', updated_at = NOW()`);
    console.log(`WHERE email = 'your-email@example.com';`);
    console.log('\n');
  } catch (error) {
    console.error('❌ Error generating hash:', error.message);
    process.exit(1);
  }
}

generateHash();
