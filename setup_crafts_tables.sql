-- Run this script in your Supabase SQL editor to create the craft tables

-- Ensure pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First, create the traditional_embroidery table (showcase only)
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

-- Enable RLS for traditional_embroidery
ALTER TABLE traditional_embroidery ENABLE ROW LEVEL SECURITY;

-- Create policies for traditional_embroidery
CREATE POLICY "Enable read access for all users" ON traditional_embroidery
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON traditional_embroidery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON traditional_embroidery
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON traditional_embroidery
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for traditional_embroidery
CREATE INDEX idx_traditional_embroidery_featured ON traditional_embroidery(is_featured);
CREATE INDEX idx_traditional_embroidery_active ON traditional_embroidery(is_active);
CREATE INDEX IF NOT EXISTS idx_traditional_embroidery_created_at ON traditional_embroidery(created_at);

-- Trigger for updated_at on traditional_embroidery
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_traditional_embroidery_updated_at BEFORE UPDATE ON traditional_embroidery
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create embroidery_for_sale table (items to buy)
CREATE TABLE IF NOT EXISTS embroidery_for_sale (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  price DECIMAL(10,2),
  contact_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  category VARCHAR(50) DEFAULT 'embroidery',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS for embroidery_for_sale
ALTER TABLE embroidery_for_sale ENABLE ROW LEVEL SECURITY;

-- Create policies for embroidery_for_sale
CREATE POLICY "Enable read access for all users" ON embroidery_for_sale
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON embroidery_for_sale
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON embroidery_for_sale
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON embroidery_for_sale
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for embroidery_for_sale
CREATE INDEX IF NOT EXISTS idx_embroidery_for_sale_category ON embroidery_for_sale(category);
CREATE INDEX IF NOT EXISTS idx_embroidery_for_sale_featured ON embroidery_for_sale(is_featured);
CREATE INDEX IF NOT EXISTS idx_embroidery_for_sale_active ON embroidery_for_sale(is_active);
CREATE INDEX IF NOT EXISTS idx_embroidery_for_sale_created_at ON embroidery_for_sale(created_at);

-- Trigger for updated_at on embroidery_for_sale
CREATE TRIGGER update_embroidery_for_sale_updated_at BEFORE UPDATE ON embroidery_for_sale
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Handmade items table (showcase crafts)
CREATE TABLE IF NOT EXISTS handmade_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  contact_number TEXT,
  category VARCHAR(50) DEFAULT 'general',
  material TEXT,
  dimensions TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE handmade_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON handmade_items
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON handmade_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON handmade_items
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON handmade_items
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_handmade_items_category ON handmade_items(category);
CREATE INDEX IF NOT EXISTS idx_handmade_items_featured ON handmade_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_handmade_items_active ON handmade_items(is_active);
CREATE INDEX IF NOT EXISTS idx_handmade_items_created_at ON handmade_items(created_at);

CREATE TRIGGER update_handmade_items_updated_at BEFORE UPDATE ON handmade_items
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO traditional_embroidery (title_en, title_ar, description_en, description_ar, image_url, is_featured)
VALUES ('Traditional Thob Motif', 'نقش الثوب التقليدي', 'Classic tatreez patterns showcased for education', 'أنماط تطريز تقليدية للعرض والتثقيف', NULL, true);

INSERT INTO handmade_items (title_en, title_ar, description_en, description_ar, category, material, dimensions, is_featured)
VALUES ('Olive Wood Bowl', 'وعاء من خشب الزيتون', 'Handcrafted bowl made from local olive wood', 'وعاء مصنوع يدوياً من خشب الزيتون المحلي', 'woodwork', 'Olive Wood', '20cm diameter', false);

INSERT INTO embroidery_for_sale (title_en, title_ar, description_en, description_ar, price, contact_url, category, is_featured)
VALUES ('Embroidered Pillow Cover', 'غطاء وسادة مطرز', 'Handmade pillow cover featuring traditional Palestinian motifs', 'غطاء وسادة مصنوع يدوياً يحمل رسوماً فلسطينية تقليدية', 45.00, 'https://wa.me/970000000000', 'home-decor', false);

-- Display success message
SELECT 'Craft tables created successfully! You can now use the admin interface to manage showcase (traditional + handmade) and embroidery for sale.' as message;
