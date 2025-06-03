CREATE POLICY "Give auth users can insert to files in their own folder" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'pet-avatars' 
  AND (storage.foldername(name))[1] = (select auth.uid()::text)
);
