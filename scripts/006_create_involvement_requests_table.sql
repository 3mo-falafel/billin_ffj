-- Create involvement_requests table for managing volunteer applications
CREATE TABLE IF NOT EXISTS public.involvement_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  involvement_type VARCHAR(255) NOT NULL,
  details TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.involvement_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to insert their own requests
CREATE POLICY "Anyone can insert involvement requests" ON public.involvement_requests
  FOR INSERT WITH CHECK (true);

-- Create policy for authenticated admins to view all requests
CREATE POLICY "Admins can view all involvement requests" ON public.involvement_requests
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.admin_users WHERE is_active = true
  ));

-- Create policy for authenticated admins to update requests
CREATE POLICY "Admins can update involvement requests" ON public.involvement_requests
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM public.admin_users WHERE is_active = true
  ));

-- Create policy for authenticated admins to delete requests
CREATE POLICY "Admins can delete involvement requests" ON public.involvement_requests
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM public.admin_users WHERE is_active = true
  ));

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_involvement_requests_created_at ON public.involvement_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_involvement_requests_status ON public.involvement_requests(status);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_involvement_requests_updated_at BEFORE UPDATE
    ON public.involvement_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
