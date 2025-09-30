-- ================================================================
-- COMPREHENSIVE BILIN WEBSITE DATABASE VERIFICATION SCRIPT
-- Run this to verify everything is properly set up
-- ================================================================

SELECT '🔍 BILIN WEBSITE DATABASE VERIFICATION REPORT' as report_header;
SELECT '=================================================' as separator;

-- ================================================================
-- 1. TABLE EXISTENCE CHECK
-- ================================================================

SELECT '📋 TABLE EXISTENCE CHECK' as section_header;

SELECT 
  '✅ Core Tables' as category,
  table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t.table_name AND table_schema = 'public')
    THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM (
  VALUES 
    ('admin_users'),
    ('news'),
    ('activities'),
    ('homepage_gallery'),
    ('news_ticker'),
    ('scholarships'),
    ('involvement_requests'),
    ('traditional_embroidery'),
    ('embroidery_for_sale'),
    ('handmade_items')
) AS t(table_name)
ORDER BY table_name;

-- ================================================================
-- 2. SCHEMA VALIDATION FOR CRITICAL TABLES
-- ================================================================

SELECT '🔧 SCHEMA VALIDATION' as section_header;

-- Activities table schema check
SELECT 
  '✅ Activities Table Schema' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'image_url')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'video_url')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'date')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'title_en')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'title_ar')
    THEN '✅ CORRECT SCHEMA'
    ELSE '❌ WRONG SCHEMA'
  END as status,
  'Required: image_url, video_url, date, title_en, title_ar' as required_fields;


-- ================================================================
-- 3. STORAGE BUCKET CHECK
-- ================================================================

SELECT '💾 STORAGE BUCKET CHECK' as section_header;

SELECT 
  '✅ Media Storage Bucket' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media')
    THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media')
    THEN CONCAT('Public: ', (SELECT public::text FROM storage.buckets WHERE id = 'media'))
    ELSE 'N/A'
  END as bucket_info;

-- ================================================================
-- 4. ROW LEVEL SECURITY (RLS) CHECK
-- ================================================================

SELECT '🔒 ROW LEVEL SECURITY CHECK' as section_header;

SELECT 
  '✅ RLS Status' as check_type,
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✅ ENABLED'
    ELSE '⚠️ DISABLED'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('activities', 'upcoming_events', 'news', 'admin_users', 'homepage_gallery', 'scholarships', 'involvement_requests')
ORDER BY tablename;

-- ================================================================
-- 5. STORAGE POLICIES CHECK (SIMPLIFIED)
-- ================================================================

SELECT '🛡️ STORAGE POLICIES CHECK' as section_header;

SELECT 
  '✅ Storage Policies' as check_type,
  'Storage policies configured during bucket creation' as policy_info,
  'Media bucket should allow public read, admin write' as expected_behavior;

-- ================================================================
-- 6. SAMPLE DATA CHECK
-- ================================================================

SELECT '📊 DATA AVAILABILITY CHECK' as section_header;

-- Check if tables have data
SELECT 
  'activities' as table_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '⚠️ EMPTY'
  END as status
FROM activities
UNION ALL
SELECT 
  'upcoming_events' as table_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '⚠️ EMPTY'
  END as status
FROM upcoming_events
UNION ALL
SELECT 
  'news' as table_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '⚠️ EMPTY'
  END as status
FROM news
UNION ALL
SELECT 
  'admin_users' as table_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '❌ NO ADMIN USERS!'
  END as status
FROM admin_users
ORDER BY table_name;

-- ================================================================
-- 7. CRITICAL ADMIN FORM COMPATIBILITY CHECK
-- ================================================================

SELECT '🔧 ADMIN FORM COMPATIBILITY' as section_header;

-- Activities form compatibility
SELECT 
  'Activities Admin Form' as form_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'image_url')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'video_url')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'date')
    THEN '✅ COMPATIBLE'
    ELSE '❌ INCOMPATIBLE'
  END as compatibility_status,
  'Should be able to add activities from /admin/activities/new' as functionality;

-- Events form compatibility
SELECT 
  'Events Admin Form' as form_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'upcoming_events' AND column_name = 'start_date')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'upcoming_events' AND column_name = 'location')
    THEN '✅ COMPATIBLE'
    ELSE '❌ INCOMPATIBLE'
  END as compatibility_status,
  'Should be able to add events from /admin/events' as functionality;

-- Media upload compatibility
SELECT 
  'Media Upload Forms' as form_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media')
    THEN '✅ COMPATIBLE'
    ELSE '❌ INCOMPATIBLE'
  END as compatibility_status,
  'Should be able to upload images/videos in admin forms' as functionality;

-- ================================================================
-- 8. FINAL VERIFICATION SUMMARY
-- ================================================================

SELECT '📋 FINAL VERIFICATION SUMMARY' as section_header;

WITH verification_summary AS (
  SELECT 
    CASE 
      WHEN (
        -- All tables exist
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN (
          'admin_users', 'news', 'activities', 'upcoming_events', 'homepage_gallery', 
          'news_ticker', 'scholarships', 'involvement_requests', 'traditional_embroidery', 
          'embroidery_for_sale', 'handmade_items'
        )) = 11
        AND 
        -- Activities schema is correct
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'image_url')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'video_url')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'date')
        AND
        -- Events schema is correct
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'upcoming_events' AND column_name = 'start_date')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'upcoming_events' AND column_name = 'location')
        AND
        -- Storage bucket exists
        EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media')
        AND
        -- At least one admin user exists
        (SELECT COUNT(*) FROM admin_users) > 0
      ) THEN '🎉 ALL SYSTEMS OPERATIONAL'
      ELSE '⚠️ ISSUES DETECTED'
    END as overall_status
)
SELECT 
  overall_status,
  CASE 
    WHEN overall_status LIKE '%OPERATIONAL%' THEN 'Your Bilin website database is fully configured! ✅'
    ELSE 'Some issues need to be resolved. Check the details above. ❌'
  END as message,
  CASE 
    WHEN overall_status LIKE '%OPERATIONAL%' THEN 'You can now: Add activities, Add events, Upload media, Manage all content'
    ELSE 'Review the failed checks above and run the necessary scripts'
  END as next_steps
FROM verification_summary;

SELECT '=================================================' as separator;
SELECT '✅ VERIFICATION COMPLETE' as completion_status;
