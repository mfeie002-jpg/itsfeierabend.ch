// deno-lint-ignore-file no-import-prefix
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import {
  clientIp,
  corsHeaders as sharedCorsHeaders,
  hashIp,
} from "../_shared/audit-utils.ts";
import {
  contractText,
  leadSuccessPayload,
  type PublicLeadType,
  validateAndSanitizeLead,
} from "../_shared/public-contracts.ts";

declare const EdgeRuntime:
  | { waitUntil: (promise: Promise<unknown>) => void }
  | undefined;

const MAX_BODY_BYTES = 30_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const DUPLICATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const RATE_LIMIT_SCOPE = "lead_form";

const corsHeaders = {
  ...sharedCorsHeaders,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface NotificationLead {
  publicLeadType: PublicLeadType;
  isDuplicate: boolean;
}

type JsonReadResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: number; code: string };

function json(
  payload: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

async function readJsonBody(req: Request): Promise<JsonReadResult> {
  const rawLength = req.headers.get("content-length");
  if (rawLength !== null) {
    const declaredLength = Number(rawLength);
    if (!Number.isInteger(declaredLength) || declaredLength < 0) {
      return { ok: false, status: 400, code: "invalid_content_length" };
    }
    if (declaredLength > MAX_BODY_BYTES) {
      return { ok: false, status: 413, code: "request_too_large" };
    }
  }

  if (!req.body) return { ok: false, status: 400, code: "invalid_json" };

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let raw = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel("request_too_large");
        return { ok: false, status: 413, code: "request_too_large" };
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch {
    return { ok: false, status: 400, code: "invalid_body" };
  } finally {
    reader.releaseLock();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, status: 400, code: "invalid_json_object" };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, code: "invalid_json" };
  }
}

async function sendSlackNotification(
  lead: NotificationLead,
  adminUrl: string,
): Promise<void> {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!webhookUrl) {
    console.log(
      "Slack notification disabled: SLACK_WEBHOOK_URL is not configured",
    );
    return;
  }

  const typeLabel = {
    free_audit: "📊 Legacy-Audit",
    free_call: "📞 Legacy-Call",
    contact: "✉️ Kontaktanfrage",
    partner_application: "🤝 Partneranfrage",
  }[lead.publicLeadType];
  const duplicateLabel = lead.isDuplicate ? " · mögliches Duplikat" : "";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${typeLabel}${duplicateLabel} · neuer Datensatz im geschützten Admin`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: [
                `*Neue ${typeLabel}*${duplicateLabel}`,
                "Kontaktdaten und Geschäftskontext bleiben im geschützten itsFeierabend.ch-Admin.",
              ].join("\n"),
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Im Admin öffnen" },
                url: adminUrl,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`Slack notification failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Slack notification failed:",
      error instanceof Error ? error.message : "unknown_error",
    );
  }
}

function runAfterResponse(promise: Promise<unknown>): void {
  if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
    EdgeRuntime.waitUntil(promise);
    return;
  }
  void promise;
}

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(
      { error: "Method not allowed.", code: "method_not_allowed" },
      405,
      { Allow: "POST, OPTIONS" },
    );
  }

  const contentType = req.headers.get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return json(
      {
        error: "Content-Type must be application/json.",
        code: "unsupported_media_type",
      },
      415,
    );
  }

  const parsed = await readJsonBody(req);
  if (!parsed.ok) {
    return json({ error: parsed.code, code: parsed.code }, parsed.status);
  }

  const body = parsed.body;
  const honeypot = contractText(body.honeypot, 200);
  if (honeypot) {
    // Deliberately indistinguishable from a successful submission.
    return json({ success: true }, 200);
  }

  const validation = validateAndSanitizeLead(body);
  if (!validation.ok) {
    return json(
      {
        error: validation.language === "de"
          ? "Bitte prüfen Sie die markierten Felder."
          : "Please check the highlighted fields.",
        errors: validation.errors,
        code: "validation_error",
      },
      400,
    );
  }
  const leadInput = validation.lead;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("submit-lead configuration is incomplete");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "service_unavailable",
      },
      503,
    );
  }

  const ip = clientIp(req);
  const ipHash = await hashIp(ip);
  if (!ipHash) {
    console.error("submit-lead could not determine a client IP");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "client_ip_unavailable",
      },
      503,
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const rateLimitSince = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)
    .toISOString();
  const { count: recentSubmissions, error: rateLimitReadError } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("scope", RATE_LIMIT_SCOPE)
    .eq("ip_hash", ipHash)
    .gte("created_at", rateLimitSince);

  if (rateLimitReadError) {
    console.error("submit-lead rate-limit check failed");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "rate_limit_unavailable",
      },
      503,
    );
  }
  if ((recentSubmissions ?? 0) >= RATE_LIMIT_MAX) {
    return json(
      {
        error: leadInput.language === "de"
          ? "Zu viele Versuche. Bitte warten Sie kurz."
          : "Too many attempts. Please wait a moment.",
        code: "rate_limit",
      },
      429,
      { "Retry-After": String(RATE_LIMIT_WINDOW_MS / 1_000) },
    );
  }

  const { error: rateLimitWriteError } = await supabase
    .from("rate_limits")
    .insert({ ip_hash: ipHash, scope: RATE_LIMIT_SCOPE });
  if (rateLimitWriteError) {
    console.error("submit-lead rate-limit record failed");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "rate_limit_unavailable",
      },
      503,
    );
  }

  const duplicateSince = new Date(Date.now() - DUPLICATE_WINDOW_MS)
    .toISOString();
  const { data: existingLead, error: duplicateReadError } = await supabase
    .from("leads")
    .select("id")
    .eq("email", leadInput.email)
    .eq("lead_type", leadInput.storedLeadType)
    .gte("created_at", duplicateSince)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (duplicateReadError) {
    console.error("submit-lead duplicate check failed");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "duplicate_check_unavailable",
      },
      503,
    );
  }

  const isDuplicate = Boolean(existingLead?.id);
  const duplicateOf = existingLead?.id ?? null;
  const consentAt = leadInput.consentProcessing
    ? new Date().toISOString()
    : null;
  const userAgent = contractText(req.headers.get("user-agent"), 500);

  const { data: insertedLead, error: insertError } = await supabase
    .from("leads")
    .insert({
      language: leadInput.language,
      lead_type: leadInput.storedLeadType,
      industry: leadInput.industry ?? "not_specified",
      service_area: leadInput.serviceArea,
      website_url: leadInput.websiteUrl,
      budget_range: leadInput.budgetRange,
      capacity_range: leadInput.capacityRange,
      name: leadInput.name,
      email: leadInput.email,
      phone: leadInput.phone,
      message: leadInput.message,
      preferred_times: leadInput.preferredTimes,
      utm_source: leadInput.utmSource,
      utm_medium: leadInput.utmMedium,
      utm_campaign: leadInput.utmCampaign,
      utm_term: leadInput.utmTerm,
      utm_content: leadInput.utmContent,
      gclid: leadInput.gclid,
      referrer: leadInput.referrer,
      user_agent: userAgent,
      ip_hash: ipHash,
      company_name: leadInput.companyName,
      region: leadInput.region,
      primary_goal: leadInput.primaryGoal,
      primary_lead_source: leadInput.primaryLeadSource,
      challenges: [],
      systems: leadInput.systems,
      landing_page: leadInput.landingPage,
      audit_type: null,
      keyword: leadInput.utmTerm,
      lead_score: null,
      consent_processing: leadInput.consentProcessing,
      consent_marketing: leadInput.consentMarketing,
      consent_at: consentAt,
      consent_version: leadInput.consentVersion,
      public_token: null,
      pre_score_total: null,
      pre_score_bucket: null,
      is_duplicate: isDuplicate,
      duplicate_of: duplicateOf,
    })
    .select("id")
    .single();

  if (insertError || !insertedLead?.id) {
    console.error("submit-lead insert failed");
    return json(
      {
        error: leadInput.language === "de"
          ? "Die Anfrage konnte nicht gespeichert werden."
          : "The enquiry could not be saved.",
        code: "lead_db_error",
      },
      500,
    );
  }

  const adminUrl = "https://itsfeierabend.ch/admin/leads";
  runAfterResponse(sendSlackNotification({
    publicLeadType: leadInput.publicLeadType,
    isDuplicate,
  }, adminUrl));

  const cleanupBefore = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  runAfterResponse(
    Promise.resolve(
      supabase
        .from("rate_limits")
        .delete()
        .eq("scope", RATE_LIMIT_SCOPE)
        .lt("created_at", cleanupBefore),
    )
      .then(({ error }) => {
        if (error) console.error("submit-lead rate-limit cleanup failed");
      })
      .catch(() => {
        console.error("submit-lead rate-limit cleanup failed");
      }),
  );

  // The live legacy hook reads `lead_id` and maps it to its internal `leadId`
  // before starting business-scanner. Current contracts deliberately receive
  // no row identifier or duplicate signal.
  return json(leadSuccessPayload(leadInput.contract, insertedLead.id));
}

serve(async (req: Request): Promise<Response> => {
  try {
    return await handleRequest(req);
  } catch (error) {
    console.error(
      "submit-lead unexpected failure:",
      error instanceof Error ? error.message : "unknown_error",
    );
    return json(
      { error: "Service temporarily unavailable.", code: "server_error" },
      500,
    );
  }
});
