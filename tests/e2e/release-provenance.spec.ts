import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

test('served release identifies the checkout and matches HTML and JavaScript bytes', async ({ request }) => {
  const response = await request.get('/release.json');
  expect(response.status()).toBe(200);
  const manifest = await response.json();
  expect(manifest.repository).toBe('mfeie002-jpg/itsfeierabend.ch');
  expect(manifest.commit).toBe(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim());
  expect(typeof manifest.dirty).toBe('boolean');
  if (process.env.CI) expect(manifest.dirty).toBe(false);
  expect(manifest.files['release.json']).toBeUndefined();
  const entryScripts = Object.keys(manifest.files).filter((path) => /^assets\/index-.*\.js$/.test(path));
  expect(entryScripts.length, 'release must include entry JavaScript').toBeGreaterThan(0);
  for (const path of ['index.html', 'audit/index.html', 'en/audit/index.html',
    ...entryScripts]) {
    expect(manifest.files[path], path).toMatch(/^[a-f0-9]{64}$/);
    const served = await request.get(`/${path}`);
    expect(served.status()).toBe(200);
    expect(createHash('sha256').update(await served.body()).digest('hex')).toBe(manifest.files[path]);
  }
});
