-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#f97316',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Create secure policies for each operation
CREATE POLICY "restaurants_select_policy" ON public.restaurants
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "restaurants_insert_policy" ON public.restaurants
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "restaurants_update_policy" ON public.restaurants
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "restaurants_delete_policy" ON public.restaurants
FOR DELETE TO authenticated USING (auth.uid() = user_id);