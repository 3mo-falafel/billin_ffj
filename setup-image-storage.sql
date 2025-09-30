-- Setup Supabase Storage for Images
-- Run this in your Supabase SQL Editor

-- Step 1: Create the images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create storage policies for public access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Step 3: Allow anonymous access for public viewing
CREATE POLICY "Anonymous Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Step 4: Verify setup
SELECT 'Image storage setup complete!' as status;
SELECT * FROM storage.buckets WHERE id = 'images';

