# itsfeierabend — Case Evidence Matrix — 2026-09-29

Purpose: separate **implemented / verified evidence** from **marketing claims** before case-study copy is published.

This matrix is intentionally conservative. A project can be named as a pilot or implementation reference without turning it into an outcome claim.

## Claim states

- **VERIFIED** — backed by current first-party, source or acceptance evidence.
- **IMPLEMENTED** — source/work exists, but business outcome is not yet proven.
- **OPEN** — acceptance, measurement or a protected release is still pending.
- **DO NOT CLAIM** — unsupported as a public outcome statement.

## Umzugscheck.ch

### Verified

- Deterministic first-touch attribution source package was independently reviewed and merged.
- The current Lovable source still contains the consent-gated first-touch capture and atomic lead-event context.
- The current release is live and the post-release source identity has been reconciled.
- Attribution evidence is designed to join future backend lead evidence through `conversion_events.lead_id`.
- Marketing click identifiers remain separately consent-gated.

### Open

- No post-release lead or conversion event existed in the read-only production window checked after the release.
- Natural-acquisition-to-real-lead attribution is therefore not yet proven on a post-release customer event.
- A GA4-to-backend identity join is explicitly not claimed.

### Safe public wording

> For Umzugscheck.ch we built a consent-aware attribution layer that carries first-touch acquisition evidence into the backend lead event.

### Do not claim yet

- “Organic SEO produced X leads.”
- “Attribution increased conversion by X%.”
- “GA4 is deterministically joined to every lead.”

## Feierabend Services

### Verified

- The reviewed consent / dependency correction from PR13 was merged and the current Lovable source matches that release commit.
- A later consent-withdrawal correction exists as reviewed draft PR14.
- Fresh GA4 reads for the post-release period returned no rows in the connected property.
- Live refusal testing previously showed no cookies after refusal, but no visible cookie-settings reopen path remained on the current live release.

### Open

- PR14 is not merged or published.
- Enhanced Conversions ingestion is not proven by current measurement.
- Already-loaded-vendor withdrawal acceptance remains incomplete until PR14 is released and tested live.

### Safe public wording

> For Feierabend Services we hardened consent handling and built a tested withdrawal correction with explicit live-acceptance gates.

### Do not claim yet

- “Enhanced Conversions is fully working.”
- “Tracking accuracy improved by X%.”
- “All vendors are proven to stop immediately on withdrawal.”

## The Forge

### Verified

- Current GitHub and Lovable source are reconciled at the same source commit.
- Menu, campaign, print, QR, product and raw-video source groups have been inventoried.
- A durable production-artifact handoff now exists with print specs, QR acceptance steps, video cuts and catering handoff boundaries.
- Prior desktop and mobile live interaction acceptance exists for the Lunch Basket flow.

### Open

- Final physical print acceptance.
- Physical QR scan at realistic distance.
- Final promo-video selection / edit / exports.
- Any print order, purchase or external campaign launch.

### Safe public wording

> For The Forge we connected website delivery, product/menu assets, campaign collateral and production handoff into one traceable operating package.

### Do not claim yet

- Event capacity or sales volume not backed by a specific accepted event record.
- Campaign performance uplift before a measured campaign.
- “All print assets are production-approved” until the physical acceptance checklist is complete.

## Evidence-led case-study template

Use this structure for every future public case:

### 1. Starting constraint
Describe the actual workflow or business bottleneck without exaggeration.

### 2. What was built
Name the bounded system, automation, content architecture or workflow.

### 3. Acceptance evidence
List source commit / test / live acceptance / first-party measurement.

### 4. Current outcome
Only state a business result if it is measured and attributable.

### 5. What remains open
Show unresolved measurement, release or operational dependencies.

## Approved generic proof language

- “Implemented and acceptance-tested”
- “Live source verified”
- “Source-linked handoff”
- “Pilot implementation”
- “Measured with first-party evidence”
- “Designed to reduce manual handoffs”
- “Built with explicit human approval gates”

## Phrases that require stronger evidence

Do not publish these without a supporting artifact:

- “saved X hours”
- “reduced costs by X%”
- “increased revenue / leads / conversion by X%”
- “fully automated”
- “zero errors”
- “best in Switzerland”
- “guaranteed”
- “fully compliant”

## Commercial use

The evidence matrix supports the offer ladder in `OFFER_SYSTEM_2026-09-29.md`:

**Opportunity Brief → AI / Automation Audit → Implementation Sprint → AI Operating System → Continuous Improvement**

Cases should prove the operating method, not decorate the page with invented victories.
