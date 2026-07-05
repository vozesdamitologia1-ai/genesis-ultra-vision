
-- 1. Remove public exposure of profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 2. Consolidate profiles UPDATE policies to prevent access_level self-escalation
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profile except access_level" ON public.profiles;
DROP POLICY IF EXISTS "Apenas admin muda cargos" ON public.profiles;

CREATE POLICY "Users update own profile (no role change)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND access_level = (SELECT p.access_level FROM public.profiles p WHERE p.id = auth.uid())
);

CREATE POLICY "Admin can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'vozesdamitologia1@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'vozesdamitologia1@gmail.com');

-- 3. Add explicit owner-only UPDATE policy on community_messages
CREATE POLICY "Users can update own messages"
ON public.community_messages
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Restrict EXECUTE on SECURITY DEFINER trigger function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
