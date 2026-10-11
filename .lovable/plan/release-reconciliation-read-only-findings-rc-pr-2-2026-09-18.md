# Release Reconciliation — Read-Only Findings (RC PR #2)

No code, database, deployment, secret or permission changes were made. Everything below is observation plus recommendation, clearly separated.

## Headline

The hosted database is currently **paused**, not reactivated. No production migration state could be read, so questions (1) and (2) cannot be answered factually right now. The code-side questions (3) are answered.

## Production facts (observed)

- Backend lifecycle state: **paused / INACTIVE**. Two read attempts against `supabase_migrations.schema_migrations`, one minute apart, both failed: connection pooler unavailable.
- Consequence: applied migration versions, July-launch migration presence, and the `20260910090000` reconciliation migration status are **unknown/unverified** at this moment. Any claim that they are applied or missing would be unsupported.

## Repository facts (observed)

- Current working commit: `6de3fec` ("Work in progress"), clean tree, no uncommitted changes.
- `origin/main`: `7f15b77` ("Fixed failing SEO findings"). Local is **1 commit ahead**, 0 behind.
- The commits named in the request are **not present in this repository**: reviewed PR head `4481f1f5…` and GitHub main `1ad59bdd…` both fail object lookup. Either they live in a fork/PR branch that was never fetched here, or the hashes belong to a different repository.
- Migration files on disk (12 total). July launch set present as files: `20260724193340` (creates `audit_requests`), `20260724193942` (Semrush enrichment columns), `20260724194423` (extends `audit_events` type check). Latest file: `20260821200430`.
- **No `20260910090000` reconciliation migration exists anywhere in the project** — no file, no reference in any source file.

## Interpretation

- The "missing July migrations" question is about the *database*, and the files exist locally; whether they were ever applied to production is exactly what cannot be checked while the database is paused.
- The referenced reconciliation migration does not exist in this codebase. Either it was never merged here, or it lives only on the unfetched PR branch.

## Recommended cutover sequence (not executed)

1. Resume the hosted database from Cloud settings; wait for healthy state.
2. Read applied versions from the migration ledger and diff against the 12 files on disk.
3. Verify the July objects actually exist (`audit_requests` columns incl. `semrush_data`, `audit_events` check constraint, grants and row-level rules on both).
4. Only then decide whether a reconciliation migration is needed, and author it against real observed state rather than the assumed `20260910090000`.
5. Apply during a low-traffic window, re-run the linter and security scan, then publish.

## Blockers requiring Founder approval

- **Resuming the paused database** — required before any of this can be verified; it is a state change, so it is not something to do under a read-only mandate.
- **Access to the PR branch / correct repository** for `4481f1f5…` and `1ad59bdd…`; without it, drift against the reviewed head cannot be measured.
- **Clarification of `20260910090000`** — confirm whether it exists elsewhere or was planned but never written.
- Local `6de3fec` is ahead of `origin/main`; confirm whether that commit is intended to ship.
