-- Ensure pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Create embroidery_for_sale table for items to buy
CREATE TABLE IF NOT EXISTS embroidery_for_sale (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	title_en TEXT NOT NULL,
	title_ar TEXT,
	description_en TEXT,
	description_ar TEXT,
	price DECIMAL(10,2),
	contact_url TEXT, -- URL or social media link for contact
	image_url TEXT,
	is_featured BOOLEAN DEFAULT false,
	is_active BOOLEAN DEFAULT true,
	category VARCHAR(50) DEFAULT 'embroidery',
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE embroidery_for_sale ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON embroidery_for_sale
	FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON embroidery_for_sale
	FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON embroidery_for_sale
	FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON embroidery_for_sale
	FOR DELETE USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_embroidery_for_sale_category ON embroidery_for_sale(category);
CREATE INDEX IF NOT EXISTS idx_embroidery_for_sale_featured ON embroidery_for_sale(is_featured);
CREATE INDEX IF NOT EXISTS idx_embroidery_for_sale_active ON embroidery_for_sale(is_active);
CREATE INDEX IF NOT EXISTS idx_embroidery_for_sale_created_at ON embroidery_for_sale(created_at);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
		NEW.updated_at = NOW();
		RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_embroidery_for_sale_updated_at BEFORE UPDATE ON embroidery_for_sale
	FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
