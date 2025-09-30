-- Create Admin User Account
-- This script creates a single admin user for the bilin-website
-- 
-- IMPORTANT: Run this in your Supabase SQL Editor
-- 
-- Email: ffj.mediacenter@gmail.com
-- Password: jibreelffj9876

-- Insert the admin user into auth.users table
-- Note: You'll need to run this through Supabase Auth API or manually
-- This is just for reference - the actual user creation needs to be done via Supabase dashboard

-- Step 1: Create user via Supabase Dashboard Auth section with:
-- Email: ffj.mediacenter@gmail.com
-- Password: jibreelffj9876
-- Confirm password: jibreelffj9876
-- Email confirm: true (skip email confirmation)

-- Step 2: After creating the user, get the user ID and run this query:
-- Replace 'USER_ID_HERE' with the actual UUID from auth.users table

-- Example query to add to admin_users table:
-- INSERT INTO public.admin_users (id, email, role)
-- VALUES ('USER_ID_HERE', 'ffj.mediacenter@gmail.com', 'admin');

-- To find the user ID after creation, use:
-- SELECT id, email FROM auth.users WHERE email = 'ffj.mediacenter@gmail.com';

-- Complete setup query (run after getting the user ID):
/*
INSERT INTO public.admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users 
WHERE email = 'ffj.mediacenter@gmail.com'
ON CONFLICT (id) DO NOTHING;
*/

-- Alternative: If you want to create via SQL (advanced users only):
-- This requires RPC function creation for security
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- This is a placeholder - actual user creation must be done via Supabase Auth
  -- The following is for documentation purposes only
  
  -- After user is created via dashboard, find and add to admin_users
  SELECT id INTO new_user_id 
  FROM auth.users 
  WHERE email = 'ffj.mediacenter@gmail.com' 
  LIMIT 1;
  
  IF new_user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (id, email, role)
    VALUES (new_user_id, 'ffj.mediacenter@gmail.com', 'admin')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_admin_user() TO authenticated;
