import { isValidEmail, normalizeDomain } from "./audit-utils.ts";

export const CURRENT_CONSENT_VERSION = "2026-07-25";
export const LEGACY_CONTEXT_MARKER = "not_collected_legacy_v0";

const AUDIT_TYPES = new Set([
  "business",
  "website",
  "seo",
  "ai-visibility",
  "automation",
]);

export function contractText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}

export function contractStringList(
  value: unknown,
  maxItems = 8,
  maxLength = 120,
): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

export interface ResolvedAuditContext {
  contract: "current_v1" | "legacy_v0";
  companyName: string;
  industry: string;
  region: string;
  primaryGoal: string;
  primaryLeadSource: string;
  challenges: string[];
  systems: string | null;
  auditType: string;
}

function hasMeaningfulCurrentAuditField(
  body: Record<string, unknown>,
): boolean {
  if (contractText(body.audit_type, 40)) return true;
  if (contractText(body.systems, 500)) return true;
  return Array.isArray(body.challenges) && body.challenges.length > 0;
}

export function resolveAuditContext(
  body: Record<string, unknown>,
):
  | { ok: true; context: ResolvedAuditContext }
  | { ok: false; code: "business_context_required" } {
  const companyName = contractText(body.company_name, 160);
  const industry = contractText(body.industry, 120);
  const region = contractText(body.region, 120);
  const primaryGoal = contractText(body.primary_goal, 160);
  const primaryLeadSource = contractText(body.primary_lead_source, 120);
  const requestedAuditType = contractText(body.audit_type, 40);
  const required = [
    companyName,
    industry,
    region,
    primaryGoal,
    primaryLeadSource,
  ];
  const presentCount = required.filter(Boolean).length;

  if (presentCount === required.length) {
    return {
      ok: true,
      context: {
        contract: "current_v1",
        companyName: companyName!,
        industry: industry!,
        region: region!,
        primaryGoal: primaryGoal!,
        primaryLeadSource: primaryLeadSource!,
        challenges: contractStringList(body.challenges),
        systems: contractText(body.systems, 500),
        auditType: requestedAuditType && AUDIT_TYPES.has(requestedAuditType)
          ? requestedAuditType
          : "business",
      },
    };
  }

  // The old public form collected none of the business-context fields and sent
  // none of the current-only audit fields. Accept only that legacy-shaped
  // contract during the cutover; a broken current form must not be relabelled
  // as legacy and filled with marker values.
  if (presentCount === 0 && !hasMeaningfulCurrentAuditField(body)) {
    return {
      ok: true,
      context: {
        contract: "legacy_v0",
        companyName: LEGACY_CONTEXT_MARKER,
        industry: LEGACY_CONTEXT_MARKER,
        region: LEGACY_CONTEXT_MARKER,
        primaryGoal: LEGACY_CONTEXT_MARKER,
        primaryLeadSource: LEGACY_CONTEXT_MARKER,
        challenges: [],
        systems: null,
        auditType: "website",
      },
    };
  }

  return { ok: false, code: "business_context_required" };
}

export type PublicLeadType =
  | "free_audit"
  | "free_call"
  | "contact"
  | "partner_application";
export type StoredLeadType =
  | "free_audit"
  | "free_call"
  | "contact"
  | "partner";

export interface SanitizedLead {
  contract: "current_v1" | "legacy_v0";
  language: "de" | "en";
  publicLeadType: PublicLeadType;
  storedLeadType: StoredLeadType;
  name: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  websiteUrl: string | null;
  industry: string | null;
  serviceArea: string;
  region: string | null;
  primaryGoal: string | null;
  primaryLeadSource: string | null;
  systems: string | null;
  landingPage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  budgetRange: string | null;
  capacityRange: string | null;
  preferredTimes: string | null;
  consentProcessing: boolean;
  consentMarketing: boolean;
  consentVersion: string | null;
}

export function validateAndSanitizeLead(
  body: Record<string, unknown>,
):
  | { ok: true; lead: SanitizedLead }
  | { ok: false; language: "de" | "en"; errors: Record<string, string> } {
  const language = body.language === "en" ? "en" : "de";
  const isDE = language === "de";
  const errors: Record<string, string> = {};

  if (body.language !== "de" && body.language !== "en") {
    errors.language = isDE ? "Ungültige Sprache." : "Invalid language.";
  }

  const publicLeadType = typeof body.lead_type === "string" &&
      ["free_audit", "free_call", "contact", "partner_application"].includes(
        body.lead_type,
      )
    ? body.lead_type as PublicLeadType
    : null;
  if (!publicLeadType) {
    errors.lead_type = isDE
      ? "Dieser Anfrage-Typ wird nicht unterstützt."
      : "This enquiry type is not supported.";
  }

  const legacy = publicLeadType === "free_audit" ||
    publicLeadType === "free_call";
  const name = contractText(body.name, 120);
  const companyName = contractText(body.company_name, 160);
  const email = contractText(body.email, 254)?.toLowerCase() ?? null;
  const message = contractText(body.message, 4_000);
  const industry = contractText(body.industry, 120);
  const explicitServiceArea = contractText(body.service_area, 120);
  const budgetRange = contractText(body.budget_range, 120);
  const capacityRange = contractText(body.capacity_range, 120);
  const consentProcessing = body.consent_processing === true;

  if (!name || name.length < 2) {
    errors.name = legacy
      ? (isDE ? "Bitte ausfüllen." : "Please fill this in.")
      : (isDE ? "Bitte geben Sie Ihren Namen ein." : "Please enter your name.");
  }
  if (!email || !isValidEmail(email)) {
    errors.email = legacy
      ? (isDE
        ? "Bitte prüfen Sie Ihre E-Mail-Adresse."
        : "Please check your email.")
      : (isDE
        ? "Bitte geben Sie eine gültige E-Mail-Adresse ein."
        : "Please enter a valid email address.");
  }

  if (legacy) {
    if (!industry) {
      errors.industry = isDE ? "Bitte ausfüllen." : "Please fill this in.";
    }
    if (!explicitServiceArea) {
      errors.service_area = isDE ? "Bitte ausfüllen." : "Please fill this in.";
    }
    if (publicLeadType === "free_audit") {
      if (!contractText(body.website_url, 500)) {
        errors.website_url = isDE ? "Bitte ausfüllen." : "Please fill this in.";
      }
      if (!budgetRange) {
        errors.budget_range = isDE ? "Bitte ausfüllen." : "Please fill this in.";
      }
      if (!capacityRange) {
        errors.capacity_range = isDE ? "Bitte ausfüllen." : "Please fill this in.";
      }
    }
  } else {
    if (!companyName || companyName.length < 2) {
      errors.company_name = isDE
        ? "Bitte geben Sie den Firmennamen ein."
        : "Please enter the company name.";
    }
    if (!message || message.length < 10) {
      errors.message = isDE
        ? "Bitte beschreiben Sie die Anfrage etwas genauer."
        : "Please add a little more context.";
    }
    if (!consentProcessing) {
      errors.consent_processing = isDE
        ? "Einwilligung zur Verarbeitung ist erforderlich."
        : "Processing consent is required.";
    }
  }

  let websiteUrl: string | null = null;
  const websiteInput = contractText(body.website_url, 500);
  if (websiteInput) {
    const normalized = normalizeDomain(websiteInput);
    if ("error" in normalized) {
      errors.website_url = isDE
        ? "Bitte geben Sie eine gültige öffentliche Website-URL ein."
        : "Please enter a valid public website URL.";
    } else {
      websiteUrl = normalized.url;
    }
  }

  if (
    !publicLeadType ||
    !name ||
    !email ||
    Object.keys(errors).length > 0
  ) {
    return { ok: false, language, errors };
  }

  const serviceArea = explicitServiceArea ??
    (publicLeadType === "partner_application"
      ? "partner_application"
      : "contact");
  const storedLeadType: StoredLeadType =
    publicLeadType === "partner_application" ? "partner" : publicLeadType;

  return {
    ok: true,
    lead: {
      contract: legacy ? "legacy_v0" : "current_v1",
      language,
      publicLeadType,
      storedLeadType,
      name,
      companyName,
      email,
      phone: contractText(body.phone, 60),
      message,
      websiteUrl,
      industry,
      serviceArea,
      region: contractText(body.region, 120),
      primaryGoal: contractText(body.primary_goal, 160),
      primaryLeadSource: contractText(body.primary_lead_source, 120),
      systems: contractText(body.systems, 500),
      landingPage: contractText(body.landing_page, 500),
      referrer: contractText(body.referrer, 1_000),
      utmSource: contractText(body.utm_source, 200),
      utmMedium: contractText(body.utm_medium, 200),
      utmCampaign: contractText(body.utm_campaign, 300),
      utmTerm: contractText(body.utm_term, 300),
      utmContent: contractText(body.utm_content, 300),
      gclid: contractText(body.gclid, 300),
      budgetRange,
      capacityRange,
      preferredTimes: contractText(body.preferred_times, 500),
      consentProcessing,
      consentMarketing: body.consent_marketing === true,
      consentVersion: consentProcessing ? CURRENT_CONSENT_VERSION : null,
    },
  };
}

export interface TransitionalAuthConfig {
  serviceKey: string | undefined;
  publicKeys: Array<string | undefined>;
  legacyPublicEnabled: boolean;
}

export function leadSuccessPayload(
  contract: SanitizedLead["contract"],
  leadId: string,
): { success: true; lead_id?: string } {
  return contract === "legacy_v0"
    ? { success: true, lead_id: leadId }
    : { success: true };
}

export function acceptsTransitionalInternalAuth(
  authorization: string | null,
  apiKey: string | null,
  config: TransitionalAuthConfig,
): boolean {
  return resolveTransitionalAuthMode(authorization, apiKey, config) !== null;
}

export type TransitionalAuthMode = "service" | "legacy_public";

export function resolveTransitionalAuthMode(
  authorization: string | null,
  apiKey: string | null,
  config: TransitionalAuthConfig,
): TransitionalAuthMode | null {
  if (
    config.serviceKey &&
    authorization === `Bearer ${config.serviceKey}`
  ) {
    return "service";
  }

  if (!config.legacyPublicEnabled) return null;
  const publicKeys = config.publicKeys.filter(
    (key): key is string => Boolean(key),
  );
  const publicMatch = publicKeys.some((key) =>
    apiKey === key || authorization === `Bearer ${key}`
  );
  return publicMatch ? "legacy_public" : null;
}
