import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { validateBrief } from "./generate-opportunity-brief.mjs";

function nonEmpty(x) { return typeof x === "string" && x.trim().length > 0; }
function publicUrl(raw) {
  try {
    const u = new URL(raw);
    const h = u.hostname.toLowerCase();
    return ["https:", "http:"].includes(u.protocol) && !u.username && !u.password &&
      h.includes(".") && !/^\d+\.\d+\.\d+\.\d+$/.test(h) &&
      !h.startsWith("[") && !h.endsWith(".local") && !h.endsWith(".internal") &&
      !h.includes("localhost") && !h.startsWith("metadata.");
  } catch { return false; }
}
function domain(url) { return new URL(url).hostname.toLowerCase().replace(/^www\./, ""); }
function clip(value, max = 140) { return String(value).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max); }

export function importPublicScrape(input, options = {}) {
  if (!nonEmpty(options.companyName) || !nonEmpty(options.vertical)) {
    throw new Error("Company name and vertical must be supplied");
  }
  if (!input || typeof input !== "object" || input.success === false || input.error) {
    throw new Error("Public scrape unsuccessful");
  }
  const page = input.data && typeof input.data === "object" ? input.data : input;
  const meta = page.metadata || input.metadata || {};
  const sourceUrl = meta.sourceURL || meta.sourceUrl || page.url || input.url;
  if (!publicUrl(sourceUrl)) throw new Error("Missing or non-public source URL");
  if (options.expectedUrl && (!publicUrl(options.expectedUrl) ||
      domain(options.expectedUrl) !== domain(sourceUrl))) {
    throw new Error("Scraped site does not match requested company domain");
  }
  if (!Number.isInteger(meta.statusCode) || meta.statusCode < 200 || meta.statusCode >= 300) {
    throw new Error("Cannot verify a page without observed HTTP 2xx status");
  }
  if (!nonEmpty(page.markdown) || page.markdown.length < 40) {
    throw new Error("Missing substantive public page content");
  }
  const now = options.observedAt || new Date().toISOString();
  if (Number.isNaN(Date.parse(now))) throw new Error("Invalid timestamp");
  const raw = page.markdown.slice(0, 100000).toLowerCase();
  const sourceId = "PUBLIC1";
  const findings = [];
  function observe(claim, limitations) {
    findings.push({
      id: "F" + (findings.length + 1), claim, evidence_status: "VERIFIED",
      source_ids: [sourceId], observed_at: now, limitations
    });
  }
  const title = meta.title || meta.ogTitle;
  if (nonEmpty(title)) observe("Öffentlicher Seitentitel: " + clip(title), "Kein Nachweis für Traffic oder Conversion.");
  const terms = ["Catering", "Foodtruck", "Foodbox", "Räumung", "Umzug", "Werkstatt", "Reparatur", "Massage"];
  const offers = terms.filter(x => raw.includes(x.toLowerCase())).slice(0, 4);
  if (offers.length) observe("Auf der Seite genannte Leistungstypen: " + offers.join(", ") + ".",
    "Keine Bestätigung für interne Kapazität, Verfügbarkeit oder Bearbeitungszeiten.");
  const links = Array.isArray(page.links) ? page.links.filter(x => typeof x === "string") : [];
  const email = links.some(x => x.startsWith("mailto:")) || raw.includes("mailto:");
  const emailPreparation = raw.includes("anfrage per e-mail vorbereiten") ||
    (raw.includes("e-mail-programm") && raw.includes("vorbereitet"));
  const form = /kontaktformular|anfrageformular|contact form/.test(raw);
  if (emailPreparation) observe("Die Seite beschreibt einen Anfrageweg, der eine E-Mail vorbereitet.",
    "Die interne Speicherung oder CRM-Anbindung ist nicht belegt.");
  else if (email) observe("Die Website bietet einen E-Mail-Kontaktweg.",
    "Es ist nicht belegt, wie das Unternehmen Anfragen intern verarbeitet.");
  else if (form) observe("Die Website erwähnt ein Kontakt- oder Anfrageformular.",
    "Die interne Speicherung und Bearbeitung müssen im Audit validiert werden.");
  const opps = [];
  function opportunity(title, current, future, unknowns, gates) {
    opps.push({
      id: "P" + (opps.length + 1), title, rank: opps.length + 1,
      current_state: current, future_state: future, evidence_refs: [sourceId],
      evidence_status: "INFERRED", unknowns, human_gates: gates,
      estimated_effort: null, risk: "MEDIUM",
      business_value: "Mögliche Zeit- oder Qualitätsverbesserung, nicht gemessen."
    });
  }
  opportunity("Anfrageeingang und Zuständigkeiten aufnehmen",
    "Öffentlicher Kontaktweg sichtbar; der interne Bearbeitungsprozess ist unbekannt.",
    "Echte Fälle mit Zustimmung aufnehmen, Eingangsinformationen und Verantwortlichkeiten strukturiert zuordnen.",
    ["Anfragevolumen", "Eingangskanäle", "CRM und Zuständigkeiten", "Aktive Bearbeitungszeit"],
    ["Kundendatenzugriff und externe Antwortfreigabe"]);
  if (offers.length || /offerte|angebot|quote|booking|buchung/.test(raw)) {
    opportunity("Offerten- und Übergabeprozess prüfen",
      "Leistungsangebote öffentlich erkennbar; der interne Angebotsablauf ist unbekannt.",
      "Bestehende Vorlagen und Regeln erfassen, Entwürfe mit expliziter menschlicher Prüfung erstellen.",
      ["Kalkulation und Preise", "Vorlagen", "Entscheidungsregeln", "Ausnahmen"],
      ["Preis- und Fachfreigaben bleiben beim Betrieb"]);
  }
  const record = {
    schema_version: "1.0.0", report_id: "ITS-DRAFT-" + domain(sourceUrl).replace(/[^a-z0-9]/g, "-") + "-" + now.slice(0, 10),
    report_type: "external_opportunity_brief",
    subject: { name: options.companyName.trim(), domain: domain(sourceUrl), vertical: options.vertical.trim(),
      subvertical: options.subvertical || null, region: options.region || null,
      source_scope: "public_and_explicitly_authorized" },
    created_at: now,
    sources: [{ id: sourceId, kind: "public_page", location: sourceUrl,
      accessed_at: now, status: "AVAILABLE", notes: "HTTP " + meta.statusCode + "; public evidence only." }],
    findings, opportunities: opps,
    case_study: { state: "UNAVAILABLE", reference: null, source_ids: [],
      publication_permission: false, measured_results: null },
    scenario_inputs: { hours_per_month: null, hourly_full_cost_chf: null, usable_capacity_fraction: null,
      monthly_incremental_margin_chf: null, monthly_run_cost_chf: null,
      implementation_cost_chf: null, assumption_notes: [] },
    review: { reviewed: false, reviewer: null, reviewed_at: null, claims_approved: false,
      notes: "Public scrape import; all internal operating assumptions and business results UNKNOWN." }
  };
  return validateBrief(record);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length < 6 || process.argv.length > 7) {
      throw new Error("Usage: node import-public-scrape.mjs scrape.json company vertical draft.json [expected-url]");
    }
    const raw = JSON.parse(readFileSync(process.argv[2], "utf8"));
    const record = importPublicScrape(raw, { companyName: process.argv[3],
      vertical: process.argv[4], expectedUrl: process.argv[6] || null });
    writeFileSync(process.argv[5], JSON.stringify(record, null, 2) + "\n");
    console.log("Created unreviewed public-evidence draft: " + process.argv[5]);
  } catch (err) { console.error(err.message || String(err)); process.exitCode = 1; }
}
