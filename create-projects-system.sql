-- Complete Projects System Setup
-- Run this in your Supabase SQL Editor

-- Step 1: Check current state
SELECT 'Setting up Projects System...' as status;

-- Step 2: Drop old handmade table if it exists
DROP TABLE IF EXISTS public.handmade_items CASCADE;

-- Step 3: Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  raised_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  images TEXT[], -- Array of image URLs
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status, is_active);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON public.projects(start_date, end_date);

-- Step 5: Disable RLS for easy admin access
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Step 6: Insert sample project data
INSERT INTO public.projects (
  name, description, location, goal_amount, raised_amount, 
  start_date, end_date, status, images, is_featured, is_active
) VALUES 
(
  'Community Greenhouse Project',
  'Building a modern greenhouse to grow fresh vegetables for the community year-round. This project will provide sustainable food source and create job opportunities for local families. The greenhouse will use modern hydroponic systems and renewable energy.',
  'Bil''in Village Center',
  25000.00,
  8500.00,
  '2024-01-15',
  '2024-06-30',
  'active',
  ARRAY['/placeholder.jpg', '/B1.jpg', '/B2.jpg'],
  true,
  true
),
(
  'Solar Panel Installation',
  'Installing solar panels on community buildings to reduce electricity costs and promote renewable energy in our village. This will help reduce our carbon footprint and provide clean energy independence.',
  'Community Center and School',
  15000.00,
  12000.00,
  '2024-02-01',
  '2024-04-30',
  'active',
  ARRAY['/placeholder.jpg'],
  false,
  true
),
(
  'Children''s Playground Construction',
  'Creating a safe and modern playground for children in the village. The playground will include swings, slides, climbing structures, and safety equipment to provide a fun and secure environment for our kids.',
  'Village Park Area',
  18000.00,
  3200.00,
  '2024-03-01',
  '2024-07-01',
  'planning',
  ARRAY['/placeholder.jpg'],
  true,
  true
),
(
  'Community Library Renovation',
  'Renovating and expanding our community library with new books, computers, and study spaces. This project aims to provide better educational resources for students of all ages.',
  'Main Street Library Building',
  12000.00,
  12000.00,
  '2023-09-01',
  '2023-12-31',
  'completed',
  ARRAY['/placeholder.jpg'],
  false,
  true
);

-- Step 7: Update admin dashboard database references
-- Fix admin dashboard to use projects instead of handmade_items
-- (The code changes are already done in the admin files)

-- Step 8: Verify the setup
SELECT 'Projects table created successfully!' as status;

SELECT 'Sample data inserted:' as info;
SELECT 
  status,
  COUNT(*) as count,
  SUM(goal_amount) as total_goal,
  SUM(raised_amount) as total_raised
FROM public.projects 
GROUP BY status
ORDER BY status;

SELECT 'All projects:' as info;
SELECT 
  id, name, location, goal_amount, raised_amount, 
  status, is_featured, is_active
FROM public.projects 
ORDER BY is_featured DESC, created_at DESC;

-- Step 9: Clean up old references
-- Remove any remaining handmade references from other tables if they exist
UPDATE public.scholarships SET category = 'available' WHERE category = 'handmade' AND category IS NOT NULL;

SELECT 'Projects system setup complete!' as final_status;
