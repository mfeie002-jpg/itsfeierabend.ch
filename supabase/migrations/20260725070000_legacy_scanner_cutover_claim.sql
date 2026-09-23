BEGIN;

-- Install the atomic reservation independently of earlier launch migrations.
-- This migration is intentionally safe to apply when a fresh environment has
-- already created the function through 20260725060000.
CREATE OR REPLACE FUNCTION public.claim_legacy_analysis_scan(
  p_lead_id uuid,
  p_normalized_domain text,
  p_site_name text,
  p_language text,
  p_ip_hash text,
  p_per_ip_limit integer,
  p_global_limit integer
)
RETURNS TABLE (
  scan_token text,
  scan_reused boolean,
  deny_reason text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lead_website_url text;
  v_lead_created_at timestamptz;
  v_lead_domain text;
  v_existing_token text;
  v_scan_token text;
  v_global_count integer;
  v_ip_count integer;
BEGIN
  PERFORM pg_advisory_xact_lock(
    hashtextextended('itsfeierabend:legacy-analysis-scan', 0)
  );

  IF p_ip_hash IS NULL OR p_site_name IS NULL OR p_normalized_domain IS NULL THEN
    RETURN QUERY
      SELECT NULL::text, false, 'scan_guard_unavailable'::text;
    RETURN;
  END IF;

  SELECT leads.website_url, leads.created_at
    INTO v_lead_website_url, v_lead_created_at
    FROM public.leads
   WHERE leads.id = p_lead_id
     AND leads.lead_type = 'free_audit'
   LIMIT 1;

  IF v_lead_website_url IS NULL THEN
    RETURN QUERY
      SELECT NULL::text, false, 'ineligible_lead'::text;
    RETURN;
  END IF;

  v_lead_domain := lower(
    regexp_replace(
      split_part(
        regexp_replace(v_lead_website_url, '^https?://', '', 'i'),
        '/',
        1
      ),
      '^www\.',
      '',
      'i'
    )
  );

  IF
    p_normalized_domain IS NULL OR
    v_lead_domain IS DISTINCT FROM lower(p_normalized_domain)
  THEN
    RETURN QUERY
      SELECT NULL::text, false, 'ineligible_lead'::text;
    RETURN;
  END IF;

  SELECT analysis_reports.token
    INTO v_existing_token
    FROM public.analysis_reports
   WHERE analysis_reports.lead_id = p_lead_id
   ORDER BY analysis_reports.created_at DESC
   LIMIT 1;

  IF v_existing_token IS NOT NULL THEN
    RETURN QUERY
      SELECT v_existing_token, true, NULL::text;
    RETURN;
  END IF;

  IF
    v_lead_created_at IS NULL OR
    v_lead_created_at < now() - interval '15 minutes' OR
    v_lead_created_at > now() + interval '1 minute'
  THEN
    RETURN QUERY
      SELECT NULL::text, false, 'ineligible_lead'::text;
    RETURN;
  END IF;

  SELECT count(*)::integer
    INTO v_global_count
    FROM public.rate_limits
   WHERE scope = 'legacy_scanner'
     AND created_at >= now() - interval '1 hour';

  IF v_global_count >= greatest(coalesce(p_global_limit, 1), 1) THEN
    RETURN QUERY
      SELECT NULL::text, false, 'global_hourly_exceeded'::text;
    RETURN;
  END IF;

  SELECT count(*)::integer
    INTO v_ip_count
    FROM public.rate_limits
   WHERE scope = 'legacy_scanner'
     AND ip_hash = p_ip_hash
     AND created_at >= now() - interval '1 hour';

  IF v_ip_count >= greatest(coalesce(p_per_ip_limit, 1), 1) THEN
    RETURN QUERY
      SELECT NULL::text, false, 'per_ip_hourly_exceeded'::text;
    RETURN;
  END IF;

  INSERT INTO public.rate_limits (ip_hash, scope)
  VALUES (p_ip_hash, 'legacy_scanner');

  v_scan_token := gen_random_uuid()::text;

  INSERT INTO public.analysis_reports (
    token,
    site_name,
    lead_id,
    scan_status,
    language,
    checks_passed,
    checks_total,
    scan_version,
    data_sources_used
  )
  VALUES (
    v_scan_token,
    p_site_name,
    p_lead_id,
    'collecting',
    CASE WHEN p_language = 'en' THEN 'en' ELSE 'de' END,
    0,
    3,
    'v1.0-evidence',
    '{}'::text[]
  );

  RETURN QUERY
    SELECT v_scan_token, false, NULL::text;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_legacy_analysis_scan(
  uuid, text, text, text, text, integer, integer
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_legacy_analysis_scan(
  uuid, text, text, text, text, integer, integer
) TO service_role;

COMMIT;
