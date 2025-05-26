/*
  # Initial SlimeList Schema

  1. New Tables
    - `anime_list`
      - `id` (int, primary key)
      - `user_id` (uuid, references auth.users)
      - `anime_id` (int, from MAL)
      - `title` (text)
      - `image_url` (text)
      - `status` (enum: watching, completed, plan_to_watch, dropped)
      - `episodes_watched` (int)
      - `total_episodes` (int)
      - `score` (int, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `anime_list` table
    - Add policies for authenticated users to manage their own anime list
*/

-- Create anime status enum type
CREATE TYPE anime_status AS ENUM ('watching', 'completed', 'plan_to_watch', 'dropped');

-- Create anime_list table
CREATE TABLE IF NOT EXISTS anime_list (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  status anime_status NOT NULL,
  episodes_watched INTEGER NOT NULL DEFAULT 0,
  total_episodes INTEGER NOT NULL DEFAULT 0,
  score SMALLINT CHECK (score IS NULL OR (score >= 0 AND score <= 10)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Each user can only have one entry per anime
  UNIQUE(user_id, anime_id)
);

-- Enable Row Level Security
ALTER TABLE anime_list ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- 1. Users can read their own anime list
CREATE POLICY "Users can read own anime list"
  ON anime_list
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Users can insert into their own anime list
CREATE POLICY "Users can insert into own anime list"
  ON anime_list
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own anime list
CREATE POLICY "Users can update own anime list"
  ON anime_list
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Users can delete from their own anime list
CREATE POLICY "Users can delete from own anime list"
  ON anime_list
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_anime_list_updated_at
  BEFORE UPDATE ON anime_list
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column();

-- Create index for performance
CREATE INDEX idx_anime_list_user_id ON anime_list(user_id);
CREATE INDEX idx_anime_list_status ON anime_list(status);