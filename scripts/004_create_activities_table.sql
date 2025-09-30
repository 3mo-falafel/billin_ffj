-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('peaceful_resistance', 'educational_cultural')),
  main_image_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  details_en TEXT,
  details_ar TEXT,
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

-- Insert some sample data
INSERT INTO activities (title_en, title_ar, description_en, description_ar, category, details_en, details_ar) VALUES
(
  'Weekly Peaceful Demonstrations',
  'المظاهرات السلمية الأسبوعية',
  'Every Friday, our community gathers for peaceful demonstrations against the separation wall.',
  'كل يوم جمعة، يجتمع مجتمعنا للمظاهرات السلمية ضد جدار الفصل.',
  'peaceful_resistance',
  'Our weekly demonstrations have been ongoing for over 15 years, bringing together villagers, international supporters, and activists in a united call for justice and freedom. These peaceful protests highlight the impact of the separation wall on our daily lives.',
  'تستمر مظاهراتنا الأسبوعية منذ أكثر من 15 عامًا، وتجمع بين القرويين والداعمين الدوليين والناشطين في دعوة موحدة للعدالة والحرية. تسلط هذه الاحتجاجات السلمية الضوء على تأثير جدار الفصل على حياتنا اليومية.'
),
(
  'Palestinian Heritage Workshops',
  'ورش التراث الفلسطيني',
  'Interactive workshops teaching traditional Palestinian crafts, music, and storytelling.',
  'ورش تفاعلية لتعليم الحرف والموسيقى والحكايات الفلسطينية التقليدية.',
  'educational_cultural',
  'These workshops preserve our cultural heritage by teaching traditional Palestinian embroidery (tatreez), olive oil production, traditional cooking, and folk music. Participants learn from elderly villagers who pass down generations of knowledge.',
  'تحافظ هذه الورش على تراثنا الثقافي من خلال تعليم التطريز الفلسطيني التقليدي، وإنتاج زيت الزيتون، والطبخ التقليدي، والموسيقى الشعبية. يتعلم المشاركون من كبار السن في القرية الذين ينقلون معرفة الأجيال.'
);
