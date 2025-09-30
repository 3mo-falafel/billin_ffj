-- Drop existing activities table and recreate with correct schema
DROP TABLE IF EXISTS activities CASCADE;

-- Create activities table with correct schema to match the forms and components
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

-- Create RLS policies
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active activities
CREATE POLICY "Allow public read access to active activities" ON activities
  FOR SELECT USING (is_active = true);

-- Allow authenticated admin users to manage activities
CREATE POLICY "Allow admin full access to activities" ON activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data that matches the filtering logic in the components
INSERT INTO activities (title_en, title_ar, description_en, description_ar, date, image_url) VALUES
(
  'Weekly Peaceful Demonstrations',
  'المظاهرات السلمية الأسبوعية',
  'Every Friday, our community gathers for peaceful demonstrations against the separation wall and for justice.',
  'كل يوم جمعة، يجتمع مجتمعنا للمظاهرات السلمية ضد جدار الفصل ومن أجل العدالة.',
  '2024-01-05',
  '/peaceful-demonstration.png'
),
(
  'Palestinian Heritage Workshop',
  'ورشة التراث الفلسطيني',
  'Interactive workshop teaching traditional Palestinian crafts, music, and storytelling to preserve our cultural heritage.',
  'ورشة تفاعلية لتعليم الحرف والموسيقى والحكايات الفلسطينية التقليدية للحفاظ على تراثنا الثقافي.',
  '2024-01-10',
  '/cultural-workshop.png'
),
(
  'Traditional Embroidery Program',
  'برنامج التطريز التقليدي',
  'Educational program for learning the traditional Palestinian embroidery (tatreez) techniques passed down through generations.',
  'برنامج تعليمي لتعلم تقنيات التطريز الفلسطيني التقليدي (التطريز) المتوارثة عبر الأجيال.',
  '2024-01-15',
  '/traditional-arts.png'
),
(
  'Olive Harvest Resistance',
  'مقاومة موسم قطف الزيتون',
  'Peaceful resistance activities during olive harvest season, protecting farmers'' rights to their ancestral lands.',
  'أنشطة المقاومة السلمية خلال موسم قطف الزيتون، وحماية حقوق المزارعين في أراضيهم الأجدادية.',
  '2024-10-01',
  '/olive-harvest.png'
);
