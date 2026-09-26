import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { createServer } from '../server.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
async function filesIn(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => entry.isDirectory() ? filesIn(resolve(path, entry.name)) : [resolve(path, entry.name)]));
  return groups.flat();
}
const files = (await filesIn(root)).filter(path => /\.(m?js)$/.test(path));
for (const path of files) {
  execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' });
  const content = await readFile(path, 'utf8');
  for (const match of content.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)) await readFile(resolve(dirname(path), match[1]));
}
console.log(`JavaScript syntax and relative imports: ${files.length} files passed.`);

const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const index = await fetch(base);
  assert.equal(index.status, 200);
  assert.match(await index.text(), /BIRDS EYE/);
  for (const route of ['/styles.css', '/src/main.js', '/assets/favicon.svg']) assert.equal((await fetch(base + route)).status, 200, route);
  for (const route of ['/server.mjs', '/package.json', '/%2e%2e%5cconfig.py', '/src/%2e%2e%5c%2e%2e%5cconfig.py', '/src/missing.js']) assert.equal((await fetch(base + route)).status, 404, route);
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
  const head = await fetch(base, { method: 'HEAD' }); assert.equal(head.status, 200); assert.equal(await head.text(), '');
  console.log('HTTP serving, private-file boundaries, missing files, and method handling passed.');
} finally {
  await new Promise(resolve => server.close(resolve));
}
