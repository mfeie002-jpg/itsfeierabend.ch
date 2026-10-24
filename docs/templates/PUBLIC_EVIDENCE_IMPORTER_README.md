# Public Website Evidence Importer (offline)

Converts a **previously obtained, publicly accessible** Firecrawl scrape JSON into the existing ITSFeierabend AI Opportunity Brief Evidence Contract. No network requests, API tokens, emails, CRM writes, or production changes.

Usage:

1. Obtain an authorized public-domain Firecrawl page scrape; save its JSON response privately.
2. Run `node scripts/import-public-scrape.mjs scrape.json "Muster GmbH" "Gastronomie" draft.json https://muster.ch/`.
3. Run `node scripts/generate-opportunity-brief.mjs draft.json draft.html`.
4. Review sources, claims and PDF layout before sharing anything externally.

Supported Firecrawl shapes: top-level `markdown/metadata` or `{success:true,data:{markdown,metadata}}`. The scraper's `sourceURL` must be public and match the explicitly requested domain, `statusCode` must be 2xx and text must exist.

The importer creates **VERIFIED public observations**, **INFERRED workflow hypotheses**, null ROI inputs and a permanently unapproved draft. `VERIFIED` refers to the supplied scrape artifact, not to a human-reviewed live-business process. Existing PDF renderer marks outputs `ENTWURF` until separately reviewed. No invented CRM gaps, wages, savings, prices or claims.

Next production steps: multi-page source inventory and provenance, Firecrawl provider integration with budget and freshness limits, quality review, client data privacy, managed storage, controlled PDF exports and customer approval. This is a testable bridge, not a complete automatic research engine.
