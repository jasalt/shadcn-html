#!/usr/bin/env node
// Source-level guards; the optional Datastar example is exercised in a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? files(name) : [name];
  });
}

const components = files(path.join(root, 'dist/components')).filter(f => f.endsWith('.js'));
test('component initialization never claims the Datastar data-init plugin', () => {
  let guarded = 0;
  for (const file of components) {
    const source = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /\bdata-init\b|\bdataset\s*\.\s*init\b|\bdataset\s*\[\s*['"]init['"]\s*\]/, file);
    if (source.includes('dataset.shadcnInit')) {
      guarded++;
      assert.match(source, /:not\(\[data-shadcn-init\]\)/, file);
      assert.equal(
        (source.match(/dataset\.shadcnInit\s*=/g) || []).length,
        (source.match(/:not\(\[data-shadcn-init\]\)/g) || []).length,
        `${file}: each marker write needs a matching guard`,
      );
    }
  }
  assert.ok(guarded > 0, 'expected guarded interactive components');
});

test('published inline component JS matches the implementation', () => {
  const docs = path.join(root, 'dist/documentation');
  for (const file of files(docs).filter(f => f.endsWith('.html'))) {
    const html = fs.readFileSync(file, 'utf8');
    const link = html.match(/<a\s+href="(\.\.\/components\/[^"]+\.js)"\s+target="_blank"[^>]*>view file<\/a>/);
    const snippet = html.match(/<pre><code class="language-javascript">([\s\S]*?)<\/code><\/pre>/);
    if (!link || !snippet) continue;
    const source = fs.readFileSync(path.resolve(docs, link[1]), 'utf8').trimEnd();
    const encoded = source.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    assert.equal(snippet[1], encoded, `${file}: run node scripts/sync-js-snippets.js`);
  }
});
