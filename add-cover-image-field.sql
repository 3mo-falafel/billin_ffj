-- Add cover_image field to gallery table for videos
-- Run this in your Supabase SQL Editor

-- Add cover_image column to gallery table
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Update existing video to have a cover image
UPDATE public.gallery 
SET cover_image = '/placeholder.jpg'
WHERE media_type = 'video' AND cover_image IS NULL;

-- Verify the changes
SELECT 'Cover image field added successfully!' as status;
SELECT id, title_en, media_type, cover_image FROM public.gallery WHERE media_type = 'video';

