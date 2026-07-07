ALTER TABLE public.community_messages ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.community_messages(id) ON DELETE CASCADE;
ALTER TABLE public.community_messages ADD COLUMN IF NOT EXISTS likes uuid[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS community_messages_parent_id_idx ON public.community_messages(parent_id);