import {
  acceptsTransitionalInternalAuth,
  leadSuccessPayload,
  LEGACY_CONTEXT_MARKER,
  resolveAuditContext,
  resolveTransitionalAuthMode,
  validateAndSanitizeLead,
} from "./public-contracts.ts";

function assert(
  condition: unknown,
  message = "Assertion failed",
): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEquals<T>(
  actual: T,
  expected: T,
  message = "Values differ",
): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(
      `${message}\nExpected: ${expectedJson}\nActual:   ${actualJson}`,
    );
  }
}

Deno.test("resolveAuditContext preserves a complete current payload", () => {
  const resolved = resolveAuditContext({
    company_name: "Beispiel AG",
    industry: "Treuhand",
    region: "Zürich",
    primary_goal: "Mehr qualifizierte Anfragen",
    primary_lead_source: "Empfehlungen",
    challenges: ["Messbarkeit", "Follow-up"],
    systems: "HubSpot",
    audit_type: "automation",
  });

  assert(resolved.ok);
  assertEquals(resolved.context, {
    contract: "current_v1",
    companyName: "Beispiel AG",
    industry: "Treuhand",
    region: "Zürich",
    primaryGoal: "Mehr qualifizierte Anfragen",
    primaryLeadSource: "Empfehlungen",
    challenges: ["Messbarkeit", "Follow-up"],
    systems: "HubSpot",
    auditType: "automation",
  });
});

Deno.test("resolveAuditContext marks the exact legacy audit payload without guesses", () => {
  const resolved = resolveAuditContext({
    website_url: "https://example.ch",
    first_name: "Max",
    last_name: "Muster",
    email: "max@example.ch",
    consent_processing: true,
  });

  assert(resolved.ok);
  assertEquals(resolved.context, {
    contract: "legacy_v0",
    companyName: LEGACY_CONTEXT_MARKER,
    industry: LEGACY_CONTEXT_MARKER,
    region: LEGACY_CONTEXT_MARKER,
    primaryGoal: LEGACY_CONTEXT_MARKER,
    primaryLeadSource: LEGACY_CONTEXT_MARKER,
    challenges: [],
    systems: null,
    auditType: "website",
  });
});

Deno.test("resolveAuditContext rejects partially supplied business context", () => {
  assertEquals(
    resolveAuditContext({
      company_name: "Beispiel AG",
      industry: "Treuhand",
    }),
    { ok: false, code: "business_context_required" },
  );
});

Deno.test("resolveAuditContext never relabels a broken current payload as legacy", () => {
  assertEquals(
    resolveAuditContext({
      audit_type: "business",
      challenges: [],
      systems: "",
    }),
    { ok: false, code: "business_context_required" },
  );
  assertEquals(
    resolveAuditContext({
      challenges: ["Messbarkeit"],
    }),
    { ok: false, code: "business_context_required" },
  );
});

Deno.test("current contact validation preserves explicit consent and strong fields", () => {
  const result = validateAndSanitizeLead({
    language: "de",
    lead_type: "contact",
    name: "Max Muster",
    company_name: "Beispiel AG",
    email: "MAX@EXAMPLE.CH",
    message: "Bitte melden Sie sich für ein Erstgespräch.",
    consent_processing: true,
    consent_marketing: true,
    website_url: "example.ch/kontakt?utm_source=test",
  });

  assert(result.ok);
  assertEquals(result.lead.contract, "current_v1");
  assertEquals(result.lead.storedLeadType, "contact");
  assertEquals(result.lead.email, "max@example.ch");
  assertEquals(result.lead.websiteUrl, "https://example.ch/kontakt");
  assertEquals(result.lead.consentProcessing, true);
  assertEquals(result.lead.consentMarketing, true);
  assertEquals(result.lead.consentVersion, "2026-07-25");
});

Deno.test("partner_application maps to partner without weakening validation", () => {
  const result = validateAndSanitizeLead({
    language: "en",
    lead_type: "partner_application",
    name: "Jane Example",
    company_name: "Example Ltd",
    email: "jane@example.ch",
    message: "We would like to discuss a referral partnership.",
    consent_processing: true,
  });

  assert(result.ok);
  assertEquals(result.lead.storedLeadType, "partner");
  assertEquals(result.lead.serviceArea, "partner_application");
});

Deno.test("current contact and partner contracts still require explicit consent", () => {
  const result = validateAndSanitizeLead({
    language: "de",
    lead_type: "contact",
    name: "Max Muster",
    company_name: "Beispiel AG",
    email: "max@example.ch",
    message: "Bitte melden Sie sich für ein Erstgespräch.",
  });

  assert(!result.ok);
  assertEquals(result.errors.consent_processing, "Einwilligung zur Verarbeitung ist erforderlich.");
});

Deno.test("legacy free_audit preserves ranges and records absent consent honestly", () => {
  const result = validateAndSanitizeLead({
    language: "de",
    lead_type: "free_audit",
    industry: "analysis_request",
    service_area: "website_analysis",
    website_url: "example.ch",
    budget_range: "not_specified",
    capacity_range: "not_specified",
    preferred_times: "Dienstagvormittag",
    name: "Max Muster",
    email: "max@example.ch",
    message: "Free website analysis requested for example.ch",
  });

  assert(result.ok);
  assertEquals(result.lead.contract, "legacy_v0");
  assertEquals(result.lead.storedLeadType, "free_audit");
  assertEquals(result.lead.budgetRange, "not_specified");
  assertEquals(result.lead.capacityRange, "not_specified");
  assertEquals(result.lead.preferredTimes, "Dienstagvormittag");
  assertEquals(result.lead.consentProcessing, false);
  assertEquals(result.lead.consentVersion, null);
  assertEquals(
    leadSuccessPayload(result.lead.contract, "legacy-row-id"),
    { success: true, lead_id: "legacy-row-id" },
  );
});

Deno.test("legacy free_audit retains its original required fields", () => {
  const result = validateAndSanitizeLead({
    language: "de",
    lead_type: "free_audit",
    industry: "analysis_request",
    service_area: "website_analysis",
    name: "Max Muster",
    email: "max@example.ch",
  });

  assert(!result.ok);
  assertEquals(Object.keys(result.errors).sort(), [
    "budget_range",
    "capacity_range",
    "website_url",
  ]);
});

Deno.test("legacy free_call remains accepted with the old minimum contract", () => {
  const result = validateAndSanitizeLead({
    language: "en",
    lead_type: "free_call",
    industry: "consulting",
    service_area: "switzerland",
    name: "Jane Example",
    email: "jane@example.ch",
    preferred_times: "Friday afternoon",
  });

  assert(result.ok);
  assertEquals(result.lead.contract, "legacy_v0");
  assertEquals(result.lead.storedLeadType, "free_call");
  assertEquals(result.lead.preferredTimes, "Friday afternoon");
  assertEquals(result.lead.consentProcessing, false);
  assertEquals(result.lead.consentVersion, null);
});

Deno.test("current success responses never expose a database row id", () => {
  assertEquals(
    leadSuccessPayload("current_v1", "private-row-id"),
    { success: true },
  );
});

Deno.test("transitional auth only permits exact configured bearers", () => {
  const config = {
    serviceKey: "service-secret",
    publicKeys: ["legacy-anon-key", "publishable-key"],
    legacyPublicEnabled: false,
  };

  assert(
    acceptsTransitionalInternalAuth(
      "Bearer service-secret",
      null,
      config,
    ),
    "Service bearer must remain accepted",
  );
  assert(
    !acceptsTransitionalInternalAuth(
      "Bearer legacy-anon-key",
      "legacy-anon-key",
      config,
    ),
    "Public bearer must fail while the cutover flag is disabled",
  );
  assert(
    acceptsTransitionalInternalAuth(
      "Bearer legacy-anon-key",
      "legacy-anon-key",
      {
        ...config,
        legacyPublicEnabled: true,
      },
    ),
    "Public bearer must work only during the explicit cutover window",
  );
  assert(
    acceptsTransitionalInternalAuth(
      "Bearer signed-in-user-jwt",
      "publishable-key",
      {
        ...config,
        legacyPublicEnabled: true,
      },
    ),
    "A signed-in session must remain compatible through its exact apikey",
  );
  assert(
    !acceptsTransitionalInternalAuth(
      "Bearer arbitrary",
      "arbitrary",
      {
        ...config,
        legacyPublicEnabled: true,
      },
    ),
  );
  assert(
    !acceptsTransitionalInternalAuth(
      null,
      null,
      {
        serviceKey: undefined,
        publicKeys: [],
        legacyPublicEnabled: true,
      },
    ),
  );
  assertEquals(
    resolveTransitionalAuthMode(
      "Bearer service-secret",
      "publishable-key",
      { ...config, legacyPublicEnabled: true },
    ),
    "service",
  );
  assertEquals(
    resolveTransitionalAuthMode(
      "Bearer signed-in-user-jwt",
      "publishable-key",
      { ...config, legacyPublicEnabled: true },
    ),
    "legacy_public",
  );
});
