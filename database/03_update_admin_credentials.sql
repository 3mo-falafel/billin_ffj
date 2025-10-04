-- ================================================================
-- UPDATE ADMIN CREDENTIALS
-- ================================================================
-- This script updates the admin user credentials in the database
-- New Email: ffjisk@billin.org
-- New Password: iyadSK2008

-- First, delete the old admin user
DELETE FROM admin_users WHERE email = 'admin@bilin-website.com';

-- Insert the new admin user
INSERT INTO admin_users (email, password_hash, role, is_active)
VALUES (
  'ffjisk@billin.org',
  '$2a$10$WMZpPYYt6XMOyArZF//fFO27.UrLLS2ZF9XUqdPNv8Fb2ZAnS2jUS',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Verify the update
SELECT id, email, role, is_active, created_at 
FROM admin_users 
WHERE email = 'ffjisk@billin.org';
