-- Remove the overly permissive public select that bypasses VIP restrictions
DROP POLICY IF EXISTS "Allow public select" ON public.contents;

-- Replace with a safe public policy that only shows free content
CREATE POLICY "Public can view free contents"
  ON public.contents
  FOR SELECT
  TO public
  USING (is_vip = false);
