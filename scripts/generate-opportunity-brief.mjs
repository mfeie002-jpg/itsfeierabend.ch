import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const STATES = new Set(["VERIFIED", "INFERRED", "TO_VALIDATE", "UNAVAILABLE", "CONFLICT"]);
const CH = new Intl.NumberFormat("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function html(value) {
  return String(value ?? "Nicht verfügbar").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

function nonEmptyText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function checkRefs(refs, sources, label, errors) {
  for (const ref of array(refs)) {
    if (!sources.has(ref) || sources.get(ref).status !== "AVAILABLE") {
      errors.push(label + ": source " + String(ref) + " is missing or unavailable");
    }
  }
}

export function validateBrief(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("Brief data must be an object");
  }
  if (record.schema_version !== "1.0.0" || record.report_type !== "external_opportunity_brief") {
    errors.push("Unsupported report contract/version");
  }
  if (!nonEmptyText(record.report_id)) errors.push("Missing report ID");
  if (!nonEmptyText(record.subject?.name) || !nonEmptyText(record.subject?.domain)) {
    errors.push("Subject company and domain are required");
  }
  if (record.subject?.source_scope !== "public_and_explicitly_authorized") {
    errors.push("Public/authorised source scope required");
  }
  if (!nonEmptyText(record.created_at) || Number.isNaN(Date.parse(record.created_at))) {
    errors.push("Valid created_at is required");
  }
  if (!Array.isArray(record.sources) || !Array.isArray(record.findings) ||
      !Array.isArray(record.opportunities)) errors.push("Sources, findings and opportunities must be arrays");
  const sources = new Map();
  for (const src of array(record.sources)) {
    if (!nonEmptyText(src?.id) || sources.has(src.id) ||
        !nonEmptyText(src.location) || !["AVAILABLE", "UNAVAILABLE", "CONFLICT"].includes(src.status)) {
      errors.push("Invalid or duplicate source ID/location/status");
      continue;
    }
    sources.set(src.id, src);
  }
  for (const f of array(record.findings)) {
    if (!nonEmptyText(f?.claim) || !STATES.has(f.evidence_status)) {
      errors.push("Invalid finding/claim/status");
    }
    checkRefs(f.source_ids, sources, "Finding " + String(f?.id), errors);
    if (f.evidence_status === "VERIFIED" && array(f.source_ids).length === 0) {
      errors.push("Verified finding must have an available source");
    }
  }
  const ranks = new Set();
  for (const o of array(record.opportunities)) {
    if (!nonEmptyText(o?.title) || !STATES.has(o.evidence_status) ||
        !Number.isInteger(o.rank) || o.rank < 1 || ranks.has(o.rank)) {
      errors.push("Opportunity requires title/status/unique positive rank");
    }
    ranks.add(o?.rank);
    checkRefs(o?.evidence_refs, sources, "Opportunity " + String(o?.id), errors);
    if (o?.evidence_status === "VERIFIED" && array(o?.evidence_refs).length === 0) {
      errors.push("Verified opportunity requires an available source");
    }
  }
  const c = record.case_study;
  if (!c || !["PROVEN", "IMPLEMENTED", "PLANNED", "UNAVAILABLE"].includes(c.state)) {
    errors.push("Invalid case-study state");
  } else if (c.state === "PROVEN") {
    if (!c.publication_permission || !nonEmptyText(c.reference) ||
        array(c.source_ids).length === 0 || array(c.measured_results).length === 0) {
      errors.push("PROVEN case requires permission, name, sources and real before/after measurements");
    }
    checkRefs(c.source_ids, sources, "PROVEN case", errors);
    for (const m of array(c.measured_results)) {
      if (!Number.isFinite(m.before) || !Number.isFinite(m.after) ||
          !Number.isInteger(m.sample_size) || m.sample_size < 1 ||
          !nonEmptyText(m.metric) || !nonEmptyText(m.unit) ||
          !nonEmptyText(m.window) || array(m.source_ids).length === 0) {
        errors.push("Case measurement requires metric, real values, window, N and sources");
      }
      checkRefs(m.source_ids, sources, "Case measurement", errors);
    }
  }
  const inputs = record.scenario_inputs;
  if (!inputs || typeof inputs !== "object") {
    errors.push("scenario_inputs are required");
  } else {
    const required = ["hours_per_month", "hourly_full_cost_chf", "usable_capacity_fraction",
      "monthly_run_cost_chf", "implementation_cost_chf"];
    for (const k of required) {
      if (hasValue(inputs[k]) && (!Number.isFinite(inputs[k]) || inputs[k] < 0)) {
        errors.push("Invalid financial assumption: " + k);
      }
    }
    if (hasValue(inputs.usable_capacity_fraction) && inputs.usable_capacity_fraction > 1) {
      errors.push("Usable capacity fraction exceeds 1");
    }
    if (hasValue(inputs.monthly_incremental_margin_chf) &&
        !Number.isFinite(inputs.monthly_incremental_margin_chf)) {
      errors.push("Invalid incremental margin assumption");
    }
    const anyNumeric = Object.values(inputs).some(x => typeof x === "number");
    if (anyNumeric && array(inputs.assumption_notes).filter(nonEmptyText).length === 0) {
      errors.push("Every numeric ROI scenario requires explicit assumption notes");
    }
  }
  const review = record.review;
  if (!review || typeof review.reviewed !== "boolean" || typeof review.claims_approved !== "boolean") {
    errors.push("Missing reviewer/claim-approval state");
  } else if ((review.reviewed || review.claims_approved) &&
             (!nonEmptyText(review.reviewer) || !nonEmptyText(review.reviewed_at))) {
    errors.push("Reviewed claims require reviewer name and date");
  }
  if (errors.length > 0) throw new Error("Report evidence validation failed:\n- " + errors.join("\n- "));
  return record;
}

export function calculateIndicativeROI(inputs) {
  const fields = ["hours_per_month", "hourly_full_cost_chf", "usable_capacity_fraction",
    "monthly_run_cost_chf"];
  if (!fields.every(k => typeof inputs?.[k] === "number" && Number.isFinite(inputs[k]))) {
    return null;
  }
  const grossMonthlyTimeValue = inputs.hours_per_month *
    inputs.hourly_full_cost_chf * inputs.usable_capacity_fraction;
  const conservativeMonthlyNet = grossMonthlyTimeValue - inputs.monthly_run_cost_chf;
  const expectedMonthlyNet = typeof inputs.monthly_incremental_margin_chf === "number"
    ? conservativeMonthlyNet + inputs.monthly_incremental_margin_chf : null;
  const amortisationMonths = typeof inputs.implementation_cost_chf === "number" &&
    conservativeMonthlyNet > 0 ? inputs.implementation_cost_chf / conservativeMonthlyNet : null;
  return { grossMonthlyTimeValue, conservativeMonthlyNet, expectedMonthlyNet,
    conservativeAnnualNet: conservativeMonthlyNet * 12, amortisationMonths };
}

function sourceCell(source) {
  const name = html(source.id) + " · " + html(source.kind) + " · " + html(source.accessed_at);
  const loc = String(source.location || "");
  let link = html(loc);
  try {
    const parsed = new URL(loc);
    if (["http:", "https:"].includes(parsed.protocol)) {
      link = '<a href="' + html(parsed.toString()) + '">' + html(loc) + "</a>";
    }
  } catch {
    // Non-URL evidence IDs are shown without a clickable link.
  }
  return "<li>" + name + " — " + link + " (" + html(source.status) + ")</li>";
}

function card(label, value) {
  return '<div class="card"><div class="label">' + html(label) + '</div><div>' + html(value) + "</div></div>";
}

function lineItems(items) {
  return array(items).length ? "<ul>" + items.map(i => "<li>" + html(i) + "</li>").join("") + "</ul>"
    : '<p class="muted">Noch zu validieren</p>';
}

function sheet(index, title, content) {
  return '<section class="sheet"><p class="eyebrow">ITSFEIERABEND · ' +
    String(index).padStart(2, "0") + "</p><h2>" + html(title) + "</h2>" + content + "</section>";
}

export function renderBriefHtml(input) {
  const d = validateBrief(input);
  const findings = d.findings;
  const opportunities = [...d.opportunities].sort((a, b) => a.rank - b.rank);
  const top = opportunities.slice(0, 3);
  const c = d.case_study;
  const roi = calculateIndicativeROI(d.scenario_inputs);
  const draft = !d.review.reviewed || !d.review.claims_approved;
  const state = s => ({ VERIFIED: "Verifiziert", INFERRED: "Abgeleitet", TO_VALIDATE: "Zu validieren",
    UNAVAILABLE: "Nicht verfügbar", CONFLICT: "Quellenkonflikt" }[s] || s);
  const intro = '<p><strong>' + html(d.subject.name) + '</strong> · ' + html(d.subject.vertical) +
    " · " + html(d.subject.domain) + "</p>";
  const summary = top.length ? top.map(o =>
    "<li><strong>" + html(o.title) + "</strong> (" + html(state(o.evidence_status)) +
    "): " + html(o.business_value) + "</li>").join("") :
    "<li>Eine valide Priorisierung erfordert zusätzliche Quellen und ein Gespräch.</li>";
  const cover = '<div class="hero">KI-Potenzialanalyse für ' + html(d.subject.name) + '</div>' +
    '<p class="lead">Öffentlich erkennbare Chancen, gezielte Fragen und ein persönlicher Umsetzungsplan.</p>' +
    intro + '<h3>Die ersten Chancen</h3><ol>' + summary + '</ol>' +
    '<p class="note">Öffentliche Voranalyse: Keine Behauptung über vollständige interne Prozesse oder bereits gemessene Einsparungen.</p>';
  const visible = findings.length ? findings.map(f =>
    "<tr><td>" + html(f.claim) + "</td><td>" + html(state(f.evidence_status)) +
    "</td><td>" + html(array(f.source_ids).join(", ") || "Keine") +
    "</td><td>" + html(f.limitations || "") + "</td></tr>").join("") :
    '<tr><td colspan="4">Keine überprüften Befunde vorhanden.</td></tr>';
  const observed = '<p>Die Einstufung bezieht sich nur auf öffentliche oder ausdrücklich freigegebene Quellen.</p>' +
    '<table><tr><th>Befund</th><th>Status</th><th>Quellen</th><th>Grenze</th></tr>' + visible + "</table>";
  const proven = c?.state === "PROVEN";
  const caseBody = proven
    ? '<p><strong>' + html(c.reference) + '</strong> (Freigabe dokumentiert)</p><table>' +
      '<tr><th>KPI</th><th>Vorher</th><th>Nachher</th><th>Fenster / N</th></tr>' +
      array(c.measured_results).map(m => "<tr><td>" + html(m.metric) + "</td><td>" +
        html(String(m.before) + " " + m.unit) + "</td><td>" +
        html(String(m.after) + " " + m.unit) + "</td><td>" +
        html(m.window + " / N=" + m.sample_size) + "</td></tr>").join("") + "</table>" +
      '<p>Quellen: ' + html(array(c.source_ids).join(", ")) + "</p>"
    : '<p>Ein vergleichbarer Referenzbetrieb ist im Status <strong>' + html(c?.state || "UNAVAILABLE") +
      '</strong>. Es gibt hier noch keine freigegebenen, gemessenen Ersparnisse. ' +
      'Der spätere Branchenbeweis wird erst nach Vorher/Nachher-Messung und Kundenfreigabe ergänzt.</p>';
  const oppRows = opportunities.length ? opportunities.map(o =>
    "<tr><td>" + html(o.rank) + "</td><td>" + html(o.title) + "</td><td>" +
    html(state(o.evidence_status)) + "</td><td>" + html(o.risk) + "</td><td>" +
    html(o.estimated_effort || "offen") + "</td></tr>").join("") :
    '<tr><td colspan="5">Kein validierter Use Case.</td></tr>';
  const oppBody = '<table><tr><th>Prio</th><th>Prozess</th><th>Stand</th><th>Risiko</th><th>Aufwand</th></tr>' +
    oppRows + "</table>";
  const projectBody = top.length ? top.map(o => '<div class="project"><h3>' + html(o.title) +
    "</h3>" + card("Ist / zu validieren", o.current_state) +
    card("Vorgeschlagener Ablauf", o.future_state) +
    card("Wirtschaftlicher Nutzen (Hypothese)", o.business_value) +
    card("Freigaben", array(o.human_gates).join("; ") || "Noch festzulegen") +
    '<strong>Noch zu prüfen</strong>' + lineItems(o.unknowns) + "</div>").join("") :
    "<p>Erst nach Quellen- und Prozessaufnahme ausfüllbar.</p>";
  const roadmap = '<p><strong>0–30 Tage:</strong> Prozessaufnahme, Daten-/Owner-Karte und Baseline.</p>' +
    '<p><strong>31–60 Tage:</strong> Engen Sprint bauen, Sicherheits- und Shadow-Test.</p>' +
    '<p><strong>61–90 Tage:</strong> kontrollierte Einführung, fachliche Freigabe, Vorher/Nachher-Vergleich.</p>' +
    '<p class="note">Dies ist ein Planungsmodell, kein bereits vereinbarter Projekttermin.</p>';
  const roiBody = roi ? '<p class="note">Reine Modellrechnung anhand der angegebenen Annahmen, KEINE gemessene Einsparung.</p>' +
    card("Monatlicher nutzbarer Zeitwert", "CHF " + CH.format(roi.grossMonthlyTimeValue)) +
    card("Konservativer jährlicher Nettonutzen (nach laufenden Kosten)", "CHF " + CH.format(roi.conservativeAnnualNet)) +
    card("Erwarteter monatlicher Nettonutzen", roi.expectedMonthlyNet === null ?
      "Nicht berechenbar" : "CHF " + CH.format(roi.expectedMonthlyNet)) +
    card("Payback auf konservativer Basis", roi.amortisationMonths === null ?
      "Nicht berechenbar" : CH.format(roi.amortisationMonths) + " Monate") +
    "<h3>Annahmen</h3>" + lineItems(d.scenario_inputs.assumption_notes)
    : '<p>Ohne verlässliche Prozesszeiten, Vollkosten, wirtschaftliche Nutzbarkeit und Betriebskosten ' +
      'werden bewusst keine Stundenersparnis, CHF-Potenziale oder Amortisation erfunden.</p>';
  const next = '<p><strong>Empfohlener nächster Schritt:</strong> begrenzter AI Operations Audit ' +
    'mit einem benannten Prozess, einer verantwortlichen Person und anonymisierten Musterfällen.</p>' +
    '<p>ITSFeierabend übernimmt Aufnahme, Systementwurf, Test und Einführung persönlich; ' +
    'verbindliche fachliche Entscheidungen verbleiben beim Unternehmen.</p>' +
    '<h3>Quellenregister</h3><ul>' + array(d.sources).map(sourceCell).join("") + "</ul>" +
    '<p class="foot">Bericht-ID: ' + html(d.report_id) + ' · Erstellt: ' + html(d.created_at) +
    ' · Review: ' + html(d.review.reviewer || "ausstehend") + '</p>';
  const styles = '@page{size:A4;margin:17mm 16mm 15mm}*{box-sizing:border-box}body{margin:0;font:11pt/1.5 Arial,Helvetica,sans-serif;color:#17233c}' +
    '.sheet{break-after:page;min-height:245mm;page-break-after:always}.sheet:last-child{break-after:auto}.eyebrow{font-size:9pt;letter-spacing:.13em;color:#365bd2;font-weight:bold}' +
    'h1,h2,h3{line-height:1.23;color:#0c1735}h2{font-size:20pt;margin:9mm 0 5mm}h3{font-size:12pt;margin-top:7mm}' +
    '.hero{font-size:30pt;font-weight:800;line-height:1.14;margin:24mm 0 12mm}.lead{font-size:15pt;color:#425372}' +
    'table{border-collapse:collapse;width:100%;table-layout:fixed;margin:5mm 0}td,th{padding:2.5mm 2mm;border-bottom:1px solid #cdd5e7;text-align:left;vertical-align:top;overflow-wrap:anywhere;font-size:9.5pt}' +
    'th{background:#ebeff9;color:#243b65}.card{padding:3mm 0;border-bottom:1px solid #dce3f1}.label{font-size:9pt;font-weight:bold;color:#465e90;margin-bottom:1mm}' +
    '.note{padding:4mm;border-left:3px solid #365bd2;background:#f2f5fc;font-size:9.5pt}.muted,.foot{color:#60708f;font-size:9pt}' +
    '.project{break-inside:avoid;margin-bottom:8mm}a{color:#2454bf;overflow-wrap:anywhere}li{margin-bottom:2mm}';
  return '<!DOCTYPE html><html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">' +
    '<title>ITSFeierabend · ' + html(d.subject.name) + '</title><style>' + styles + '</style></head><body>' +
    (draft ? '<p class="note">ENTWURF · NICHT FÜR EXTERNE WEITERGABE FREIGEGEBEN</p>' : '') +
    sheet(1, "Ihre KI-Potenzialanalyse", cover) +
    sheet(2, "Was öffentlich erkennbar ist", observed) +
    sheet(3, "Branchenbeweis & Methodik", caseBody) +
    sheet(4, "AI Opportunity Map", oppBody) +
    sheet(5, "Drei mögliche Startprojekte", projectBody) +
    sheet(6, "Einführung und Ihr Aufwand", roadmap) +
    sheet(7, "Konservativer Business Case", roiBody) +
    sheet(8, "Nächster Schritt und Quellen", next) +
    "</body></html>";
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length < 4) throw new Error("Usage: node generate-opportunity-brief.mjs <input.json> <output.html>");
    const source = JSON.parse(readFileSync(process.argv[2], "utf8"));
    const result = renderBriefHtml(source);
    writeFileSync(process.argv[3], result, "utf8");
    console.log("Opportunity Brief created: " + process.argv[3]);
  } catch (error) {
    console.error(String(error.message || error));
    process.exitCode = 1;
  }
}
