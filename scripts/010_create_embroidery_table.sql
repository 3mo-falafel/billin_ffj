-- Ensure pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Create traditional_embroidery table for showcase (pictures and text only)
CREATE TABLE IF NOT EXISTS traditional_embroidery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE traditional_embroidery ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON traditional_embroidery
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON traditional_embroidery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON traditional_embroidery
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON traditional_embroidery
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX idx_traditional_embroidery_featured ON traditional_embroidery(is_featured);
CREATE INDEX idx_traditional_embroidery_active ON traditional_embroidery(is_active);
CREATE INDEX idx_traditional_embroidery_created_at ON traditional_embroidery(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_traditional_embroidery_updated_at BEFORE UPDATE ON traditional_embroidery
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
