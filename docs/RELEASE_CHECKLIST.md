# Free Audit — Public Beta Release Checklist

## Environment variables (all runtime secrets)

| Name | Where | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Edge Functions | Cloud project URL (auto) |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Server writes to `audit_requests` / `audit_events` |
| `SUPABASE_ANON_KEY` | Edge Functions | Exact public bearer accepted by the legacy scanner only during the bounded cutover window |
| `SUPABASE_PUBLISHABLE_KEY` | Edge Functions | Alternate public key accepted by the transitional scanner guard |
| `LEGACY_PUBLIC_SCANNER_ENABLED` | Edge Functions | Set to `true` only for the bounded cutover window while `AnalysisRequestForm` still calls `business-scanner` from the browser; default/absent is fail-closed |
| `IP_HASH_SALT` | Edge Functions | Secret random value of at least 32 characters; required for keyed, rotatable IP pseudonyms |
| `LOVABLE_API_KEY` | Edge Functions | Semrush gateway auth |
| `SEMRUSH_API_KEY` | Edge Functions | Semrush connection key (managed by connector) |
| `TURNSTILE_SECRET_KEY` | Edge Functions | Cloudflare Turnstile server-side verify. **Required for beta** — when unset, bot check fails open. |
| `VITE_TURNSTILE_SITE_KEY` | Vite build (`.env`) | Public site key rendered in the audit form widget |
| `AUDIT_LIMIT_PER_IP_DAILY` | Edge Functions (optional) | Default `5` fresh audits per IP per 24h |
| `AUDIT_LIMIT_GLOBAL_DAILY` | Edge Functions (optional) | Default `200` fresh audits site-wide per 24h |
| `AUDIT_DOMAIN_COOLDOWN_DAYS` | Edge Functions (optional) | Default `30` days between fresh audits per normalised domain |
| `SEMRUSH_DAILY_FRESH_LIMIT` | Edge Functions (optional) | Daily budget for fresh Semrush lookups |

## Rate limits (defaults)

- **Per IP:** 5 audits / 24h (`AUDIT_LIMIT_PER_IP_DAILY`)
- **Global:** 200 audits / 24h (`AUDIT_LIMIT_GLOBAL_DAILY`)
- **Per domain:** 1 fresh audit / 30 days (`AUDIT_DOMAIN_COOLDOWN_DAYS`) — subsequent
  submissions are rejected without exposing the existing private report token.
- Enforcement lives in `supabase/functions/_shared/audit-limits.ts` and is backed by
  the `rate_limits` and `audit_requests` tables.

## Fallback behaviour

| Failure | Behaviour |
| --- | --- |
| Turnstile secret missing | Bot check is skipped (fail-open) and logged with `reason=not_configured`. Set the secret before public launch. |
| Bot check fails | Return HTTP 400, log `audit_events.bot_check_failed`, no DB insert. |
| Malformed / private / IP-literal / non-http URL | Return HTTP 400, log `audit_events.url_rejected`, no DB insert. |
| Per-IP / global limit exceeded | Return HTTP 429, log `audit_events.rate_limited`. |
| Domain within 30-day cooldown | Return HTTP 409 without exposing the earlier private report token. Ask the requester to use the original emailed link. Logged as `audit_events.domain_throttled`. |
| SSRF-blocked (private IP, DNS loop, redirect loop) | `fetch-site-signals` returns `{ ctx: null, error, partial: true }`; scoring proceeds with `partial` status. |
| Semrush timeout / quota exceeded / auth error | Enrichment marked `unavailable`; audit still completes with deterministic score. |
| Report generation crash | Row stays in `failed`; user is shown a retry-able state on the report page. |

## Manual test cases (pre-launch smoke)

1. Submit a valid URL → get a private report link → open it in a fresh
   browser → confirm score renders and no PII leaks in URL.
2. Submit `http://localhost/`, `http://127.0.0.1/`, `ftp://foo.com/`, and a
   naked IP `http://1.2.3.4/` → each is rejected with a clear message; a
   row exists in `audit_events` with `event_type='url_rejected'`.
3. Submit the same domain twice in a minute → the second call returns HTTP 409,
   exposes no token, creates no second audit row, and logs a `domain_throttled` event.
4. From the same IP, submit 6 different domains within 24h → the 6th call
   returns HTTP 429 and a `rate_limited` audit event.
5. Submit without the Turnstile widget resolving → server returns
   `bot_check_failed`.
6. Report page: refresh while `status='pending'` → skeleton renders without
   layout shift; polls until `ready`.
7. Report page with `status='failed'` → shows retry state, no crash.
8. `/audit` and `/en/audit` both render, share the same submit endpoint,
   and redirect to the correct language route.
9. `robots.txt` disallows `/analyse/` and `/admin/`; `sitemap.xml` contains
   both DE and EN entries with `hreflang` alternates.
10. Admin/private pages (`/admin/*`, `/analyse/*`) return `<meta name="robots" content="noindex">`.
11. CI (`.github/workflows/ci.yml`) passes install, lint, deno tests,
    production build, and the Playwright audit-flow smoke test.
12. Published site does **not** show the "Edit with Lovable" badge.

## Launch order

1. Link the Supabase CLI to the verified production project and run
   `supabase migration list --linked`. Confirm the remote ledger still ends at
   `20260821200430` and none of the five versions below is already present.
2. Because the three July migrations predate the current remote ledger, preview
   the exact backfill with `supabase db push --linked --include-all --dry-run`.
   The preview must contain only `20260725050000`, `20260725060000`,
   `20260725070000`, `20260910090000`, and `20260923070000`. Any other version
   is a hard stop.
3. Under the exact Human Gate, run
   `supabase db push --linked --include-all` once. Immediately re-read
   `supabase_migrations.schema_migrations`, both RPC signatures and the RLS
   grants. Do not deploy a function if any expected version or RPC is absent.
4. Configure `TURNSTILE_SECRET_KEY`, a random `IP_HASH_SALT` of at least 32
   characters, the public Supabase key available to the Edge runtime,
   `LEGACY_PUBLIC_SCANNER_ENABLED=true` for the compatibility window, and
   `VITE_TURNSTILE_SITE_KEY` for the build.
5. Deploy the Edge Functions and app from one exact reviewed source SHA.
6. Run the manual test cases against the production URL, including a bounded
   browser-origin scanner request that proves the RPC guard path.
7. After the legacy browser caller is removed, unset or set
   `LEGACY_PUBLIC_SCANNER_ENABLED=false`, change `verify_jwt` back to `true` for
   `business-scanner`, `scan-status` and `get-analysis-report`, redeploy those
   three functions, and verify an anonymous request returns HTTP 401 while the
   service-role path remains accepted.
8. Remove the `legacy_v0` request/response branches only after the rollback
   window for the old frontend has closed.
9. Enable analytics dashboards / alerting on `audit_events.rate_limited` and
   `audit_events.bot_check_failed`.
