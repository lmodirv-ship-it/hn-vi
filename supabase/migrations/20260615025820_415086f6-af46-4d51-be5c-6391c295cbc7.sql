ALTER TABLE public.exports
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS share_token text UNIQUE;

DROP POLICY IF EXISTS "Public can view shared exports" ON public.exports;
CREATE POLICY "Public can view shared exports"
ON public.exports
FOR SELECT
TO anon
USING (is_public = true AND share_token IS NOT NULL);

GRANT SELECT ON public.exports TO anon;