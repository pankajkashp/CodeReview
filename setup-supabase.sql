-- ============================================
-- CODESAGE: Supabase Table Setup
-- ============================================
-- Run this SQL in your Supabase Dashboard:
-- Go to: https://supabase.com/dashboard/project/oibjcvvjbvututhfbadm/sql/new
-- Paste this entire file and click "Run"
-- ============================================

-- 0. Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional index to speed up user history queries
CREATE INDEX IF NOT EXISTS reviews_user_created_at_idx
  ON reviews (user_id, created_at DESC);

-- 2. Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can read their own reviews
DROP POLICY IF EXISTS "Users can read own reviews" ON reviews;
CREATE POLICY "Users can read own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Policy: Users can insert their own reviews
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Users can delete their own reviews
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Create profile image bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('codereview', 'codereview', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public;

-- 7. Storage policy: authenticated users can upload avatars
DROP POLICY IF EXISTS "Authenticated users can upload codereview files" ON storage.objects;
CREATE POLICY "Authenticated users can upload codereview files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'codereview'
    AND auth.role() = 'authenticated'
  );

-- 8. Storage policy: public read access for avatar images
DROP POLICY IF EXISTS "Public read access for codereview files" ON storage.objects;
CREATE POLICY "Public read access for codereview files" ON storage.objects
  FOR SELECT USING (bucket_id = 'codereview');
