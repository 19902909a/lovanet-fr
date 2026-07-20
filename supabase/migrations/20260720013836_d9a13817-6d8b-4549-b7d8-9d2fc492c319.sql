
-- Public buckets: anyone can read, only service_role can write (already the intent).
CREATE POLICY "Public buckets are readable"
ON storage.objects FOR SELECT
USING (
  bucket_id IN (
    SELECT id FROM storage.buckets WHERE public = true
  )
);

-- Private database_export_14_07_26: only service_role (backend/admin) can access.
CREATE POLICY "Admins can read private exports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'database_export_14_07_26'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can upload private exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'database_export_14_07_26'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update private exports"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'database_export_14_07_26'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete private exports"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'database_export_14_07_26'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
