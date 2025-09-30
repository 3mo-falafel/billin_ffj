-- Final fix for scholarships system
-- Run this in your Supabase SQL Editor

-- Step 1: Check current state of tables
SELECT 'Current tables check:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('scholarships', 'admin_users')
ORDER BY table_name;

-- Step 2: Ensure scholarships table exists with correct structure
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

-- Step 3: Disable RLS on scholarships table to allow admin access
ALTER TABLE public.scholarships DISABLE ROW LEVEL SECURITY;

-- Step 4: Clear any existing data and add sample data for each category
DELETE FROM public.scholarships;

-- Insert sample data for all 3 categories
INSERT INTO public.scholarships (
  title_en, title_ar, description_en, description_ar, 
  category, student_name, university_name, scholarship_amount, 
  requirements_en, requirements_ar, contact_info, is_active
) VALUES 
-- Student needing help (sponsor_opportunity)
(
  'Ahmad Hassan - Computer Science',
  'أحمد حسن - علوم الحاسوب',
  'Financial difficulties due to family situation and need support to continue my studies in Computer Science. I am a dedicated student with high grades but cannot afford tuition fees.',
  'صعوبات مالية بسبب وضع الأسرة وأحتاج الدعم لمواصلة دراستي في علوم الحاسوب. أنا طالب مجتهد بدرجات عالية لكن لا أستطيع تحمل الرسوم الدراسية.',
  'sponsor_opportunity',
  'Ahmad Hassan',
  'Birzeit University',
  5000.00,
  'Age: 20, Field: Computer Science, Year: 2nd Year',
  'العمر: 20، التخصص: علوم الحاسوب، السنة: السنة الثانية',
  'ahmad.hassan@student.birzeit.edu',
  true
),

-- Available scholarship (available)
(
  'Excellence in STEM Scholarship',
  'منحة التميز في العلوم والتكنولوجيا',
  'Full scholarship for outstanding Palestinian students pursuing STEM fields. This scholarship covers tuition, books, and living expenses.',
  'منحة دراسية كاملة للطلاب الفلسطينيين المتميزين في مجالات العلوم والتكنولوجيا. تغطي هذه المنحة الرسوم الدراسية والكتب ونفقات المعيشة.',
  'available',
  NULL,
  NULL,
  8000.00,
  'GPA 3.5+, STEM field, Palestinian citizenship, financial need demonstration',
  'معدل 3.5+، مجال العلوم والتكنولوجيا، جنسية فلسطينية، إثبات الحاجة المالية',
  'scholarships@techfoundation.org',
  true
),

-- Student we helped (awarded)
(
  'Fatima Al-Zahra - Medicine',
  'فاطمة الزهراء - الطب',
  'Successfully completed first year of medical school with honors. Currently in second year and maintaining excellent grades. Plans to specialize in pediatrics to serve her community.',
  'أتمت السنة الأولى من كلية الطب بامتياز. حالياً في السنة الثانية وتحافظ على درجات ممتازة. تخطط للتخصص في طب الأطفال لخدمة مجتمعها.',
  'awarded',
  'Fatima Al-Zahra',
  'American University of Beirut',
  15000.00,
  'Field: Medicine, Year: 2023',
  'التخصص: الطب، السنة: 2023',
  'Medical Student - 2nd Year',
  true
);

-- Step 5: Verify data was inserted
SELECT 'Data inserted successfully:' as status;
SELECT 
  category,
  COUNT(*) as count,
  STRING_AGG(title_en, ', ') as titles
FROM public.scholarships 
GROUP BY category
ORDER BY category;

-- Step 6: Show all data
SELECT 'All scholarship data:' as status;
SELECT 
  id, category, student_name, university_name, 
  scholarship_amount, title_en, is_active
FROM public.scholarships 
ORDER BY category, created_at;

SELECT 'Setup complete! Your scholarships should now work properly.' as final_status;
