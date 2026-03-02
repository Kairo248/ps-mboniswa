-- =============================================================================
-- Storage bucket for admin content media (photos & videos)
-- Public bucket so landing page can display uploaded files
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'content-media',
  'content-media',
  true,
  52428800,  -- 50 MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow anyone to read (public bucket); only admins to upload/update/delete
CREATE POLICY "content_media_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-media');

CREATE POLICY "content_media_insert_admin"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'content-media' AND public.is_admin());

CREATE POLICY "content_media_update_admin"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'content-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'content-media');

CREATE POLICY "content_media_delete_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'content-media' AND public.is_admin());
