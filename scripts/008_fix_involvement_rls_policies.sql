-- Fix RLS policies for involvement_requests table
-- Run this in Supabase SQL Editor

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.involvement_requests;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.involvement_requests;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.involvement_requests;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.involvement_requests;

-- Create new policies with correct syntax

-- Allow public (anonymous) users to insert
CREATE POLICY "Enable insert for anon users" ON public.involvement_requests
  FOR INSERT TO anon WITH CHECK (true);

-- Allow public (anonymous) users to insert (service_role fallback)
CREATE POLICY "Enable insert for service_role" ON public.involvement_requests
  FOR INSERT TO service_role WITH CHECK (true);

-- Allow authenticated users to read all records
CREATE POLICY "Enable read for authenticated users" ON public.involvement_requests
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to update all records
CREATE POLICY "Enable update for authenticated users" ON public.involvement_requests
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users to delete all records
CREATE POLICY "Enable delete for authenticated users" ON public.involvement_requests
  FOR DELETE TO authenticated USING (true);

-- Also allow service_role to do everything (for admin functions)
CREATE POLICY "Enable all for service_role" ON public.involvement_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);
