/*
  # Add tags and notes to stories table

  1. Changes
    - Add `tags` column (text array) to store story tags
    - Add `notes` column (text) to store additional notes
    
  2. Notes
    - Tags are stored as an array of strings
    - Both fields are optional (nullable)
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stories' AND column_name = 'tags'
  ) THEN
    ALTER TABLE stories ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stories' AND column_name = 'notes'
  ) THEN
    ALTER TABLE stories ADD COLUMN notes text;
  END IF;
END $$;