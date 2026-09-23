// deno-lint-ignore-file no-import-prefix
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import {
  corsHeaders,
  normalizeDomain,
  isValidEmail,
  hashIp,
  clientIp,
  verifyTurnstile,
} from "../_shared/audit-utils.ts";
import { checkLimits, LIMITS } from "../_shared/audit-limits.ts";
import { CURRENT_CONSENT_VERSION } from "../_shared/public-contracts.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const ip = clientIp(req);
  const ipHash = await hashIp(ip);
  const userAgent = req.headers.get("user-agent") ?? null;

  if (!ipHash) {
    console.error("create-audit IP hashing is unavailable");
    return json({
      error: "Service temporarily unavailable.",
      code: "ip_hash_unavailable",
    }, 503);
  }

  const logEvent = (event_type: string, metadata: Record<string, unknown>) =>
    supabase.from("audit_events").insert({
      audit_id: null,
      event_type,
      metadata,
      ip_hash: ipHash,
      user_agent: userAgent,
    }).then(() => {}, (e) => console.error("event log failed:", e));

  try {
    const body = await req.json();
    const {
      website_url,
      first_name,
      last_name,
      email,
      language,
      consent_processing,
      consent_marketing,
      turnstile_token,
    } = body ?? {};

    // 1) Bot check first (cheap fail)
    const verdict = await verifyTurnstile(turnstile_token, ip);
    if (!verdict.ok) {
      await logEvent("bot_check_failed", { reason: verdict.reason });
      return json({ error: "Bot-Check fehlgeschlagen. Bitte lade die Seite neu.", code: "bot_check_failed" }, 400);
    }

    // 2) Field validation
    if (!consent_processing) {
      return json({ error: "Consent für Verarbeitung ist erforderlich.", code: "consent_required" }, 400);
    }
    if (!first_name || typeof first_name !== "string" || first_name.trim().length < 2 || first_name.length > 80) {
      return json({ error: "Ungültiger Vorname", code: "invalid_first_name" }, 400);
    }
    if (!last_name || typeof last_name !== "string" || last_name.trim().length < 2 || last_name.length > 80) {
      return json({ error: "Ungültiger Nachname", code: "invalid_last_name" }, 400);
    }
    if (!isValidEmail(email)) {
      return json({ error: "Ungültige E-Mail-Adresse", code: "invalid_email" }, 400);
    }
    const lang = language === "en" ? "en" : "de";

    // 3) URL validation (protocol, localhost, IP literal, malformed)
    const norm = normalizeDomain(website_url);
    if ("error" in norm) {
      await logEvent("url_rejected", { reason: norm.error, input: String(website_url).slice(0, 200) });
      const msgs: Record<string, string> = {
        empty: "Bitte eine Website-URL angeben.",
        malformed: "Ungültige URL.",
        unsupported_protocol: "Nur http und https werden unterstützt.",
        blocked_host: "Dieser Host ist nicht erlaubt.",
        ip_literal: "IP-Adressen sind nicht erlaubt — bitte Domain angeben.",
        invalid_host: "Ungültige Domain.",
      };
      return json({ error: msgs[norm.error] ?? "Ungültige URL", code: `url_${norm.error}` }, 400);
    }

    // 4) Cheap rate-limit preflight. The authoritative quota and domain
    // cooldown checks run again under the RPC transaction lock below.
    const limit = await checkLimits(supabase, { ipHash });
    if (!limit.ok) {
      await logEvent("rate_limited", { reason: limit.reason, domain: norm.domain });
      const msg = limit.reason === "per_ip_daily_exceeded"
        ? "Tageslimit für diese IP erreicht. Bitte morgen erneut versuchen."
        : "Wir sind heute stark ausgelastet — bitte morgen erneut versuchen.";
      return json({ error: msg, code: limit.reason }, 429);
    }

    // 5) Atomically create/reuse the CRM lead, audit request, submitted event,
    // and rate-limit hits. Keep the current AuditV0 form contract intact: the
    // newer business-context fields are optional until the UI collects them.
    const text = (value: unknown, max: number): string | null => {
      if (typeof value !== "string") return null;
      const cleaned = value.trim();
      return cleaned ? cleaned.slice(0, max) : null;
    };
    const { data: creationRows, error: creationError } = await supabase.rpc(
      "create_audit_with_lead",
      {
        p_website_url: norm.url,
        p_normalized_domain: norm.domain,
        p_first_name: first_name.trim(),
        p_last_name: last_name.trim(),
        p_email: email.trim().toLowerCase(),
        p_language: lang,
        p_company_name: text(body.company_name, 200),
        p_industry: text(body.industry, 120) ?? "analysis_request",
        p_region: text(body.region, 120),
        p_primary_goal: text(body.primary_goal, 160),
        p_primary_lead_source: text(body.primary_lead_source, 120),
        p_challenges: Array.isArray(body.challenges)
          ? body.challenges
            .filter((value: unknown): value is string => typeof value === "string")
            .map((value: string) => value.trim().slice(0, 200))
            .filter(Boolean)
            .slice(0, 20)
          : [],
        p_systems: text(body.systems, 500),
        p_audit_type: text(body.audit_type, 80) ?? "business",
        p_landing_page: text(body.landing_page, 500),
        p_referrer: text(body.referrer, 1000),
        p_utm_source: text(body.utm_source, 200),
        p_utm_medium: text(body.utm_medium, 200),
        p_utm_campaign: text(body.utm_campaign, 300),
        p_utm_term: text(body.utm_term, 300),
        p_utm_content: text(body.utm_content, 300),
        p_gclid: text(body.gclid, 300),
        p_consent_marketing: !!consent_marketing,
        p_consent_at: new Date().toISOString(),
        p_consent_version: CURRENT_CONSENT_VERSION,
        p_ip_hash: ipHash,
        p_user_agent: userAgent,
        p_domain_cooldown_days: LIMITS.domainCooldownDays,
        p_per_ip_limit: LIMITS.perIpDaily,
        p_global_limit: LIMITS.globalDaily,
      },
    );

    const creation = Array.isArray(creationRows) ? creationRows[0] : null;
    if (creation?.limit_reason) {
      const domainCooldown = creation.limit_reason === "domain_recently_audited";
      await logEvent(domainCooldown ? "domain_throttled" : "rate_limited", {
        reason: creation.limit_reason,
        domain: norm.domain,
      });
      if (domainCooldown) {
        return json({
          error: lang === "en"
            ? "A recent private report already exists for this domain. Please use the link sent to its requester."
            : "Für diese Domain existiert bereits ein privater Report. Bitte nutze den Link aus der ursprünglichen E-Mail.",
          code: creation.limit_reason,
        }, 409);
      }
      const msg = creation.limit_reason === "per_ip_daily_exceeded"
        ? "Tageslimit für diese IP erreicht. Bitte morgen erneut versuchen."
        : "Wir sind heute stark ausgelastet — bitte morgen erneut versuchen.";
      return json({ error: msg, code: creation.limit_reason }, 429);
    }
    if (creationError || !creation?.audit_id || !creation?.audit_token) {
      console.error("Atomic audit creation failed:", creationError);
      return json({ error: "Datenbankfehler", code: "db_error" }, 500);
    }

    const audit = {
      id: creation.audit_id as string,
      token: creation.audit_token as string,
    };

    // Kick off report generation (fire-and-forget).
    const projectUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    fetch(`${projectUrl}/functions/v1/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
      body: JSON.stringify({ audit_id: audit.id }),
    }).catch((e) => console.error("generate-report kick failed:", e));

    return json({
      success: true,
      token: audit.token,
      redirect_path: lang === "en" ? `/en/audit/r/${audit.token}` : `/audit/r/${audit.token}`,
    }, 200);
  } catch (e) {
    console.error("create-audit error:", e);
    return json({ error: "Interner Fehler", code: "server_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
