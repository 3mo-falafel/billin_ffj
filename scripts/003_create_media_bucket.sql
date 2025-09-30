-- Create a public 'media' storage bucket for images & videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read (serve) files from the public media bucket
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Allow only admin users to insert/upload
CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND auth.uid() IN (SELECT id FROM public.admin_users)
);

-- Allow only admin users to update (replace) existing media
CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND auth.uid() IN (SELECT id FROM public.admin_users)
)
WITH CHECK (
  bucket_id = 'media'
  AND auth.uid() IN (SELECT id FROM public.admin_users)
);

-- Allow only admin users to delete media
CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.uid() IN (SELECT id FROM public.admin_users)
);

-- (Optional) Limit file size via a storage function / edge function (not included here)

-- Note: Apply size/type validation on the client before upload as added in the React forms.
