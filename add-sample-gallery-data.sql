-- Add sample gallery data for testing
-- Run this in your Supabase SQL Editor

-- Sample base64 encoded images (small test images)
-- These are tiny 1x1 pixel images in different colors for testing

INSERT INTO public.gallery (
  title_en, 
  title_ar, 
  description_en, 
  description_ar, 
  media_url, 
  media_type, 
  category
) VALUES 
(
  'Test Album 1',
  'ألبوم تجريبي 1',
  'Sample photos for testing the gallery system',
  'صور تجريبية لاختبار نظام المعرض',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'image',
  'community'
),
(
  'Test Album 1',
  'ألبوم تجريبي 1',
  'Sample photos for testing the gallery system',
  'صور تجريبية لاختبار نظام المعرض',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'image',
  'community'
),
(
  'Test Album 1',
  'ألبوم تجريبي 1',
  'Sample photos for testing the gallery system',
  'صور تجريبية لاختبار نظام المعرض',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'image',
  'community'
),
(
  'Test Album 2',
  'ألبوم تجريبي 2',
  'Another test album with different photos',
  'ألبوم تجريبي آخر بصور مختلفة',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'image',
  'culture'
),
(
  'Test Album 2',
  'ألبوم تجريبي 2',
  'Another test album with different photos',
  'ألبوم تجريبي آخر بصور مختلفة',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'image',
  'culture'
);

-- Verify the data was inserted
SELECT 'Sample gallery data inserted successfully!' as status;
SELECT id, title_en, media_type, category FROM public.gallery ORDER BY created_at DESC LIMIT 5;

