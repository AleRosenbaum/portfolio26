// Adds a content hash to every link to a shared asset (tokens, nav, footer),
// e.g. /tokens.css?v=1a2b3c4d. Browsers cache these files for 10 minutes on
// GitHub Pages; a new hash forces a fresh download whenever a file changes, so a
// page never pairs new HTML with an old stylesheet.
// Usage: node stamp-assets.mjs  (encrypt-cases.mjs also runs it first)
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const ASSETS = ['tokens.css', 'sticky-header.css', 'sticky-header.js', 'site-footer.css', 'site-footer.js'];
const PAGES = ['index.html', 'quaddro.html', 'design-system.html', '_src/brenger.html', '_src/offers.html'];

export function stampAssets() {
  const hashes = Object.fromEntries(ASSETS.map((a) => [
    a, createHash('sha256').update(readFileSync(a)).digest('hex').slice(0, 8),
  ]));
  for (const page of PAGES) {
    const before = readFileSync(page, 'utf8');
    let after = before;
    for (const [asset, hash] of Object.entries(hashes)) {
      const name = asset.replace('.', '\\.');
      after = after.replace(new RegExp(`/${name}(\\?v=[0-9a-f]+)?(?=["'])`, 'g'), `/${asset}?v=${hash}`);
    }
    if (after !== before) {
      writeFileSync(page, after);
      console.log(`${page} stamped`);
    }
  }
  return hashes;
}

if (import.meta.url === `file://${process.argv[1]}`) stampAssets();
