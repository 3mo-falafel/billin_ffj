-- Function to handle new admin user creation
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'admin'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create admin profile (optional - can be used for specific admin emails)
-- This trigger is commented out by default - uncomment if you want auto-admin creation
-- DROP TRIGGER IF EXISTS on_auth_admin_user_created ON auth.users;
-- CREATE TRIGGER on_auth_admin_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   WHEN (NEW.email LIKE '%@bilin-admin.org') -- Replace with your admin email pattern
--   EXECUTE FUNCTION public.handle_new_admin_user();
