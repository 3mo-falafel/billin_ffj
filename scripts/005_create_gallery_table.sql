-- Create homepage_gallery table for admin-controlled gallery
CREATE TABLE IF NOT EXISTS public.homepage_gallery (
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

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_homepage_gallery_order ON public.homepage_gallery(display_order, is_active);

-- Insert some default gallery items
INSERT INTO public.homepage_gallery (title_en, title_ar, image_url, alt_text, display_order, is_active) VALUES
  ('Olive Harvest', 'قطف الزيتون', '/olive-harvest.png', 'Olive Harvest in Bil''in', 1, true),
  ('Peaceful Resistance', 'المقاومة السلمية', '/peaceful-demonstration.png', 'Peaceful Demonstration', 2, true),
  ('Cultural Workshop', 'ورشة ثقافية', '/cultural-workshop.png', 'Cultural Workshop', 3, true),
  ('Heritage Education', 'التعليم التراثي', '/heritage-education.png', 'Heritage Education', 4, true),
  ('Traditional Arts', 'الفنون التراثية', '/traditional-arts.png', 'Traditional Arts', 5, true),
  ('Creative Workshops', 'ورش إبداعية', '/creative-workshops.png', 'Creative Workshops', 6, true);

-- Enable RLS
ALTER TABLE public.homepage_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active gallery items" ON public.homepage_gallery
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage gallery items" ON public.homepage_gallery
  FOR ALL USING (auth.role() = 'authenticated');
