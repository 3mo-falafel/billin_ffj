-- Create scholarships table for admin-controlled scholarship posts
CREATE TABLE IF NOT EXISTS public.scholarships (
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

-- Create index for category and status
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON public.scholarships(category, is_active);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON public.scholarships(deadline) WHERE category = 'available';

-- Insert some sample scholarship data
INSERT INTO public.scholarships (title_en, title_ar, description_en, description_ar, category, student_name, university_name, scholarship_amount, is_active) VALUES
  ('Ahmad Receives Full Scholarship to Oxford University', 'أحمد يحصل على منحة كاملة لجامعة أكسفورد', 'We are proud to announce that Ahmad Hassan from Bil''in village has received a full scholarship to study Engineering at Oxford University.', 'نحن فخورون بالإعلان أن أحمد حسن من قرية بلعين حصل على منحة دراسية كاملة لدراسة الهندسة في جامعة أكسفورد.', 'awarded', 'Ahmad Hassan', 'Oxford University', 50000.00, true),
  ('Computer Science Scholarship Available', 'منحة دراسية متاحة في علوم الحاسوب', 'Full scholarship opportunity for Palestinian students to study Computer Science at international universities.', 'فرصة منحة دراسية كاملة للطلاب الفلسطينيين لدراسة علوم الحاسوب في الجامعات الدولية.', 'available', null, 'Various Universities', 40000.00, true),
  ('Sponsor a Student Program', 'برنامج كفالة طالب', 'Join our sponsor program to help Palestinian students achieve their educational dreams. Your contribution can change a life.', 'انضم إلى برنامج الكفالة لمساعدة الطلاب الفلسطينيين في تحقيق أحلامهم التعليمية. مساهمتك يمكن أن تغير حياة.', 'sponsor_opportunity', null, null, null, true);

-- Enable RLS
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active scholarships" ON public.scholarships
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage scholarships" ON public.scholarships
  FOR ALL USING (auth.role() = 'authenticated');
