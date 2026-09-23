import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');

test('create-audit preserves the current form contract and uses the atomic RPC', async () => {
  const source = await read('supabase/functions/create-audit/index.ts');

  assert.match(source, /supabase\.rpc\(\s*["']create_audit_with_lead["']/);
  assert.match(source, /p_industry:\s*text\(body\.industry, 120\) \?\? ["']analysis_request["']/);
  assert.match(source, /p_audit_type:\s*text\(body\.audit_type, 80\) \?\? ["']business["']/);
  assert.match(source, /p_consent_version:\s*CURRENT_CONSENT_VERSION/);
  assert.match(source, /p_domain_cooldown_days:\s*LIMITS\.domainCooldownDays/);
  assert.match(source, /domain_recently_audited/);
  assert.doesNotMatch(source, /\.from\(["']audit_requests["']\)\s*\.insert\(/);
  assert.doesNotMatch(source, /recordLimitHits\(/);

  const limits = await read('supabase/functions/_shared/audit-limits.ts');
  assert.doesNotMatch(limits, /select\(["']id, token, status["']\)/);
  assert.doesNotMatch(limits, /existingToken/);
});

test('submit-lead uses the dual public contract without exposing current row ids', async () => {
  const source = await read('supabase/functions/submit-lead/index.ts');

  assert.match(source, /validateAndSanitizeLead\(body\)/);
  assert.match(source, /leadSuccessPayload\(leadInput\.contract, insertedLead\.id\)/);
  assert.match(source, /RATE_LIMIT_SCOPE = ["']lead_form["']/);
  assert.match(source, /supabase\.rpc\(\s*["']reserve_lead_submission["']/);
  assert.match(source, /client_ip_unavailable/);
  assert.match(source, /public_token:\s*null/);
  assert.doesNotMatch(source, /generateToken\(/);
  assert.doesNotMatch(source, /response\.reportUrl/);
  assert.doesNotMatch(source, /lead\.name.*lead\.email/);
  assert.doesNotMatch(source, /from\(["']rate_limits["']\)\s*\.select/);
});

test('public analysis report uses a minimal projection and never logs bearer tokens', async () => {
  const source = await read('supabase/functions/get-analysis-report/index.ts');

  assert.doesNotMatch(source, /\.select\(["']\*["']\)/);
  assert.doesNotMatch(source, /console\.(?:log|error)\([^\n]*token/);
  assert.doesNotMatch(source, /['"](?:lead_id|raw_evidence)['"]/);
  assert.match(source, /['"]Cache-Control['"]:\s*['"]no-store['"]/);
});

test('IP pseudonyms use the configured secret and fail closed without it', async () => {
  const source = await read('supabase/functions/_shared/audit-utils.ts');
  const createAudit = await read('supabase/functions/create-audit/index.ts');

  assert.match(source, /Deno\.env\.get\(["']IP_HASH_SALT["']\)/);
  assert.match(source, /crypto\.subtle\.importKey\(/);
  assert.match(source, /crypto\.subtle\.sign\(/);
  assert.doesNotMatch(source, /itsfeierabend-audit-v0/);
  assert.match(createAudit, /ip_hash_unavailable/);
});

test('business-scanner gates the public compatibility path and claims scans atomically', async () => {
  const source = await read('supabase/functions/business-scanner/index.ts');

  assert.match(source, /LEGACY_PUBLIC_SCANNER_ENABLED/);
  assert.match(source, /resolveTransitionalAuthMode/);
  assert.match(source, /supabase\.rpc\(\s*["']claim_legacy_analysis_scan["']/);
  assert.match(source, /claim\.scan_reused/);
  assert.match(source, /UUID_PATTERN\.test\(leadId\)/);
});

test('generated browser types expose the reconciled schema and both RPCs', async () => {
  const source = await read('src/integrations/supabase/types.ts');

  assert.match(source, /create_audit_with_lead:/);
  assert.match(source, /claim_legacy_analysis_scan:/);
  assert.match(source, /reserve_lead_submission:/);
  assert.match(source, /audit_requests:[\s\S]*lead_id: string \| null/);
  assert.match(source, /leads:[\s\S]*consent_processing: boolean/);
});
