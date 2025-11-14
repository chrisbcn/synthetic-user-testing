-- Migration: Create persona_images table
-- This stores persona image URLs (images are stored in Vercel Blob, URLs stored here)

CREATE TABLE IF NOT EXISTS persona_images (
  id BIGSERIAL PRIMARY KEY,
  persona_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by persona name
CREATE INDEX IF NOT EXISTS idx_persona_images_persona_name ON persona_images(persona_name);

-- Create index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_persona_images_created_at ON persona_images(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_persona_images_updated_at BEFORE UPDATE ON persona_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE persona_images IS 'Stores image URLs for synthetic user testing personas. Images are stored in Vercel Blob Storage.';

