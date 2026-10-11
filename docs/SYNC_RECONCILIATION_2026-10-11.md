# Lovable / main reconciliation candidate — 11 October 2026

Status: draft technical integration; NOT approval to merge, publish, migrate or switch the product line.

## Exact inputs

- main: 1ad59bdd8169ac911a5e04e59ebe1ed998686741
- exported Lovable branch lovable-sync-1791691255: c16331cb3144d12033c07fd875d15068f8624ea1
- actual Lovable project ff1ee944-2315-457f-8a97-db2703924b0c: a0b808213e6c1dd7270c457ba68624a72f1fd5ab
- accepted September product branch lovable-sync: 37d56dca40b75ff1a0087c50f9d8562abdd80d16

Export branch is 18 ahead / 13 behind main. Direct tree replacement changes 158 files and removes launch QA, hosting contracts and security migrations. This candidate is a real two-parent merge preserving both histories, not tree replacement.

## Conflict decisions

- index.html: retain main metadata, audit positioning and dedicated absolute OG image; main already provides the absolute-image fix.
- SEOHead.tsx: retain main canonical/title/robots/schema handling and absolute OG resolution, rather than reduce it to the earlier Lovable implementation.
- .lovable/plan.md: retain main plan; deletion would discard launch decisions. Imported September findings remain dated historical evidence, not current database truth.
- ServicesSection.tsx: retain Lovable file with its accessible service link changes as an unused component. Do not remount it or change public routes. Full original blob remains in the second parent.

Nonconflicting preview storage/client and August RLS migration are retained. One source lint repair moves the single timer initialization before message listener registration; request cleanup and timeout behavior are preserved. Migration is source only: no SQL or production operation was performed.

CaseStudiesPage has no merge delta: main already contains its own claim-safe audit-methodology page. Exported PR5 case content remains available in the second parent, but is not silently selected over main. This candidate therefore preserves the main launch product. The September lovable-sync product is a separate, accepted line with runtime fixes absent from the export. This PR alone does not reconcile that separate line, select the live product or authorize a cutover.

## Checks and remaining gates

Fresh npm ci succeeded with the main manifest/lock. Root npm typecheck passed; actual app TypeScript and lint are checked separately. First lint found one prefer-const error in imported generated storage; repaired. Normal production build succeeded and generated static route entrypoints, but the inherited MCP Vite plugin rewrote its generated Edge file on Windows. That incidental local output was restored to the unchanged tracked source and is excluded from the PR.

CI and browser checks must be read from the final exact PR head. Database/RLS application order and runtime compatibility are not established by a frontend build. The August migration changes policy/function grants and requires review against the target database before any application.

Asana task 1216904337568819 reported a separate release writer with lease until 05:30 UTC or terminal, publication in progress. This run makes no Lovable, sync-ref, main, auth, settings or database mutation and does not take over that writer. Git integration occurs only on a separate new branch.

Human gate: final exact-head review and explicit main-merge authorization. Main merge is not Lovable publication approval. Actual Lovable a0b and export c163 remain distinct; connector has no supported import/ref selector according to the current Asana receipt. Recheck project/head after any authorized merge before declaring sync repaired.
