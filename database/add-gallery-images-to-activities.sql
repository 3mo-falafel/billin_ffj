-- Add gallery_images column to activities table for multiple image support
-- Run this migration on your database to enable multiple images per activity

-- Add the new column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'gallery_images'
    ) THEN
        ALTER TABLE activities ADD COLUMN gallery_images JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Migrate existing single image_url to gallery_images array
UPDATE activities 
SET gallery_images = jsonb_build_array(image_url)
WHERE image_url IS NOT NULL 
  AND image_url != '' 
  AND (gallery_images IS NULL OR gallery_images = '[]'::jsonb);

-- Create index for gallery_images
CREATE INDEX IF NOT EXISTS idx_activities_gallery_images ON activities USING GIN (gallery_images);

COMMENT ON COLUMN activities.gallery_images IS 'JSON array of image URLs for the activity gallery';
