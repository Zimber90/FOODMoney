-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_restaurants_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF ON public.restaurants;

-- Create the trigger
CREATE TRIGGER handle_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.handle_restaurants_updated_at();