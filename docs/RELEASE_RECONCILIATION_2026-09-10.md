# itsfeierabend release reconciliation — 10 September 2026

Status: reviewable code repair; production cutover has not been performed.

## Verified current state

| Surface | Evidence | Meaning |
| --- | --- | --- |
| GitHub main | `1ad59bdd8169ac911a5e04e59ebe1ed998686741`, PR #1; no open PR at the start of this work | July launch app is the code baseline |
| Lovable | Project `ff1ee944-2315-457f-8a97-db2703924b0c`, latest `7f15b776b703291af7a4f8643254562105ef7d67`, edit 21 August | Separate legacy history; cannot infer identical code from the project name |
| Live apex HTML | Title `itsFeierabend.ch — KI-gestützte Digital Marketing Agentur`; entry asset `/assets/index-DoZdkRwh.js` | Legacy agency build is still served; it does not identify the GitHub launch commit |
| Live DB metadata | `20260821200430` present; `20260725050000`, `20260725060000`, `20260725070000` absent | August security changes are present while launch migrations are missing |
| Live DB function catalog | `has_role` exists; `create_audit_with_lead` and `claim_legacy_analysis_scan` absent | Atomic launch contracts are not installed |
| Live DB policies/grants | `anon` still has SELECT on leads and analysis_reports; token-header policies still exist. Audit requests have only deny-client policy. | Do not accept live report hardening or new admin reporting |
| GSC | Lovable history on 21 August records domain ownership, indexed homepage and sitemap submission | Useful historical evidence; this run did not independently measure GSC traffic |

Queries read only schema migrations, `pg_policies`, privilege predicates and the
function catalog. No customer records, secret values, reports or tokens were
retrieved. No production writes, submissions, emails or analytics events were
sent. Canonical Asana project: `1216900420153280`.

## Critical reconciliation

Lovable's August migration removes Data API execution of the `SECURITY DEFINER`
helper `has_role` and rewrites its known policies to self-scoped role lookups.
GitHub's July launch branch separately introduces an admin SELECT policy on
`audit_requests` that still calls this helper. Combining the branches without a
repair breaks admin audit reads with `permission denied for function has_role`.

This release imports the exact August migration from the Lovable commit and
adds `20260910090000_reconcile_audit_admin_policy.sql`. The repair uses the same
self-scoped role check and keeps `has_role` inaccessible to anon/authenticated.
It does not restore broad RPC access or make audit rows public.

Embedded PostgreSQL tests replay the complete application migration history in
both orders: chronological and the actual production order (August hardening
before the missing July launch changes). Both reproduce the error before repair,
then prove admin read access, non-admin isolation, self-only role reads, no role
escalation, anonymous restrictions, service access and safe repair replay.

Lovable's other August edit improves social image URLs and descriptive legacy
service links. GitHub main already resolves social images to absolute URLs and
generates route-specific static metadata. The legacy ServicesSection is not the
launch homepage; replacing the launch UI would regress the approved architecture.
Those changes therefore do not justify copying the legacy app over main.

## Release identity and validation

`npm run build` now generates `dist/release.json` with the real checkout SHA,
working-tree dirty status and SHA-256 hashes for all static files. The hosting
configuration declares no-store for the manifest. A request-level test verifies
that its HTML and JavaScript hashes match served bytes. It is evidence for a
release comparison, not a deployment action.

`npm run typecheck` now checks `tsconfig.app.json` and `tsconfig.node.json`
explicitly. The previous command addressed a solution file with no source files
and did not establish that the app source passed type checking.

Validation at authoring time:

- ESLint: 0 errors, 16 existing warnings.
- App and Vite TypeScript checks: passed.
- Embedded PostgreSQL migration/RLS tests: 18 passed.
- Local request/hosting/cutover/provenance tests: 5 passed.
- Deterministic score, URL/SSRF and public payload contract tests: 25 passed.
- Production build: passed with placeholder Supabase values and no GA4 or
  Turnstile production identifiers.
- Full Deno suite initially could not download its remote assertion dependency;
  full browser suite initially could not download Chromium in the cloud runtime.
  These are not passing claims. CI runs both suites on the review branch.

## Concrete cutover sequence for review

1. Select and approve the reconciled release commit; retain the current Lovable
   version as the frontend rollback reference. Do not assume the old July main
   and the currently served legacy frontend are interchangeable.
2. Verify a DB backup and compare migration contents with the live inventory.
   Early live migration version IDs differ by seconds from repository filenames;
   do not blindly replay CREATE TABLE migrations or rewrite migration history.
3. On the current live DB, the August migration is already applied. The missing
   app migrations to apply in order are `20260725050000`, `20260725060000`,
   `20260725070000`, then `20260910090000`. Check for the known `has_role`
   dependency gap until the final repair completes. Execute under a planned
   cutover; do not deploy Edge Functions ahead of their required SQL.
4. Follow `RELEASE_CHECKLIST.md` for Turnstile, sender, secrets, egress control,
   temporary legacy compatibility and Edge Function deployment. Verify values
   by presence/behaviour, never by printing secrets.
5. Build the selected clean commit in the intended host environment. Compare
   `release.json` and critical asset bytes after preview and then publication.
   A missing manifest or `dirty: true` cannot establish an accepted clean SHA.
6. Validate new and legacy transitional contracts with explicitly approved
   synthetic production records; prove notification/analytics with authorised
   test recipients and identifiers. Close the legacy scanner only after the
   new frontend and rollback requirements permit it.
7. Verify actual www/apex redirects, headers, sitemap, private noindex routes,
   consent, report access and error recovery. Static-host configuration files
   alone do not prove that Lovable honours every directive.

## Remaining acceptance and decisions

Runtime gate remains open: live SQL/Edge configuration, actual storage, private
report access, mail delivery/retry, analytics reconciliation and safe release
identity must be verified during cutover. Product v1.1 weights, funnel and pricing
still require the decisions listed in `ENGINE_COMMERCIAL_SOURCE_OF_TRUTH.md`.
Legal entity/provider inventory, real customer proof and a four-week baseline
cannot be completed from code. No paid acquisition or public success claim is
accepted by this repair.
