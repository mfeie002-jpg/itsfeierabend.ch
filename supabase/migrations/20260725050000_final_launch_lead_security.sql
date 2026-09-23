BEGIN;

-- Canonical CRM fields for itsfeierabend.ch. This migration is additive apart
-- from removing unsafe anonymous read policies.
ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_lead_type_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_lead_type_check
  CHECK (lead_type IN ('free_audit', 'free_call', 'contact', 'partner'));

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS primary_goal text,
  ADD COLUMN IF NOT EXISTS primary_lead_source text,
  ADD COLUMN IF NOT EXISTS challenges text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS systems text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS audit_type text,
  ADD COLUMN IF NOT EXISTS keyword text,
  ADD COLUMN IF NOT EXISTS lead_score integer,
  ADD COLUMN IF NOT EXISTS consent_processing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_marketing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS consent_version text;

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_lead_score_range;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_lead_score_range
  CHECK (lead_score IS NULL OR (lead_score >= 0 AND lead_score <= 100));

ALTER TABLE public.audit_requests
  ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS primary_goal text,
  ADD COLUMN IF NOT EXISTS primary_lead_source text,
  ADD COLUMN IF NOT EXISTS challenges text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS systems text,
  ADD COLUMN IF NOT EXISTS audit_type text NOT NULL DEFAULT 'business',
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS gclid text,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS consent_version text,
  ADD COLUMN IF NOT EXISTS email_provider_id text;

CREATE INDEX IF NOT EXISTS audit_requests_lead_id_idx
  ON public.audit_requests (lead_id);

CREATE INDEX IF NOT EXISTS leads_landing_page_idx
  ON public.leads (landing_page);

-- Old token-header policies exposed full rows including contact and raw report
-- data. Public report access must go through minimal-projection Edge Functions.
DROP POLICY IF EXISTS "Public can view leads by token"
  ON public.leads;
DROP POLICY IF EXISTS "Public can view reports by token"
  ON public.analysis_reports;
DROP POLICY IF EXISTS "Public can read scan status by token"
  ON public.analysis_reports;

REVOKE SELECT ON TABLE public.leads FROM anon;
REVOKE SELECT ON TABLE public.analysis_reports FROM anon;

-- Signed-in admins need the new audit record to qualify and follow up the
-- canonical CRM lead. Anonymous visitors continue to use the minimal report
-- Edge Function projection and never receive direct table access.
GRANT SELECT ON TABLE public.audit_requests TO authenticated;

DROP POLICY IF EXISTS "Admins can view audit requests"
  ON public.audit_requests;
CREATE POLICY "Admins can view audit requests"
  ON public.audit_requests
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.audit_events
  DROP CONSTRAINT IF EXISTS audit_events_type_check;

ALTER TABLE public.audit_events
  ADD CONSTRAINT audit_events_type_check
  CHECK (event_type = ANY (ARRAY[
    'submitted','fetch_started','fetch_complete','scoring_complete',
    'report_ready','report_viewed','cta_clicked','email_sent','email_failed',
    'email_skipped','failed','bot_check_failed','rate_limited',
    'domain_throttled','url_rejected','ssrf_blocked'
  ]));

COMMIT;
