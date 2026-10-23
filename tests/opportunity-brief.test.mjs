import assert from "node:assert/strict";
import { test } from "node:test";
import { validateBrief, calculateIndicativeROI, renderBriefHtml } from "../scripts/generate-opportunity-brief.mjs";

const make = () => ({
  schema_version: "1.0.0", report_id: "EXAMPLE-NOT-REAL-0001",
  report_type: "external_opportunity_brief",
  subject: { name: "Synthetic Gastro GmbH", domain: "example.invalid",
    vertical: "Gastronomie", subvertical: "Catering", region: "CH",
    source_scope: "public_and_explicitly_authorized" },
  created_at: "2026-10-23T12:00:00Z",
  sources: [{ id: "SRC1", kind: "public_page", location: "https://example.invalid/menu",
    accessed_at: "2026-10-23T11:00:00Z", status: "AVAILABLE" }],
  findings: [{ id: "F1", claim: "Contact form publicly visible", evidence_status: "VERIFIED",
    source_ids: ["SRC1"], observed_at: "2026-10-23T11:00:00Z", limitations: "No internal data" }],
  opportunities: [{ id: "O1", rank: 1, title: "Catering inquiry triage",
    evidence_refs: ["SRC1"], evidence_status: "INFERRED", unknowns: ["Current volume"],
    current_state: "Unknown internal workflow", future_state: "Prepare inquiry draft",
    human_gates: ["Manager approval"], estimated_effort: null, risk: "MEDIUM",
    business_value: "Potentially fewer manual handoffs" }],
  case_study: { state: "UNAVAILABLE", reference: null, source_ids: [],
    publication_permission: false, measured_results: null },
  scenario_inputs: { hours_per_month: null, hourly_full_cost_chf: null,
    usable_capacity_fraction: null, monthly_incremental_margin_chf: null,
    monthly_run_cost_chf: null, implementation_cost_chf: null, assumption_notes: [] },
  review: { reviewed: false, reviewer: null, reviewed_at: null, claims_approved: false },
});
test("synthetic report remains a draft and never invents hours or ROI", () => {
  const output = renderBriefHtml(make());
  assert.match(output, /ENTWURF/);
  assert.match(output, /keine Stundenersparnis, CHF-Potenziale/);
  assert.doesNotMatch(output, /CHF [1-9][0-9]/);
  assert.match(output, /Nicht verfügbar|UNAVAILABLE/);
});
test("verified findings without available sources are rejected", () => {
  const x = make(); x.findings[0].source_ids = [];
  assert.throws(() => validateBrief(x), /Verified finding/);
  x.findings[0].source_ids = ["wrong"];
  assert.throws(() => validateBrief(x), /missing or unavailable/);
});
test("case-study proof cannot be manufactured without permission and measured evidence", () => {
  const x = make(); x.case_study.state = "PROVEN"; x.case_study.reference = "Demo";
  assert.throws(() => renderBriefHtml(x), /PROVEN case requires/);
});
test("financial scenario is shown only as assumptions, not measured result", () => {
  const x = make();
  Object.assign(x.scenario_inputs, { hours_per_month: 20, hourly_full_cost_chf: 60,
    usable_capacity_fraction: 0.4, monthly_incremental_margin_chf: 100,
    monthly_run_cost_chf: 200, implementation_cost_chf: 3200,
    assumption_notes: ["Illustrative hypothesis, not an observed baseline"] });
  assert.deepEqual(calculateIndicativeROI(x.scenario_inputs), {
    grossMonthlyTimeValue: 480, conservativeMonthlyNet: 280,
    expectedMonthlyNet: 380, conservativeAnnualNet: 3360,
    amortisationMonths: 3200 / 280,
  });
  assert.match(renderBriefHtml(x), /Reine Modellrechnung/);
});
test("HTML injection in company names, findings and source URLs is escaped", () => {
  const x = make();
  x.subject.name = '<script>alert("x")</script>';
  x.findings[0].claim = '<img src=x onerror="alert(1)">';
  x.sources[0].location = "javascript:alert(1)";
  const result = renderBriefHtml(x);
  assert.doesNotMatch(result, /<script>/);
  assert.doesNotMatch(result, /<img src=x/);
  assert.doesNotMatch(result, /href="javascript:/);
  assert.match(result, /&lt;script&gt;/);
});
test("refuses financial projections without explicit assumption notes", () => {
  const x = make(); x.scenario_inputs.hours_per_month = 24;
  assert.throws(() => renderBriefHtml(x), /assumption notes/);
});
test("unapproved named case is never rendered as a proven result", () => {
  const x = make(); x.case_study.state = "IMPLEMENTED"; x.case_study.reference = "Synthetic Pilot";
  x.case_study.measured_results = [{ metric: "hours", before: 8, after: 2 }];
  assert.doesNotMatch(renderBriefHtml(x), /<td>8/);
});


test("real public-source Happy Souls pilot input renders without invented ROI or case proof", async () => {
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const fixture = JSON.parse(await readFile(new URL("../docs/examples/HAPPY_SOULS_PUBLIC_OPPORTUNITY_INPUT_2026-10-23.json", import.meta.url), "utf8"));
  const rendered = renderBriefHtml(fixture);
  assert.match(rendered, /Happy Souls GmbH/);
  assert.match(rendered, /happysouls.ch/);
  assert.match(rendered, /ENTWURF/);
  assert.match(rendered, /keine Stundenersparnis, CHF-Potenziale/);
  assert.match(rendered, /Catering-Anfragen zuverlässig erfassen/);
  assert.doesNotMatch(rendered, /<td>8 Stunden/);
});
