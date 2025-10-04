-- ================================================================
-- BILIN WEBSITE - COMPLETE POSTGRESQL DATABASE SETUP
-- ================================================================
-- This script creates all tables and initial data for the Bilin website
-- Run this on your VPS PostgreSQL database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- 1. ADMIN USERS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ================================================================
-- 2. ACTIVITIES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_active ON activities(is_active);

-- ================================================================
-- 3. NEWS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  date DATE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured, is_active);

-- ================================================================
-- 4. GALLERY TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  cover_image TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category, is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery(media_type);

-- ================================================================
-- 5. HOMEPAGE GALLERY TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS homepage_gallery (
  id SERIAL PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homepage_gallery_order ON homepage_gallery(display_order, is_active);

-- ================================================================
-- 6. NEWS TICKER TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS news_ticker (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_en TEXT NOT NULL,
  message_ar TEXT NOT NULL,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_ticker_order ON news_ticker(display_order, is_active);

-- ================================================================
-- 7. SCHOLARSHIPS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS scholarships (
  id SERIAL PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('awarded', 'available', 'sponsor_opportunity')),
  student_name TEXT,
  university_name TEXT,
  scholarship_amount DECIMAL(10,2),
  deadline DATE,
  requirements_en TEXT,
  requirements_ar TEXT,
  contact_info TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scholarships_category ON scholarships(category, is_active);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline) WHERE category = 'available';

-- ================================================================
-- 8. INVOLVEMENT REQUESTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS involvement_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  nationality TEXT,
  involvement_type TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_involvement_status ON involvement_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_involvement_type ON involvement_requests(involvement_type);

-- ================================================================
-- 9. TRADITIONAL EMBROIDERY TABLE (Showcase)
-- ================================================================
CREATE TABLE IF NOT EXISTS traditional_embroidery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_traditional_embroidery_featured ON traditional_embroidery(is_featured, is_active);

-- ================================================================
-- 10. EMBROIDERY FOR SALE TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS embroidery_for_sale (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  price DECIMAL(10,2),
  contact_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sold BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_embroidery_sale_featured ON embroidery_for_sale(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_embroidery_sale_sold ON embroidery_for_sale(sold, is_active);

-- ================================================================
-- 11. PROJECTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  raised_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  images TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status, is_active);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);

-- ================================================================
-- 12. HANDMADE ITEMS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS handmade_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  price DECIMAL(10,2),
  category TEXT DEFAULT 'crafts',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_handmade_category ON handmade_items(category, is_active);
CREATE INDEX IF NOT EXISTS idx_handmade_featured ON handmade_items(is_featured, is_active);

-- ================================================================
-- 13. TRIGGERS FOR UPDATED_AT
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_gallery_updated_at BEFORE UPDATE ON homepage_gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_ticker_updated_at BEFORE UPDATE ON news_ticker
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_involvement_requests_updated_at BEFORE UPDATE ON involvement_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_traditional_embroidery_updated_at BEFORE UPDATE ON traditional_embroidery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_embroidery_for_sale_updated_at BEFORE UPDATE ON embroidery_for_sale
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_handmade_items_updated_at BEFORE UPDATE ON handmade_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================
SELECT 'Database schema created successfully!' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
