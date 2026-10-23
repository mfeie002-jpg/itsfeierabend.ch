// deno-lint-ignore-file no-import-prefix
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import {
  clientIp,
  corsHeaders,
  hashIp,
  isValidEmail,
  normalizeDomain,
  verifyTurnstile,
} from "../_shared/audit-utils.ts";
import { LIMITS } from "../_shared/audit-limits.ts";
import {
  CURRENT_CONSENT_VERSION,
  resolveAuditContext,
} from "../_shared/public-contracts.ts";

declare const EdgeRuntime:
  | { waitUntil: (promise: Promise<unknown>) => void }
  | undefined;

const MAX_BODY_BYTES = 30_000;

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}

async function readJsonBody(req: Request): Promise<
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: number; code: string }
> {
  if (!req.body) return { ok: false, status: 400, code: "invalid_json" };
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      try {
        await reader.cancel();
      } catch {
        // Connection cleanup is best effort.
      }
      return { ok: false, status: 413, code: "request_too_large" };
    }
    chunks.push(value);
  }

  const buffer = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(buffer));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, status: 400, code: "invalid_json_object" };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, code: "invalid_json" };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!(req.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return json({ error: "unsupported_media_type", code: "unsupported_media_type" }, 415);
  }

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: "request_too_large", code: "request_too_large" }, 413);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);
  const ip = clientIp(req);
  const ipHash = await hashIp(ip);
  if (!ipHash) {
    console.error("Audit client IP or IP_HASH_SALT unavailable");
    return json({ error: "Audit vorübergehend nicht verfügbar.", code: "rate_limit_unavailable" }, 503);
  }
  const userAgent = text(req.headers.get("user-agent"), 500);

  const logEvent = (eventType: string, metadata: Record<string, unknown>) =>
    supabase.from("audit_events").insert({
      audit_id: null,
      event_type: eventType,
      metadata,
      ip_hash: ipHash,
      user_agent: userAgent,
    }).then(() => {}, (error) => console.error("event log failed:", error));

  try {
    const parsedBody = await readJsonBody(req);
    if (!parsedBody.ok) {
      return json({ error: parsedBody.code, code: parsedBody.code }, parsedBody.status);
    }
    const body = parsedBody.body;
    if (text(body?.honeypot, 200)) {
      await logEvent("bot_check_failed", { reason: "honeypot" });
      return json({ error: "invalid_request", code: "bot_check_failed" }, 400);
    }

    const websiteUrl = text(body?.website_url, 500);
    const firstName = text(body?.first_name, 80);
    const lastName = text(body?.last_name, 80);
    const email = text(body?.email, 255)?.toLowerCase() || null;
    const language = body?.language === "en" ? "en" : "de";
    const consentProcessing = body?.consent_processing === true;
    const consentMarketing = body?.consent_marketing === true;
    const consentVersion = CURRENT_CONSENT_VERSION;
    const consentAt = new Date().toISOString();

    const attribution = {
      landing_page: text(body?.landing_page, 500),
      referrer: text(body?.referrer, 1000),
      utm_source: text(body?.utm_source, 200),
      utm_medium: text(body?.utm_medium, 200),
      utm_campaign: text(body?.utm_campaign, 300),
      utm_term: text(body?.utm_term, 300),
      utm_content: text(body?.utm_content, 300),
      gclid: text(body?.gclid, 300),
    };

    const botVerdict = await verifyTurnstile(body?.turnstile_token, ip);
    if (!botVerdict.ok) {
      await logEvent("bot_check_failed", { reason: botVerdict.reason });
      return json({ error: "Bot-Check fehlgeschlagen.", code: "bot_check_failed" }, 400);
    }

    if (!consentProcessing) {
      return json({ error: "Consent für Verarbeitung ist erforderlich.", code: "consent_required" }, 400);
    }
    const contextResolution = resolveAuditContext(body);
    if (!contextResolution.ok) {
      return json({ error: "Geschäftskontext unvollständig.", code: "business_context_required" }, 400);
    }
    const {
      companyName,
      industry,
      region,
      primaryGoal,
      primaryLeadSource,
      challenges,
      systems,
      auditType,
    } = contextResolution.context;
    if (!firstName || firstName.length < 2) {
      return json({ error: "Ungültiger Vorname.", code: "invalid_first_name" }, 400);
    }
    if (!lastName || lastName.length < 2) {
      return json({ error: "Ungültiger Nachname.", code: "invalid_last_name" }, 400);
    }
    if (!email || !isValidEmail(email)) {
      return json({ error: "Ungültige E-Mail-Adresse.", code: "invalid_email" }, 400);
    }

    const normalized = normalizeDomain(websiteUrl);
    if ("error" in normalized) {
      await logEvent("url_rejected", {
        reason: normalized.error,
        input_length: websiteUrl?.length || 0,
      });
      return json({ error: "Ungültige oder nicht erlaubte Website-URL.", code: `url_${normalized.error}` }, 400);
    }

    // The database function performs lead de-duplication, lead + audit
    // creation, limit enforcement, counter writes and the submitted event in
    // one transaction. Every request still receives a fresh private token.
    const { data: creationRows, error: creationError } = await supabase.rpc(
      "create_audit_with_lead",
      {
        p_website_url: normalized.url,
        p_normalized_domain: normalized.domain,
        p_first_name: firstName,
        p_last_name: lastName,
        p_email: email,
        p_language: language,
        p_company_name: companyName,
        p_industry: industry,
        p_region: region,
        p_primary_goal: primaryGoal,
        p_primary_lead_source: primaryLeadSource,
        p_challenges: challenges,
        p_systems: systems,
        p_audit_type: auditType,
        p_landing_page: attribution.landing_page,
        p_referrer: attribution.referrer,
        p_utm_source: attribution.utm_source,
        p_utm_medium: attribution.utm_medium,
        p_utm_campaign: attribution.utm_campaign,
        p_utm_term: attribution.utm_term,
        p_utm_content: attribution.utm_content,
        p_gclid: attribution.gclid,
        p_consent_marketing: consentMarketing,
        p_consent_at: consentAt,
        p_consent_version: consentVersion,
        p_ip_hash: ipHash,
        p_user_agent: userAgent,
        p_per_ip_limit: LIMITS.perIpDaily,
        p_global_limit: LIMITS.globalDaily,
      },
    );

    const creation = Array.isArray(creationRows) ? creationRows[0] : null;
    if (creation?.limit_reason) {
      await logEvent("rate_limited", { reason: creation.limit_reason });
      return json({
        error: creation.limit_reason === "per_ip_daily_exceeded"
          ? "Tageslimit für diese Verbindung erreicht."
          : "Der Audit ist heute ausgelastet.",
        code: creation.limit_reason,
      }, 429);
    }
    if (
      creationError ||
      !creation?.audit_id ||
      !creation?.audit_token
    ) {
      console.error("atomic audit creation failed:", creationError);
      return json({
        error: "Audit konnte nicht gespeichert werden.",
        code: "audit_db_error",
      }, 500);
    }

    const audit = {
      id: creation.audit_id as string,
      token: creation.audit_token as string,
    };

    // Internal call. The target function independently validates the service
    // bearer before doing any expensive work.
    const generation = fetch(`${supabaseUrl}/functions/v1/generate-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ audit_id: audit.id }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`generate-report returned ${response.status}`);
      }
    }).catch(async (error) => {
      console.error("generate-report kick failed:", error);
      await Promise.all([
        supabase
          .from("audit_requests")
          .update({
            status: "failed",
            error: "report_generation_unavailable",
          })
          .eq("id", audit.id),
        supabase.from("audit_events").insert({
          audit_id: audit.id,
          event_type: "failed",
          metadata: { stage: "generation_kick" },
          ip_hash: ipHash,
          user_agent: userAgent,
        }),
      ]);
    });

    if (typeof EdgeRuntime !== "undefined" && typeof EdgeRuntime.waitUntil === "function") {
      EdgeRuntime.waitUntil(generation);
    } else {
      await generation;
    }

    return json({
      success: true,
      token: audit.token,
      redirect_path: language === "en"
        ? `/en/audit/r/${audit.token}`
        : `/audit/r/${audit.token}`,
    });
  } catch (error) {
    console.error("create-audit error:", error);
    return json({ error: "Interner Fehler.", code: "server_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
