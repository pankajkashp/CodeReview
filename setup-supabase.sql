-- ============================================
-- CODESAGE: Supabase Table Setup
-- ============================================
-- Run this SQL in your Supabase Dashboard:
-- Go to: https://supabase.com/dashboard/project/oibjcvvjbvututhfbadm/sql/new
-- Paste this entire file and click "Run"
-- ============================================

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can read their own reviews
CREATE POLICY "Users can read own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Policy: Users can insert their own reviews
CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
