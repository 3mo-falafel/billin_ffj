-- Temporary fix: Disable RLS for involvement_requests table
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily to get the form working
ALTER TABLE public.involvement_requests DISABLE ROW LEVEL SECURITY;
