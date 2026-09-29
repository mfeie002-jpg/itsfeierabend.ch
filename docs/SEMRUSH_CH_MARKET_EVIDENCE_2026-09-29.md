# Semrush CH Market Evidence — itsfeierabend.ch

Date: 2026-09-29  
Market: Switzerland  
Device: Desktop  
Source: authenticated Semrush web UI in the existing Chrome session  
Scope: read-only market evidence for the existing GTM / landing-intent package

## Evidence boundary

- This is external Semrush market data, not first-party Search Console, GA4, CRM or lead evidence.
- Semrush API units were not used. The figures were read from the authenticated browser UI.
- No campaign, budget, tracking setting, publish, pricing activation or production source was changed.
- Search-volume estimates are directional. They do not prove conversions or demand for itsfeierabend.ch.
- Semrush showed no Swiss desktop Top-100 organic rankings for `itsfeierabend.ch` in the 2026-09-28 snapshot. This must not be interpreted as zero first-party visibility; GSC is authoritative for actual impressions.

## Fresh Swiss keyword evidence

| Keyword | CH monthly volume | KD | Intent | CPC (USD) | Competition |
|---|---:|---:|---|---:|---:|
| `ki beratung` | 170 | 19% | Informational | 12.69 | 0.65 |
| `künstliche intelligenz beratung` | 170 | 33% | Informational | 12.69 | 0.65 |
| `ai consulting` | 170 | 22% | Commercial | 10.25 | 0.62 |
| `prozessautomatisierung` | 110 | 20% | Informational | 5.08 | 0.28 |
| `digitalisierung beratung` | 10 | n/a | n/a | n/a | n/a |

Additional UI observations:

- `ki für kmu` had no usable CH volume in the current database, although Semrush showed 100 global monthly searches.
- Exact geo-modified phrases such as `ki beratung schweiz`, `prozessautomatisierung schweiz` and `ai transformation schweiz` did not provide usable Swiss metrics in this snapshot.
- Absence of a reported estimate is UNKNOWN / BELOW DATA THRESHOLD, not proof of zero searches.

## GTM and landing decision

### 1. One primary commercial page

Use one canonical commercial landing for the overlapping cluster:

- primary concept: **KI-Beratung für Schweizer KMU**
- primary keyword: `ki beratung`
- secondary phrases: `künstliche intelligenz beratung`, `ai consulting`
- recommended future route: `/ki-beratung`
- avoid a separate `/ai-consulting` page unless later evidence proves a distinct English-market need

The page should answer commercial evaluation questions while remaining evidence-led:

- what is diagnosed;
- which processes are suitable;
- what evidence the scan/audit returns;
- delivery ladder: Opportunity Brief → Audit → Sprint → AI OS → Retainer;
- verified cases and explicit limitations;
- CTA into the existing scan/audit entry, not an unsupported transformation promise.

### 2. One informational solution pillar

Use `prozessautomatisierung` as a separate educational/solution intent:

- recommended future route: `/prozessautomatisierung`
- explain process selection, data readiness, risks, human handoffs, measurement and expected evidence;
- route qualified readers to the scan/audit;
- do not mix this page with generic design/development services.

### 3. Scanner role

The scanner is the evidence-collection and qualification mechanism, not the only SEO landing page. Search intent should enter through a specific problem/solution page and then progress:

**specific problem → scan/audit → evidence report → DIY / Deep Scan / Done-for-you**

### 4. Existing-route disposition

- `/website-audit`: retain for website-analysis intent.
- `/seo-analyse`: retain for SEO/ranking diagnosis.
- `/ai-visibility`: retain as category/positioning content; do not claim proven acquisition.
- `/gratis-call`: downstream CTA, not a primary acquisition page.
- `/ultimate-package`: keep claims conservative until click and conversion evidence exists.

## Safe next implementation package

A future source package may prepare copy and internal-link mappings for `/ki-beratung` and `/prozessautomatisierung`, but it must first reconcile the current Git main/Lovable divergence. It must not publish or migrate production URLs without the applicable exact Human Gate.

Paid Search remains gated until live conversion tracking, CRM-quality acceptance, keyword/CPC evidence, a defined budget and explicit purchase/spend approval exist.
