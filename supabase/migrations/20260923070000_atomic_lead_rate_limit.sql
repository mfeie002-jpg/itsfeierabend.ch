BEGIN;

-- Reserve one public lead-form attempt atomically. The per-IP advisory lock
-- closes the count-then-insert race that otherwise lets concurrent requests
-- bypass the public endpoint's abuse limit.
CREATE OR REPLACE FUNCTION public.reserve_lead_submission(
  p_ip_hash text,
  p_limit integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_count integer;
BEGIN
  IF p_ip_hash IS NULL OR length(p_ip_hash) < 32 THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended('itsfeierabend:lead-form:' || p_ip_hash, 0)
  );

  SELECT count(*)::integer
    INTO v_count
    FROM public.rate_limits
   WHERE scope = 'lead_form'
     AND ip_hash = p_ip_hash
     AND created_at >= now() - make_interval(
       secs => greatest(coalesce(p_window_seconds, 1), 1)
     );

  IF v_count >= greatest(coalesce(p_limit, 1), 1) THEN
    RETURN false;
  END IF;

  INSERT INTO public.rate_limits (ip_hash, scope)
  VALUES (p_ip_hash, 'lead_form');

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_lead_submission(
  text, integer, integer
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.reserve_lead_submission(
  text, integer, integer
) TO service_role;

COMMIT;
