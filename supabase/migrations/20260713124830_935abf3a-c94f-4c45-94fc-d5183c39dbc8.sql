
CREATE TABLE public.mentor_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  path_type text NOT NULL DEFAULT 'flow',
  title text NOT NULL DEFAULT 'Nova conversa',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_threads TO authenticated;
GRANT ALL ON public.mentor_threads TO service_role;
ALTER TABLE public.mentor_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_threads_all" ON public.mentor_threads FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.mentorship_logs ADD COLUMN thread_id uuid REFERENCES public.mentor_threads(id) ON DELETE CASCADE;
CREATE INDEX mentorship_logs_thread_idx ON public.mentorship_logs (thread_id, created_at);

-- Migrate: one thread per user+path_type+day
WITH groups AS (
  SELECT
    user_id,
    COALESCE(path_type, 'flow') AS pt,
    date_trunc('day', created_at) AS day,
    MIN(created_at) AS first_at,
    MAX(created_at) AS last_at,
    (ARRAY_AGG(user_query ORDER BY created_at ASC))[1] AS first_q
  FROM public.mentorship_logs
  WHERE user_id IS NOT NULL
  GROUP BY user_id, COALESCE(path_type, 'flow'), date_trunc('day', created_at)
),
inserted AS (
  INSERT INTO public.mentor_threads (user_id, path_type, title, created_at, updated_at)
  SELECT user_id, pt, LEFT(COALESCE(first_q, 'Conversa'), 60), first_at, last_at
  FROM groups
  RETURNING id, user_id, path_type, created_at, updated_at
)
UPDATE public.mentorship_logs l
SET thread_id = i.id
FROM inserted i
WHERE l.user_id = i.user_id
  AND COALESCE(l.path_type, 'flow') = i.path_type
  AND date_trunc('day', l.created_at) = date_trunc('day', i.created_at);
