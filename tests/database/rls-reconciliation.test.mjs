import { PGlite } from '@electric-sql/pglite';
import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

// Embedded PostgreSQL: no production URL, credentials, HTTP, or durable rows.
const admin = '00000000-0000-4000-8000-000000000001';
const member = '00000000-0000-4000-8000-000000000002';
const another = '00000000-0000-4000-8000-000000000003';
const migrationDir = new URL('../../supabase/migrations/', import.meta.url);
const repairFile = '20260910090000_reconcile_audit_admin_policy.sql';

for (const history of ['chronological', 'existing-lovable-production']) {
test(`reconciled ${history} history preserves admin-only data access and closes role RPC`, async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  // Supabase-owned objects and default grants, outside the app migrations.
  await db.exec(`
    CREATE ROLE anon;
    CREATE ROLE authenticated;
    CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY);
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    GRANT USAGE ON SCHEMA public, auth TO anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      GRANT ALL ON TABLES TO anon, authenticated, service_role;
    INSERT INTO auth.users (id) VALUES ('${admin}'), ('${member}'), ('${another}');
  `);
  const files = (await readdir(migrationDir)).filter((f) => f.endsWith('.sql')).sort();
  if (history === 'existing-lovable-production') {
    // The live DB already has August hardening but is missing July launch SQL.
    const august = files.findIndex((file) => file.startsWith('20260821'));
    const [hardening] = files.splice(august, 1);
    files.splice(files.findIndex((file) => file.startsWith('20260725050000')), 0, hardening);
  }
  for (const file of files.filter((f) => f !== repairFile)) {
    await db.exec(await readFile(new URL(file, migrationDir), 'utf8'));
  }
  await db.exec(`
    INSERT INTO public.user_roles (user_id, role)
      VALUES ('${admin}', 'admin'), ('${member}', 'user'), ('${another}', 'user');
    INSERT INTO public.leads (language, lead_type, industry, service_area, name, email)
      VALUES ('de', 'free_audit', 'test', 'test', 'Synthetic fixture', 'fixture@example.invalid');
    INSERT INTO public.audit_requests
      (website_url, normalized_domain, first_name, last_name, email)
      VALUES ('https://example.invalid', 'example.invalid', 'Synthetic', 'Fixture', 'fixture@example.invalid');
    INSERT INTO public.analysis_reports (token, site_name)
      VALUES ('synthetic-fixture-only', 'example.invalid');
  `);
  async function asUser(role, id, sql) {
    await db.exec(`SET ROLE ${role}`);
    await db.query("SELECT set_config('request.jwt.claim.sub', $1, false)", [id]);
    try { return await db.query(sql); }
    finally { await db.exec('RESET ROLE'); }
  }
  await t.test('reproduces the cross-branch regression before applying the repair', async () => {
    await assert.rejects(
      asUser('authenticated', admin, 'SELECT id FROM public.audit_requests'),
      /permission denied for function has_role/,
    );
  });
  const repair = await readFile(new URL(repairFile, migrationDir), 'utf8');
  await db.exec(repair);
  await t.test('repair is safe to replay', async () => { await db.exec(repair); });
  await t.test('admin reads leads, legacy reports and new audit requests', async () => {
    for (const table of ['leads', 'analysis_reports', 'audit_requests']) {
      const result = await asUser('authenticated', admin, `SELECT id FROM public.${table}`);
      assert.equal(result.rows.length, 1, table);
    }
  });
  await t.test('non-admin cannot read another user’s records', async () => {
    for (const table of ['leads', 'analysis_reports', 'audit_requests']) {
      const result = await asUser('authenticated', member, `SELECT id FROM public.${table}`);
      assert.equal(result.rows.length, 0, table);
    }
  });
  await t.test('roles are self-readable without recursion or role escalation', async () => {
    const result = await asUser('authenticated', member, 'SELECT user_id, role FROM public.user_roles');
    assert.deepEqual(result.rows, [{ user_id: member, role: 'user' }]);
    await assert.rejects(asUser('authenticated', member,
      `INSERT INTO public.user_roles (user_id, role) VALUES ('${member}', 'admin')`), /row-level security/);
  });
  await t.test('anonymous visitors cannot directly select report or lead rows', async () => {
    for (const table of ['leads', 'analysis_reports']) {
      await assert.rejects(asUser('anon', '', `SELECT id FROM public.${table}`), /permission denied/);
    }
    const result = await asUser('anon', '', 'SELECT id FROM public.audit_requests');
    assert.equal(result.rows.length, 0);
  });
  await t.test('has_role remains inaccessible to Data API users and available to service role', async () => {
    for (const role of ['anon', 'authenticated']) {
      await assert.rejects(asUser(role, member,
        `SELECT public.has_role('${admin}', 'admin')`), /permission denied for function has_role/);
    }
    const result = await asUser('service_role', '',
      `SELECT public.has_role('${admin}', 'admin') AS is_admin`);
    assert.equal(result.rows[0].is_admin, true);
  });
  await t.test('no remaining RLS policy calls the revoked helper', async () => {
    const result = await db.query(`SELECT schemaname, tablename, policyname FROM pg_policies
      WHERE schemaname = 'public' AND (qual LIKE '%has_role%' OR with_check LIKE '%has_role%')`);
    assert.deepEqual(result.rows, []);
  });
});
}
