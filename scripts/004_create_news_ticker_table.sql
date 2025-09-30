-- Create news_ticker table for admin-managed news ticker
CREATE TABLE IF NOT EXISTS news_ticker (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text_en TEXT NOT NULL,
  text_ar TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE news_ticker ENABLE ROW LEVEL SECURITY;

-- Allow public to read active news
CREATE POLICY "Public can view active news ticker" ON news_ticker
  FOR SELECT USING (is_active = true);

-- Allow authenticated users (admins) to manage news
CREATE POLICY "Authenticated users can manage news ticker" ON news_ticker
  FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_ticker_updated_at BEFORE UPDATE
ON news_ticker FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default news items
INSERT INTO news_ticker (text_en, text_ar, is_active, order_index) VALUES
  ('Weekly peaceful demonstrations continue every Friday at 12 PM in Bil''in village center', 'المظاهرات السلمية الأسبوعية تستمر كل جمعة في الساعة 12 ظهراً في مركز قرية بلعين', true, 1),
  ('New educational programs launched for local children and youth', 'إطلاق برامج تعليمية جديدة للأطفال والشباب المحليين', true, 2),
  ('International solidarity visitors welcomed to experience Bil''in''s story', 'ترحيب بزوار التضامن الدوليين لتجربة قصة بلعين', true, 3),
  ('Community olive harvest season begins - volunteers needed', 'بدء موسم قطف الزيتون المجتمعي - نحتاج متطوعين', true, 4);
