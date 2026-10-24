# ITSFeierabend Opportunity Brief Renderer — offline prototype

**Status:** internal / non-production prototype; no network access, CRM writes, hosting or customer messages. It renders a structured evidence record to a standalone print-ready A4 HTML file, which can be printed or saved as PDF in a browser after independent review. It does **not** research a company, scrape a website, contact anyone or validate business assumptions.

## Use

```sh
node scripts/generate-opportunity-brief.mjs <evidence.json> <output.html>
node --test tests/opportunity-brief.test.mjs
```

Input JSON is governed by `docs/templates/OPPORTUNITY_BRIEF_EVIDENCE_CONTRACT_V1.schema.json`. Source records and numerical assumptions must be populated from permitted evidence. A report without human review is prominently watermarked `ENTWURF`. Reports with missing operational baseline show no invented ROI. `PROVEN` case studies require publication permission and sourced before/after measurements.

The renderer performs critical runtime checks for IDs, source references, source states, public scope, case proof and financial assumptions. It does **not** yet implement complete JSON Schema validation or source crawling. Do not use in production without dedicated schema, data-retention, rendering, access-control and functional QA.

**Source layering:** publicly observed website facts and consented inputs → normalized evidence record → deterministic formatting and documented model scenarios → human review. AI narrative must not mutate measurements. This prototype is separate from the existing deterministic website-scoring engine and never reports that its industry hypotheses were observed in a customer's private workflow.

**Safe usage rule:** test with `example.invalid` synthetic fixtures. Never commit customer reports containing PII, report bearer tokens or confidential Process Cards to this public repository.
