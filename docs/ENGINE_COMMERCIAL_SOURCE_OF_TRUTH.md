# Engine & Commercial Source of Truth

Version: 1.1 integration inventory, 10 September 2026. This inventory records the
implemented v1.0 contract and unresolved v1.1 decisions. It does not approve new
prices, weights, campaigns or a production release.

Canonical execution project: [AI Business Scanner & Conversion Engine](https://app.asana.com/1/146611706047360/project/1216900420153280).
Code baseline: [GitHub main 1ad59bdd](https://github.com/mfeie002-jpg/itsfeierabend.ch/commit/1ad59bdd8169ac911a5e04e59ebe1ed998686741).
Live-state evidence and cutover requirements: [release reconciliation](RELEASE_RECONCILIATION_2026-09-10.md).

## Contract and ownership

| Classification | Contract | Source |
| --- | --- | --- |
| FACT | GitHub launch code has one three-step `/audit` / `/en/audit` flow, private `/audit/r/:token` results and legacy redirects. | `src/App.tsx`, `src/pages/AuditV0Page.tsx`, `public/_redirects` |
| FACT | The preliminary audit gathers public site evidence and optional Semrush enrichment; unavailable evidence stays visible. | `supabase/functions/create-audit/index.ts`, `_shared/audit-signals.ts`, `_shared/semrush.ts` |
| FACT | Five deterministic categories are versioned `v1.0`; a different visual proposal is not an implementation decision. | `_shared/audit-signals.ts` and its tests |
| DECISION REQUIRED | v1.1 weights, the relationship between the URL-only scanner and contextual audit, and a signed product contract. | Asana tasks `1216901280455219`, `1216905455002657`, `1216901280455283` |
| TARGET | Evidence → understandable report → qualified next step. No revenue, lead, ranking or AI-mention guarantee. | Project description, `IMPLEMENTATION_DECISIONS.md` |

GitHub owns code and versioned specifications. Asana owns execution and acceptance.
Lovable is a deployment/editing surface whose commit must be reconciled with
GitHub; a recent edit timestamp is not proof of a matching release. Historical
Drive backbones, old module schemes and the legacy agency UI are historical
references, not approval to replace the implemented contract.

## Implemented evidence and scoring

| Category | v1.0 weight |
| --- | ---: |
| Technical foundation | 15 |
| Content and search intent | 25 |
| Trust and reputation | 20 |
| Conversion and user experience | 25 |
| Automation and data maturity | 15 |

Scores use evaluable signal points divided by evaluable maximum points. Missing
signals do not manufacture zeroes or neutral 50s. Coverage is separate; the
deterministic fixtures cover complete evidence, zero-valued evidence, unavailable
probes and stable action ordering. Preserve this version until the v1.1 decision
explicitly changes it. The alternative visual weights 25/20/25/20/10 remain a
proposal and must not silently replace the current values.

`SignalResult` records evidence, state, source and confidence independently.
Current states are `measured`, `user_provided`, `inferred`, `estimated` and
`unavailable`. User-facing Observed / Inferred / Estimated is an open taxonomy
decision: `unavailable` must remain visible; user input and expert review must not
be presented as automated measurement. A per-signal timestamp and expert-review
record are not yet universal fields in the type. Do not claim this task finished.

The launch pipeline and legacy scanner have different adapters. The legacy
PageSpeed / Observatory / Firecrawl design must not be described as the current
preliminary-audit runtime contract. Adapter-level retry, quota, freshness and
failure contracts for a future unified engine remain in Asana task
`1216904337568754`. Existing Semrush error handling and cache tests are in
`_shared/semrush.test.ts`; no live quota was consumed for this reconciliation.

## AI boundary

Numeric scores and evidence remain code-owned. Legacy `ai-interpret` reads scored
reports, requests a JSON interpretation and falls back when the model fails. A
prompt requesting JSON is not a validated schema. The schema/model contract in
Asana `1216905455002676` is still open and must not be marked accepted merely
because the legacy endpoint exists. The v1.0 preliminary result remains useful
without inventing AI conclusions.

## Report and runtime contract

The new audit endpoint stores lead and audit creation atomically through
`create_audit_with_lead`; the legacy cutover reserves scans through
`claim_legacy_analysis_scan`. These functions are in GitHub migrations but were
absent from the live DB on 10 September. New private report retrieval uses
`get-audit-report-v0` and minimal response projections. Historical token-header
table policies must be removed by the reviewed launch migration before claiming
the live access model is hardened.

Do not expose report tokens in analytics, logs, screenshots, exports or test
notes. The release manifest contains only commit identity, dirty status and
static file hashes. No runtime secrets or customer data are included.

Token expiry/revocation, provider delivery, durable mail retry, runtime RLS and
external egress controls remain acceptance requirements. A local mocked flow
does not prove those production properties.

## Commercial contract

| Offer | Intended outcome | Current release rule |
| --- | --- | --- |
| Free preliminary audit | Publicly measurable baseline, explicit coverage, prioritised next steps | Implemented v1.0 contract; no guarantee of complete evidence |
| DIY Blueprint | Guided action plan | CHF 49 is a proposal pending scope, margin and terms approval |
| Deep Scan | Additional evidence, human review and strategy | CHF 249 is a proposal pending approval |
| Done for you | Agreed implementation with bounded deliverables and acceptance | From CHF 2,900 is a proposal pending approval |
| Partner / ongoing optimisation | Qualified handoff or recurring agreed work | No automatic white-label or unlimited delivery promise |

The launch code avoids publishing unapproved prices. Before approving paid
offers, record deliverables, required inputs, exclusions, capacity, turnaround,
tax display, cancellation/refund handling and upgrade credit. Historical prices
and the fact that an offer button exists are not approval.

## CRM and measurement

The desired commercial lifecycle is Lead → Qualified → Client → Retainer. Each
transition needs an owner and business evidence; a CTA click cannot qualify a
lead or create revenue. Existing database statuses are operational states, not
proof that this lifecycle is implemented. See Asana `1216905455002920`.

The event names, allowed parameters, consent rules, formulas and reporting
denominators are recorded in [KPI_MEASUREMENT_FRAMEWORK.md](KPI_MEASUREMENT_FRAMEWORK.md).
No analytics initialisation without consent; no PII or token paths; server
persistence confirms submission. Purchases and revenue must come from validated
commercial records. Four full weeks of baseline data can only begin after the
runtime gate and approved test cohort. No baseline numbers are available from
this technical reconciliation.

## Proof standard

Every public case, benchmark or testimonial needs: relationship to the project,
baseline, measurement window, source, change, attribution limits, consent and
publication approval. A demo must be labelled as a demo. No sample score,
signal-count claim, percentage uplift, client logo or ranking claim may appear
as measured customer success without evidence. The launch content follows
`IMPLEMENTATION_DECISIONS.md` section 11; the live legacy UI still needs its own
release acceptance.

## Launch gates

1. Product/weight/funnel and commercial decisions recorded without contradictory
   versions; legal entity/provider/retention inventory accepted.
2. Reconciled code and migrations reviewed; production-specific configuration
   verified without exposing secrets.
3. GitHub, Lovable build and live files tied to the same clean release via
   `release.json`; hosting actually honours redirects and headers.
4. Controlled synthetic runtime run proves storage, dedupe, report access,
   notification and consent/event reconciliation; test rows are identified.
5. Approved acquisition hypothesis, budget and stop rules before paid traffic.

No step is inferred from an earlier green CI run. This document completes the
source inventory; the decisions and production gates retain their own status.
