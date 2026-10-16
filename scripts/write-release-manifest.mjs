import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
// Require the real checkout identity; do not accept an arbitrary deployment SHA.
const commit = git('rev-parse', 'HEAD');
const dirty = git('status', '--porcelain', '--untracked-files=normal').length > 0;
const files = {};
async function collect(directory, prefix = '') {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) await collect(join(directory, entry.name), `${relative}/`);
    else if (entry.isFile() && relative !== 'release.json') {
      files[relative] = createHash('sha256').update(await readFile(join(directory, entry.name))).digest('hex');
    }
  }
}
await collect(dist);
await writeFile(join(dist, 'release.json'), JSON.stringify({
  schema_version: 1,
  repository: 'mfeie002-jpg/itsfeierabend.ch',
  commit,
  dirty,
  files,
}, null, 2) + '\n');
console.log(`Release manifest: ${commit}${dirty ? ' (working tree has changes)' : ''}; ${Object.keys(files).length} file hashes.`);
