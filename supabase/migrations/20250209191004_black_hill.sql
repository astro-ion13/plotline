/*
  # Add sticky notes feature

  1. New Tables
    - `sticky_notes`
      - `id` (uuid, primary key)
      - `story_id` (uuid, references stories.id)
      - `content` (text)
      - `color` (text)
      - `position_x` (integer)
      - `position_y` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `sticky_notes` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS sticky_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  color text NOT NULL DEFAULT 'yellow',
  position_x integer NOT NULL DEFAULT 0,
  position_y integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sticky_notes ENABLE ROW LEVEL SECURITY;

-- Allow users to read sticky notes for stories they can access
CREATE POLICY "Users can read sticky notes for accessible stories"
  ON sticky_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = sticky_notes.story_id
      AND stories.user_id = auth.uid()
    )
  );

-- Allow users to create sticky notes for their stories
CREATE POLICY "Users can create sticky notes for their stories"
  ON sticky_notes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = sticky_notes.story_id
      AND stories.user_id = auth.uid()
    )
  );

-- Allow users to update sticky notes for their stories
CREATE POLICY "Users can update their sticky notes"
  ON sticky_notes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = sticky_notes.story_id
      AND stories.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = sticky_notes.story_id
      AND stories.user_id = auth.uid()
    )
  );

-- Allow users to delete sticky notes for their stories
CREATE POLICY "Users can delete their sticky notes"
  ON sticky_notes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = sticky_notes.story_id
      AND stories.user_id = auth.uid()
    )
  );