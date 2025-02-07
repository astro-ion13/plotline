/*
  # Initial Schema Setup for Storytelling App

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `stories` table
    - Add policies for:
      - Users can read all stories
      - Users can only create/update/delete their own stories
*/

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Allow users to read all stories
CREATE POLICY "Anyone can read stories"
  ON stories
  FOR SELECT
  USING (true);

-- Allow authenticated users to create their own stories
CREATE POLICY "Users can create their own stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own stories
CREATE POLICY "Users can update their own stories"
  ON stories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own stories
CREATE POLICY "Users can delete their own stories"
  ON stories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);