import assert from "node:assert/strict";
import { test } from "node:test";
import { importPublicScrape } from "../scripts/import-public-scrape.mjs";
import { renderBriefHtml } from "../scripts/generate-opportunity-brief.mjs";
const fixture = () => ({
  success: true,
  metadata: { sourceURL: "https://example.ch/", statusCode: 200, title: "Catering für Schweizer Firmen" },
  markdown: "# Catering für Firmen\nFoodtruck und Foodboxen für Meetings.\nAnfrage per E-Mail vorbereiten. Öffnet Ihr E-Mail-Programm mit vorbereiteter Anfrage. Bitte senden Sie die E-Mail selbst.\nKontakt und Angebote.",
  links: ["mailto:hello@example.ch"]
});
const opt = { companyName: "Demo GmbH", vertical: "Gastronomie",
  expectedUrl: "https://example.ch/", observedAt: "2026-10-24T10:00:00Z" };
test("public contact journey imports as verified source, internal workflows remain inferred", () => {
  const x = importPublicScrape(fixture(), opt);
  assert(x.findings.some(f => f.claim.includes("E-Mail vorbereitet") && f.evidence_status === "VERIFIED"));
  assert(x.opportunities.every(o => o.evidence_status === "INFERRED"));
  assert.equal(x.scenario_inputs.hours_per_month, null);
  assert.equal(x.case_study.state, "UNAVAILABLE");
  assert.equal(x.review.claims_approved, false);
  assert.match(renderBriefHtml(x), /ENTWURF/);
  assert.match(renderBriefHtml(x), /keine Stundenersparnis, CHF-Potenziale/);
});
test("reject HTTP errors and missing content", () => {
  const f = fixture(); f.metadata.statusCode = 403;
  assert.throws(() => importPublicScrape(f, opt), /HTTP 2xx/);
  f.metadata.statusCode = 200; f.markdown = "  ";
  assert.throws(() => importPublicScrape(f, opt), /Missing substantive/);
});
test("rejects IP, localhost, embedded credentials and mismatched public domains", () => {
  for (const url of ["http://127.0.0.1/", "http://192.168.1.2/", "http://localhost/",
    "https://john:secret@example.ch/", "file:///etc/passwd"]) {
    const f = fixture(); f.metadata.sourceURL = url;
    assert.throws(() => importPublicScrape(f, { ...opt, expectedUrl: null }), /non-public/);
  }
  const f = fixture(); f.metadata.sourceURL = "https://different.ch/";
  assert.throws(() => importPublicScrape(f, opt), /does not match/);
});
test("supports nested Firecrawl v2 scrape shape", () => {
  const x = fixture();
  const nested = { success: true, data: { metadata: x.metadata, markdown: x.markdown, links: x.links } };
  assert.equal(importPublicScrape(nested, opt).sources.length, 1);
});
test("will not invent internal CRM, time savings or published case studies", () => {
  const r = importPublicScrape(fixture(), opt);
  assert(!r.findings.some(f => /kein CRM|verloren|gespart|automatisiert/i.test(f.claim)));
  assert(r.opportunities.every(o => o.business_value.includes("nicht gemessen")));
});
test("sanitizes observed title before HTML rendering", () => {
  const f = fixture(); f.metadata.title = "<img src=x onerror=alert(1)>";
  assert(!renderBriefHtml(importPublicScrape(f, opt)).includes("<img src=x"));
});
