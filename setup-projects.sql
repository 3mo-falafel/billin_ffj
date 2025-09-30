-- Create projects table
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
  images TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for easy access
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Insert sample data
INSERT INTO public.projects (
  name, description, location, goal_amount, raised_amount, 
  start_date, end_date, status, images, is_featured, is_active
) VALUES 
(
  'Community Greenhouse Project',
  'Building a modern greenhouse to grow fresh vegetables for the community year-round. This project will provide sustainable food source and create job opportunities for local families.',
  'Bil''in Village Center',
  25000.00,
  8500.00,
  '2024-01-15',
  '2024-06-30',
  'active',
  ARRAY['/B1.jpg', '/B2.jpg', '/placeholder.jpg'],
  true,
  true
),
(
  'Solar Panel Installation',
  'Installing solar panels on community buildings to reduce electricity costs and promote renewable energy in our village.',
  'Community Center and School',
  15000.00,
  12000.00,
  '2024-02-01',
  '2024-04-30',
  'active',
  ARRAY['/B333333.jpg', '/placeholder.jpg'],
  false,
  true
),
(
  'Children''s Playground Construction',
  'Creating a safe and modern playground for children in the village with swings, slides, and safety equipment.',
  'Village Park Area',
  18000.00,
  3200.00,
  '2024-03-01',
  '2024-07-01',
  'planning',
  ARRAY['/olive-harvest.png', '/peaceful-demonstration.png'],
  true,
  true
);
