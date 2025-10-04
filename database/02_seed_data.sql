-- ================================================================
-- BILIN WEBSITE - SEED DATA
-- ================================================================
-- This script inserts sample/initial data into the database

-- ================================================================
-- 1. CREATE DEFAULT ADMIN USER
-- ================================================================
-- Email: ffjisk@billin.org
-- Password: "iyadSK2008" (hashed with bcrypt)
INSERT INTO admin_users (email, password_hash, role, is_active)
VALUES (
  'ffjisk@billin.org',
  -- This is bcrypt hash of "iyadSK2008"
  '$2a$10$WMZpPYYt6XMOyArZF//fFO27.UrLLS2ZF9XUqdPNv8Fb2ZAnS2jUS',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- ================================================================
-- 2. SAMPLE HOMEPAGE GALLERY
-- ================================================================
INSERT INTO homepage_gallery (title_en, title_ar, image_url, alt_text, display_order, is_active) VALUES
  ('Olive Harvest', 'قطف الزيتون', '/images/olive-harvest.jpg', 'Olive Harvest in Bil''in', 1, true),
  ('Peaceful Resistance', 'المقاومة السلمية', '/images/peaceful-demonstration.jpg', 'Peaceful Demonstration', 2, true),
  ('Cultural Workshop', 'ورشة ثقافية', '/images/cultural-workshop.jpg', 'Cultural Workshop', 3, true),
  ('Heritage Education', 'التعليم التراثي', '/images/heritage-education.jpg', 'Heritage Education', 4, true),
  ('Traditional Arts', 'الفنون التراثية', '/images/traditional-arts.jpg', 'Traditional Arts', 5, true),
  ('Community Events', 'فعاليات المجتمع', '/images/community-events.jpg', 'Community Events', 6, true)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 3. SAMPLE NEWS TICKER
-- ================================================================
INSERT INTO news_ticker (message_en, message_ar, link, is_active, display_order) VALUES
  (
    'Join us for the weekly peaceful demonstration every Friday at 12 PM',
    'انضم إلينا في المظاهرة السلمية الأسبوعية كل جمعة الساعة 12 ظهراً',
    '/activities',
    true,
    1
  ),
  (
    'New scholarship opportunities available for Palestinian students',
    'فرص منح دراسية جديدة متاحة للطلاب الفلسطينيين',
    '/scholarships',
    true,
    2
  ),
  (
    'Visit our gallery to see the latest community photos and videos',
    'قم بزيارة معرضنا لمشاهدة أحدث صور وفيديوهات المجتمع',
    '/gallery',
    true,
    3
  )
ON CONFLICT DO NOTHING;

-- ================================================================
-- 4. SAMPLE ACTIVITIES
-- ================================================================
INSERT INTO activities (title_en, title_ar, description_en, description_ar, date, is_active) VALUES
  (
    'Weekly Peaceful Demonstrations',
    'المظاهرات السلمية الأسبوعية',
    'Every Friday, our community gathers for peaceful demonstrations against the separation wall.',
    'كل يوم جمعة، يجتمع مجتمعنا للمظاهرات السلمية ضد جدار الفصل.',
    CURRENT_DATE,
    true
  ),
  (
    'Palestinian Heritage Workshops',
    'ورش التراث الفلسطيني',
    'Interactive workshops teaching traditional Palestinian crafts, music, and storytelling.',
    'ورش تفاعلية لتعليم الحرف والموسيقى والحكايات الفلسطينية التقليدية.',
    CURRENT_DATE - INTERVAL '7 days',
    true
  ),
  (
    'Community Olive Harvest',
    'قطف الزيتون المجتمعي',
    'Annual community event where everyone comes together to harvest olives.',
    'حدث مجتمعي سنوي حيث يجتمع الجميع لقطف الزيتون.',
    CURRENT_DATE - INTERVAL '30 days',
    true
  )
ON CONFLICT DO NOTHING;

-- ================================================================
-- 5. SAMPLE PROJECTS
-- ================================================================
INSERT INTO projects (name, description, location, goal_amount, raised_amount, start_date, end_date, status, images, is_featured, is_active) VALUES
  (
    'Community Greenhouse Project',
    'Building a modern greenhouse to grow fresh vegetables for the community year-round. This project will provide sustainable food source and create job opportunities for local families.',
    'Bil''in Village Center',
    25000.00,
    8500.00,
    CURRENT_DATE - INTERVAL '60 days',
    CURRENT_DATE + INTERVAL '120 days',
    'active',
    ARRAY['/images/greenhouse-1.jpg', '/images/greenhouse-2.jpg'],
    true,
    true
  ),
  (
    'Solar Panel Installation',
    'Installing solar panels on community buildings to reduce electricity costs and promote renewable energy.',
    'Village School',
    15000.00,
    12000.00,
    CURRENT_DATE - INTERVAL '90 days',
    CURRENT_DATE + INTERVAL '30 days',
    'active',
    ARRAY['/images/solar-1.jpg'],
    true,
    true
  ),
  (
    'Children''s Library Renovation',
    'Renovating and expanding the children''s library with new books, computers, and reading spaces.',
    'Community Center',
    10000.00,
    10000.00,
    CURRENT_DATE - INTERVAL '180 days',
    CURRENT_DATE - INTERVAL '30 days',
    'completed',
    ARRAY['/images/library-1.jpg', '/images/library-2.jpg'],
    false,
    true
  )
ON CONFLICT DO NOTHING;

-- ================================================================
-- 6. SAMPLE SCHOLARSHIPS
-- ================================================================
INSERT INTO scholarships (
  title_en, title_ar, description_en, description_ar,
  category, student_name, university_name, scholarship_amount, is_active
) VALUES
  (
    'University Excellence Scholarship',
    'منحة التميز الجامعي',
    'Full scholarship awarded to outstanding students pursuing higher education.',
    'منحة كاملة تُمنح للطلاب المتميزين الساعين للحصول على التعليم العالي.',
    'awarded',
    'Ahmad Hassan',
    'Birzeit University',
    5000.00,
    true
  ),
  (
    'Engineering Scholarship 2025',
    'منحة الهندسة 2025',
    'Scholarship opportunity for Palestinian students interested in engineering programs.',
    'فرصة منحة للطلاب الفلسطينيين المهتمين ببرامج الهندسة.',
    'available',
    NULL,
    NULL,
    8000.00,
    true
  ),
  (
    'Sponsor a Student',
    'اكفل طالباً',
    'Help sponsor a student''s education. Your contribution makes a difference in a young person''s future.',
    'ساعد في رعاية تعليم الطالب. مساهمتك تحدث فرقاً في مستقبل الشباب.',
    'sponsor_opportunity',
    NULL,
    NULL,
    NULL,
    true
  )
ON CONFLICT DO NOTHING;

-- ================================================================
-- VERIFICATION
-- ================================================================
SELECT 'Sample data inserted successfully!' as status;

SELECT 'Admin Users:' as info, COUNT(*) as count FROM admin_users;
SELECT 'Homepage Gallery:' as info, COUNT(*) as count FROM homepage_gallery;
SELECT 'News Ticker:' as info, COUNT(*) as count FROM news_ticker;
SELECT 'Activities:' as info, COUNT(*) as count FROM activities;
SELECT 'Projects:' as info, COUNT(*) as count FROM projects;
SELECT 'Scholarships:' as info, COUNT(*) as count FROM scholarships;
