const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function fixture(host = 'id-preview--ff1ee944-2315-457f-8a97-db2703924b0c.lovable.app') {
  const values = new Map();
  const localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
  const listeners = new Set();
  const requests = [];
  const window = {
    parent: { postMessage: message => requests.push(message) },
    addEventListener: (_, handler) => listeners.add(handler),
    removeEventListener: (_, handler) => listeners.delete(handler),
  };
  const source = fs.readFileSync('src/integrations/supabase/previewAuthStorage.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {}, window, location: { hostname: host, ancestorOrigins: ['https://lovable.dev'] }, document: { referrer: '' }, localStorage, setTimeout, clearTimeout, URL, Math, Date };
  vm.runInNewContext(compiled, context);
  return {
    storage: context.exports.brokeredPreviewStorage(), localStorage,
    reply(value, ok = true) {
      const request = requests.shift();
      assert.ok(request, 'request must be sent to the broker');
      for (const handler of [...listeners]) handler({ origin: 'https://lovable.dev', data: { type: 'lovable-preview-auth:result', requestId: request.requestId, ok, value } });
    },
  };
}

test('accepted broker session replaces the pending local session', async () => {
  const f = fixture(); const pending = f.storage.setItem('session', 'old');
  f.reply('accepted'); await pending;
  assert.equal(f.localStorage.getItem('session'), 'accepted');
});
test('broker logout tombstone clears the pending local session', async () => {
  const f = fixture(); const pending = f.storage.setItem('session', 'old');
  f.reply(''); await pending;
  assert.equal(f.localStorage.getItem('session'), null);
});
test('delayed acknowledgement preserves a newer local session', async () => {
  const f = fixture(); const pending = f.storage.setItem('session', 'old');
  f.localStorage.setItem('session', 'new'); f.reply('accepted'); await pending;
  assert.equal(f.localStorage.getItem('session'), 'new');
});
test('delayed acknowledgement cannot resurrect a local logout', async () => {
  const f = fixture(); const pending = f.storage.setItem('session', 'old');
  f.localStorage.removeItem('session'); f.reply('accepted'); await pending;
  assert.equal(f.localStorage.getItem('session'), null);
});
test('failed acknowledgement keeps the local fallback', async () => {
  const f = fixture(); const pending = f.storage.setItem('session', 'old');
  f.reply('replacement', false); await pending;
  assert.equal(f.localStorage.getItem('session'), 'old');
});
test('custom-domain production uses localStorage directly', () => {
  const f = fixture('itsfeierabend.ch');
  assert.equal(f.storage, f.localStorage);
});
