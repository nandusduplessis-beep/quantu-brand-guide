-- Create storage bucket for campaign files (public for now, can be changed to private later)
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-files', 'campaign-files', true);

-- Allow anyone to view campaign files (public bucket)
CREATE POLICY "Anyone can view campaign files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'campaign-files');

-- Allow anyone to upload campaign files (for now, since no auth)
CREATE POLICY "Anyone can upload campaign files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'campaign-files');

-- Allow anyone to delete their uploaded files
CREATE POLICY "Anyone can delete campaign files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'campaign-files');