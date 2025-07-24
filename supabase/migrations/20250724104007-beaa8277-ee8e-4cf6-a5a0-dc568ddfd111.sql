-- Fix function search path security issue
-- Set search_path for the update_updated_at_column function to prevent potential security issues
ALTER FUNCTION public.update_updated_at_column() SET search_path = pg_catalog, pg_temp;