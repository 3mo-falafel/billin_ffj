-- Create admin users table for authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can only see their own data
CREATE POLICY "admin_users_select_own" ON public.admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "admin_users_insert_own" ON public.admin_users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "admin_users_update_own" ON public.admin_users FOR UPDATE USING (auth.uid() = id);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Public can read activities, only admins can modify
CREATE POLICY "activities_select_all" ON public.activities FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "activities_insert_admin" ON public.activities FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "activities_update_admin" ON public.activities FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "activities_delete_admin" ON public.activities FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  date DATE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Public can read news, only admins can modify
CREATE POLICY "news_select_all" ON public.news FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "news_insert_admin" ON public.news FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "news_update_admin" ON public.news FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "news_delete_admin" ON public.news FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));

-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  category TEXT DEFAULT 'general',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Public can read gallery, only admins can modify
CREATE POLICY "gallery_select_all" ON public.gallery FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "gallery_insert_admin" ON public.gallery FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "gallery_update_admin" ON public.gallery FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "gallery_delete_admin" ON public.gallery FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));
