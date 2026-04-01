
-- Drop all existing policies on contents to start clean
DROP POLICY IF EXISTS "Admin can insert contents" ON public.contents;
DROP POLICY IF EXISTS "Admin can update contents" ON public.contents;
DROP POLICY IF EXISTS "Admin can delete contents" ON public.contents;
DROP POLICY IF EXISTS "Admin Master Access" ON public.contents;
DROP POLICY IF EXISTS "Admin_Full_Power" ON public.contents;
DROP POLICY IF EXISTS "VIP content is restricted" ON public.contents;
DROP POLICY IF EXISTS "Public can view free content" ON public.contents;
DROP POLICY IF EXISTS "Public can view free contents" ON public.contents;

-- SELECT: anyone can see free content; VIP requires vip access_level
CREATE POLICY "Anyone can view free content"
  ON public.contents FOR SELECT TO public
  USING (is_vip = false);

CREATE POLICY "VIP users can view all content"
  ON public.contents FOR SELECT TO authenticated
  USING (
    is_vip = false
    OR (SELECT p.access_level FROM public.profiles p WHERE p.id = auth.uid()) = 'vip'
    OR (SELECT p.access_level FROM public.profiles p WHERE p.id = auth.uid()) = 'admin'
  );

-- Admin write access using auth.jwt() instead of auth.users
CREATE POLICY "Admin can insert"
  ON public.contents FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'vozesdamitologia1@gmail.com');

CREATE POLICY "Admin can update"
  ON public.contents FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'vozesdamitologia1@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'vozesdamitologia1@gmail.com');

CREATE POLICY "Admin can delete"
  ON public.contents FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'vozesdamitologia1@gmail.com');
