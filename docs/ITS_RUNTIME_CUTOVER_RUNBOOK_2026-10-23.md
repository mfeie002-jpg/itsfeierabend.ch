# ITSFeierabend — Production Cutover Runbook (HUMAN GATE)

**Snapshot:** 23 October 2026 · **State:** REVIEW CANDIDATE, NOT APPROVED FOR PRODUCTION.  
**Source:** GitHub `main` at `da9f865de0c244df6bed05efb82f41e98d54a33c`; security reconciliation in [PR #8](https://github.com/mfeie002-jpg/itsfeierabend.ch/pull/8). Verify the latest PR head and CI immediately before execution.  
**Target:** Lovable project `ff1ee944-2315-457f-8a97-db2703924b0c`, Supabase project per `supabase/config.toml`. Confirm production ownership/identity before running any command.  
**Status rule:** Green CI = reviewable source; not a successful live scanner, customer conversion or approved production release.

## 1. Confirmed live read-only evidence

A fresh SELECT-only metadata inspection on 23 October 2026 confirms:

- Database connected and responding (`enabled=true`, stack Supabase).
- Last live migration ledger entry `20260821200430`; historical July-24 entries use slightly different seconds than files in Git. **Do not replay historical CREATE TABLE migrations or edit ledger IDs.**
- Five absent versions: `20260725050000`, `20260725060000`, `20260725070000`, `20260910090000`, `20260923070000`.
- `create_audit_with_lead`, `claim_legacy_analysis_scan` and `reserve_lead_submission` absent from live `pg_proc`.
- `anon` presently has `SELECT` privilege on `leads` and `analysis_reports`; public token-header SELECT policies are present. These expose rows by a bearer header, not the intended minimal Edge projection. `20260725050000` is designed to remove them.
- Missing `lead`/audit columns from July release; current source cannot be called production-ready.

**No customer records or secret values were queried. No SQL, Edge or hosting mutation was made.**

## 2. Hard prerequisites — MUST PASS before requesting cutover approval

| Gate | Concrete required evidence | Stop condition |
| --- | --- | --- |
| Exclusive writer | GitHub, Asana, Lovable owners/leases checked; exact approved PR head frozen | Another release writer or drift |
| Independent security review | Reviewed PR #8 diff, SQL grants/RLS, requests, token handling, test results | Any unreviewed security-critical code |
| CI | Latest exact-head CI passed database/RLS, Deno Edge check, TypeScript, lint, build, browser | Any required check missing or red |
| Backend identity | Lovable project and Supabase project ref confirmed by source **and runtime** | Unmatched or unknown target |
| Live metadata | Repeat read-only SQL, verify pending versions, functions, grants, policies and table/column shape | Any unexpected drift from snapshot |
| Data backup | Verified recoverable backup plus a tested restoration method owned by the operator | Backup/restore not verifiable |
| Proxy source of IP | Authenticated edge/gateway attestations prove which header is trusted; spoofed XFF test | User-controlled header can change identity/quota |
| Egress safety | Platform-level block on private, link-local, metadata and internal network destinations; validate DNS rebinding/redirect behavior | Only application DNS preflight without egress safety |
| Secrets | Verify existence + valid runtime behavior of `IP_HASH_SALT` (>=32), `TURNSTILE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, provider credentials. Never print secret values | Missing/expired/misaligned secret or wrong environment |
| Transactional comms | Approved Resend sender/recipient, lawful processing, suppression and retry plan | Uncontrolled real-customer email risk |
| Legal acceptance | Company identity, disclosures, providers, data regions, retention/deletion and processing agreements approved | Unknown legal/provider facts |
| Rollback | Previous exact served release preserved; URL routing and legacy path compatibility proved | No safe frontend rollback |

**Substantial warning:** `Deno.resolveDns` + later `fetch(url)` is a preflight check, **not** a DNS-pin. Public scanner must not run against arbitrary URLs until hosting/egress limits are accepted.

## 3. Read-only preflight SQL

Use only on the confirmed project, under an authorised role, with audit logs. These queries do **not** read customer data:

```sql
SELECT version FROM supabase_migrations.schema_migrations
WHERE version IN ('20260725050000','20260725060000','20260725070000',
  '20260910090000','20260923070000')
ORDER BY version;

SELECT p.proname, pg_get_function_identity_arguments(p.oid) AS args,
       p.prosecdef AS is_security_definer
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public'
  AND p.proname IN ('create_audit_with_lead','claim_legacy_analysis_scan',
                    'reserve_lead_submission','has_role')
ORDER BY p.proname;

SELECT tablename, policyname, cmd, roles
FROM pg_policies WHERE schemaname='public'
  AND tablename IN ('leads','analysis_reports','audit_requests')
ORDER BY tablename,policyname;

SELECT has_table_privilege('anon','public.leads','SELECT') AS anon_leads_select,
       has_table_privilege('anon','public.analysis_reports','SELECT') AS anon_reports_select;

SELECT table_name, column_name, data_type
FROM information_schema.columns WHERE table_schema='public'
  AND ((table_name='leads' AND column_name IN ('company_name','consent_processing','audit_type'))
   OR (table_name='audit_requests' AND column_name IN ('lead_id','consent_at','audit_type')))
ORDER BY table_name,column_name;
```

Compare to reviewed SQL files, not just filenames. Confirm `audit_events` constraints and `rate_limits.ip_hash` support 64-character HMAC text. The embedded PostgreSQL test supports the known live ordering (August hardening before missing July), **but is not a live migration rehearsal**.

## 4. Exact pending migration dependency order (PROPOSED ONLY)

Under a separately approved migration window, **after a backup, rehearsed execution, and schema diff**:

1. `20260725050000_final_launch_lead_security.sql` — new CRM/audit columns, remove public token-header row SELECT policies/grants, security/consent columns.
2. `20260725060000_atomic_audit_create.sql` — atomic lead/audit/limits RPC and legacy scanner claim.
3. `20260725070000_legacy_scanner_cutover_claim.sql` — legacy claim independently reconciled.
4. `20260910090000_reconcile_audit_admin_policy.sql` — restore admin audit reads without reopening `has_role` EXECUTE.
5. `20260923070000_atomic_lead_rate_limit.sql` — service-role-only atomic lead-form quota RPC.

Run SQL only through the platform-supported controlled deployment mechanism. Verify grants and migration ledger after each step and compare to the reviewed snapshot. **Do not submit this plan as SQL to an AI agent or call a database query tool with these migrations without explicit authorisation.**

## 5. Edge / frontend sequence (PROPOSED ONLY)

1. Verify that `IP_HASH_SALT` and Turnstile are configured **before** publishing an Edge function that fails closed without them. Do not rotate an existing salt without a plan for historical quota continuity and identifiers.
2. Preserve accepted live frontend build and release hashes, plus backup rollback route. Verify whether legacy lead IDs are still consumed by the current published UI.
3. After database acceptance, deploy the approved **exact-head** service functions and shared modules with platform-supported settings: `submit-lead`, `create-audit`, `get-audit-report-v0`, `generate-report`, `fetch-site-signals`, `compute-score`, `send-report-email`, `business-scanner`, `scan-status`, `get-analysis-report`, and referenced scoring/AI functions as required by the accepted contract.
4. If the existing frontend temporarily needs the legacy public scan path, enable `LEGACY_PUBLIC_SCANNER_ENABLED=true` only for the short, explicitly bounded compatibility window and test the one-lead/one-scan guard. This flag is not a permanent security architecture.
5. Deploy frontend from one approved clean source revision and verify hosted release manifest plus asset hashes. Do not assume a Lovable editor SHA proves served bytes.
6. After newer audit flow is accepted, close the public legacy scanner flag, enforce JWT on retired public endpoints per `supabase/config.toml`, verify rejected anonymous requests.
7. Do not publish unapproved pricing, unmeasured testimonials, or unsupported scanner weight/coverage claims during the cutover.

**Scope caution:** the 14-path source-to-live gap may contain product changes unrelated to security. Source diff approval is required before bundling any such changes into release.

## 6. Synthetic acceptance matrix (only after explicit authorised production-test gate)

Use controlled, clearly labelled synthetic identities; do not touch customers or trigger real emails without the authorised test recipient.

| Test | Required proof |
| --- | --- |
| DE audit | Valid website + business context + processing consent → new audit ID/unique private token → `ready` or transparent `partial` |
| EN audit | Correct English route, same persisted contract, private report |
| Repeated same email/domain | Lead reuse rules proven; distinct private audit tokens (new audit endpoint) |
| Anonymous reads | No direct SELECT on `leads`/`analysis_reports`; private report function returns only minimal fields |
| Report token isolation | Wrong token cannot read another report; none leaked to analytics, logs, crawler or public index |
| Invalid URLs | Private/IP-literal/localhost/metadata, redirects and DNS rebinding blocked by egress |
| Abuse protection | Missing or spoofed client IP → fail closed; rate limits atomic under concurrent requests |
| Bot challenge | Invalid/missing Turnstile rejected; valid challenge accepted |
| Provider loss | PageSpeed, Semrush or site fetch unavailable → explicitly marked unavailable; no made-up scores |
| AI result | Model only interprets evidence; cannot alter deterministic score |
| Email | Approved synthetic recipient; sender/domain verified, failed delivery recorded and retry path clear |
| Analytics | Consent-gated DE/EN events match stored lead/audit server outcomes, no PII or report tokens |
| Ops | Failure, retry, idempotency, monitoring, support owner and documented rollback proven |

**NO PASS** if only mocked E2E, code CI or screenshot evidence exists. Record exact date, Git SHA, hosted release hash, database versions, function versions, test IDs and verifier.

## 7. Abort & rollback

**Abort immediately** for unexpected schema/ledger drift, incomplete RLS revocation, spoofable quota identity, missing IP hash / Turnstile, report-token leakage, unauthorized PII access, unexplained vendor error, wrong frontend release hash, or irrecoverable customer workflow error.

- Frontend/Edge rollback: return to the **captured and verified** previous deployment and tested compatibility mode. Confirm disabled/retired paths are not silently reopened.
- DB schema rollback: **not** a blind reverse-SQL script. Many changes are additive and data-bearing; prefer forward repair or operator-owned restore from tested backup after impact assessment. Never re-grant anonymous table access just to re-enable an old frontend.
- Suspend new audit submissions and email sending safely before troubleshooting; do not delete, redact or rewrite actual customer data as a convenience.
- Verify old production pages and unaffected services still work after a failed attempt. Document incident, owner, timestamps and exact source.
- Security/PII incidents require owner escalation and appropriate incident procedures; automated agents do not approve their own safety gates.

## 8. Completion receipt template

```text
CUTOVER_ID:
FOUNDER_APPROVAL_REF:
APPROVED_GIT_COMMIT:
APPROVED_LOVABLE_SOURCE:
LIVE_RELEASE_MANIFEST_SHA:
SUPABASE_PROJECT_ID_CONFIRMED:
MIGRATION_VERSIONS:
RPC_SIGNATURE_CHECK:
PUBLIC_SELECT_POLICIES_REMOVED:
SECRETS_PRESENCE_CHECK (no values):
TRUSTED_PROXY_IP_PROOF:
EGRESS_PROOF:
E2E_SYNTHETIC_CASE_IDS:
REPORT_TOKEN_PROTECTION_CHECK:
EMAIL_PROVIDER/RETRY:
ANALYTICS_RECONCILIATION:
LEGAL/PROVIDER_GATE:
ROLLBACK_VERSION_AND_REHEARSAL:
DECISION (ACCEPT / REWORK):
REVIEWER:
UTC_COMPLETED_AT:
```

## 9. Decision on 23 October 2026

**HOLD PRODUCTION CUTOVER.** Source repair PR #8 and the template PR #7 do not authorise SQL, Edge deployment, secrets, marketing publication or live form submissions. Next safe package: independently approve the diff, freeze a reviewed SHA, perform *read-only* schema/permissions/egress/proxy checks, rehearse recovery and request an exact bounded cutover gate.
