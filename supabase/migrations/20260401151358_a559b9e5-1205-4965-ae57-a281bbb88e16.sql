
-- Drop existing function to clear stale prepared statements
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Recreate with fresh compilation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, access_level)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    CASE WHEN new.email = 'vozesdamitologia1@gmail.com' THEN 'admin' ELSE 'free' END
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RETURN new;
END;
$$;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Remove insecure temp policies from contents
DROP POLICY IF EXISTS "Temp Access for Testing" ON public.contents;
DROP POLICY IF EXISTS "Temporario_Liberado" ON public.contents;

-- Admin-only INSERT for contents
CREATE POLICY "Admin can insert contents"
  ON public.contents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'vozesdamitologia1@gmail.com'
  );

-- Admin-only UPDATE for contents
CREATE POLICY "Admin can update contents"
  ON public.contents
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'vozesdamitologia1@gmail.com'
  )
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'vozesdamitologia1@gmail.com'
  );

-- Admin-only DELETE for contents
CREATE POLICY "Admin can delete contents"
  ON public.contents
  FOR DELETE
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'vozesdamitologia1@gmail.com'
  );
