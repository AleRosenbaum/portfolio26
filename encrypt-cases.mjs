// Encrypts the case-study sources in _src/ into password-gated public pages.
// Usage: node encrypt-cases.mjs <password> [<password> ...]
// Every password given opens both cases: the page is encrypted once with a
// random content key, and that key is stored once per password.
// Run after every edit to _src/brenger.html or _src/offers.html.
// It first runs stamp-assets.mjs so every page links the current asset versions.
// node encrypt-cases.mjs --gate-only rebuilds only the password page around the
// payload already in brenger.html and offers.html, so the gate itself can change
// without the password. The encrypted case content stays as it was.
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';
import { stampAssets } from './stamp-assets.mjs';

const gateOnly = process.argv[2] === '--gate-only';
const passwords = gateOnly ? [] : process.argv.slice(2);
if (!gateOnly && !passwords.length) {
  console.error('Usage: node encrypt-cases.mjs <password> [<password> ...]  (or --gate-only)');
  process.exit(1);
}
const option = passwords.find((pw) => pw.startsWith('--'));
if (option) {
  console.error(`Unknown option ${option}. Passwords cannot start with "--".`);
  process.exit(1);
}
const ACCESS_EMAIL = 'alesrosenbaum@gmail.com';

const ITERATIONS = 600000;
const v = stampAssets();

const pages = [
  {
    src: '_src/brenger.html',
    out: 'brenger.html',
    caseName: 'Brenger',
    title: 'Integrating Brenger into Marktplaats · Ale Rosenbaum',
    description: "How I turned a large-item shipping gap into Marktplaats's first integrated Brenger delivery flow, built iteratively from chat promotion to checkout.",
    url: 'https://alerosenbaum.com/brenger.html',
    image: 'https://alerosenbaum.com/brenger-hero.png',
    imageWidth: 2080,
    imageHeight: 1170,
    imageAlt: 'Hand holding a phone showing the Brenger shipping flow inside the Marktplaats app',
  },
  {
    src: '_src/offers.html',
    out: 'offers.html',
    caseName: 'Structured Offers',
    title: 'From Silence to Structured Offers · Ale Rosenbaum',
    description: 'How I designed structured offers for Marktplaats, turning silent conversations into clearer negotiations and more successful deals.',
    url: 'https://alerosenbaum.com/offers.html',
    image: 'https://alerosenbaum.com/offers-hero.png',
    imageWidth: 1024,
    imageHeight: 1024,
    imageAlt: 'Two phone screens showing the structured offer and counter-offer experience',
  },
];

function seal(key, data) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(data), cipher.final(), cipher.getAuthTag()]);
  return { iv: iv.toString('base64'), ct: ct.toString('base64') };
}

// The page is sealed once with a random content key. That key is then sealed
// with a key derived from each password, all sharing one salt, so the browser
// runs PBKDF2 once per attempt and tries each slot.
function encrypt(plaintext) {
  const salt = randomBytes(16);
  const contentKey = randomBytes(32);
  const content = seal(contentKey, Buffer.from(plaintext, 'utf8'));
  const keys = passwords.map((pw) => seal(pbkdf2Sync(pw, salt, ITERATIONS, 32, 'sha256'), contentKey));
  return {
    salt: salt.toString('base64'),
    iter: ITERATIONS,
    iv: content.iv,
    ct: content.ct,
    keys,
  };
}

function gatePage(page, payload) {
  const socialMeta = page.description ? `
<meta name="description" content="${page.description}">
<meta name="author" content="Ale Rosenbaum">
<link rel="canonical" href="${page.url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Ale Rosenbaum">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${page.url}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:image" content="${page.image}">
<meta property="og:image:secure_url" content="${page.image}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="${page.imageWidth}">
<meta property="og:image:height" content="${page.imageHeight}">
<meta property="og:image:alt" content="${page.imageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${page.title}">
<meta name="twitter:description" content="${page.description}">
<meta name="twitter:image" content="${page.image}">
<meta name="twitter:image:alt" content="${page.imageAlt}">` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="robots" content="noindex">
<title>${page.title}</title>${socialMeta}
<!-- Google Analytics (GA4). -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VXNMWSJCZE"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
// The gate is not a page view of the case: the case sends that itself once it
// is unlocked. The gate reports case_gate_view and case_unlock events instead.
gtag('config', 'G-VXNMWSJCZE', { send_page_view: false });
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css?v=${v['tokens.css']}">
<link rel="stylesheet" href="/sticky-header.css?v=${v['sticky-header.css']}">
<script src="/sticky-header.js?v=${v['sticky-header.js']}" defer></script>
<link rel="stylesheet" href="/site-footer.css?v=${v['site-footer.css']}">
<script src="/site-footer.js?v=${v['site-footer.js']}" defer></script>
<script src="/analytics.js?v=${v['analytics.js']}" defer></script>
<style>
html { -webkit-font-smoothing: antialiased; }
body {
  margin: 0;
  background: var(--wash-color);
  color: var(--text-color);
  font-family: var(--font-sans);
  font-size: var(--fs-base);
  line-height: var(--lh-body);
  font-feature-settings: "ss02" 1;
}
em { font-style: normal; font-weight: var(--fw-bold); }

/* Same column and header as the case page it unlocks */
.gate {
  max-width: var(--column-box);
  min-height: calc(100vh - 3.5rem);
  margin: 0 auto;
  padding: var(--space-8) var(--gutter) var(--space-12);
}
.label {
  margin: 0 0 var(--space-3);
  color: var(--site-color);
  font-size: var(--fs-small);
  font-weight: var(--fw-medium);
  letter-spacing: .04em;
  text-transform: uppercase;
}
.gate h1 {
  margin: 0 0 var(--space-4);
  text-wrap: pretty;
}
.gate-lede {
  margin: 0 0 var(--space-6);
  color: var(--gray35);
  text-wrap: pretty;
}

/* Form fields as on the home contact form */
.gate-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 26rem;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.field-input {
  font-family: var(--font-sans);
  font-size: var(--fs-base);
  line-height: var(--lh-body);
  color: var(--text-color);
  background: var(--gray05);
  border: 1px solid var(--hairline-color);
  border-radius: var(--radius-s);
  padding: var(--space-1) var(--space-2);
  outline: none;
  -webkit-appearance: none;
  transition: border-color .2s;
}
.field-input::placeholder { color: var(--gray20); }
.field-input:focus { border-color: var(--meta-color); }
.form-submit {
  align-self: flex-start;
  font-family: var(--font-sans);
  font-size: var(--fs-base);
  line-height: var(--lh-body);
  padding: var(--space-1) var(--space-2);
  background: var(--ink-surface);
  color: var(--on-ink);
  border: none;
  border-radius: var(--radius-s);
  cursor: pointer;
  transition: opacity .2s;
}
.form-submit:hover { opacity: .75; }
.form-submit:disabled { opacity: .5; cursor: wait; }
.form-submit:focus-visible { outline: 2px solid var(--site-color); outline-offset: 2px; }
.gate-error {
  min-height: 1.5em;
  margin: 0;
  color: var(--error-color);
  font-size: var(--fs-small);
}
.gate-hint {
  margin: var(--space-3) 0 0;
  color: var(--meta-color);
}
.gate-hint a {
  color: var(--text-color);
  text-decoration-color: var(--site-color);
  text-decoration-thickness: max(.05em, 1px);
}
.gate-hint a:hover { color: var(--hover-color); }
</style>
</head>
<body data-case="${page.out.replace('.html', '')}" data-gate>

<main class="gate">
  <p class="label">Protected case study</p>
  <h1>${page.heading}</h1>
  <p class="gate-lede">This case study is private. Enter the password to read it.</p>
  <form class="gate-form" id="gate-form">
    <label class="visually-hidden" for="gate-pass">Password</label>
    <input class="field-input" type="password" id="gate-pass" placeholder="Password" autocomplete="current-password" autofocus required>
    <button class="form-submit" type="submit" id="gate-btn">Unlock</button>
    <p class="gate-error" id="gate-error" role="alert"></p>
  </form>
  <p class="gate-hint">No password? <a data-track="access_request" href="mailto:${ACCESS_EMAIL}?subject=${encodeURIComponent(`Password for the ${page.caseName} case study`)}">Ask me for access</a>.</p>
</main>

<script id="payload" type="application/json">${JSON.stringify(payload)}</script>
<script>
(function () {
  var data = JSON.parse(document.getElementById('payload').textContent);
  var form = document.getElementById('gate-form');
  var input = document.getElementById('gate-pass');
  var btn = document.getElementById('gate-btn');
  var errEl = document.getElementById('gate-error');
  var caseName = document.body.getAttribute('data-case');

  function b64(s) {
    var bin = atob(s);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async function decrypt(pass) {
    var enc = new TextEncoder();
    var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
    var passKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64(data.salt), iterations: data.iter, hash: 'SHA-256' },
      keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    // One slot per password; the right password opens one of them
    var contentKey = null;
    for (var i = 0; i < data.keys.length && !contentKey; i++) {
      try {
        contentKey = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(data.keys[i].iv) }, passKey, b64(data.keys[i].ct));
      } catch (e) {}
    }
    if (!contentKey) throw new Error('Wrong password');
    var key = await crypto.subtle.importKey('raw', contentKey, 'AES-GCM', false, ['decrypt']);
    var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(data.iv) }, key, b64(data.ct));
    return new TextDecoder().decode(plain);
  }

  async function unlock(pass, fromStorage) {
    btn.disabled = true;
    errEl.textContent = '';
    try {
      var html = await decrypt(pass);
      sessionStorage.setItem('ale-case-pass', pass);
      if (!fromStorage) gtag('event', 'case_unlock', { case_name: caseName });
      if (html.indexOf('/sticky-header.css') === -1) {
        html = html.replace('</head>', '<link rel="stylesheet" href="/sticky-header.css?v=${v['sticky-header.css']}"></head>');
      }
      if (html.indexOf('/sticky-header.js') === -1) {
        var stickyHeaderScript = '<script src="/sticky-header.js?v=${v['sticky-header.js']}"><' + '/script>';
        html = html.replace('</body>', stickyHeaderScript + '</body>');
      }
      if (html.indexOf('/site-footer.css') === -1) {
        html = html.replace('</head>', '<link rel="stylesheet" href="/site-footer.css?v=${v['site-footer.css']}"></head>');
      }
      if (html.indexOf('/site-footer.js') === -1) {
        var siteFooterScript = '<script src="/site-footer.js?v=${v['site-footer.js']}"><' + '/script>';
        html = html.replace('</body>', siteFooterScript + '</body>');
      }
      // gtag.js is already running from the gate and ignores the case's own
      // config, so drop the case's snippet and send its page view from here.
      html = html
        .replace(/<script[^>]*googletagmanager[^>]*><\\/script>/, '')
        .replace(/<script>[^<]*gtag\\('config'[^<]*<\\/script>/, '');
      document.open();
      document.write(html);
      document.close();
      gtag('event', 'page_view', { page_title: document.title, page_location: location.href });
    } catch (e) {
      btn.disabled = false;
      if (fromStorage) {
        sessionStorage.removeItem('ale-case-pass');
      } else {
        errEl.textContent = 'Wrong password. Try again.';
        gtag('event', 'case_unlock_failed', { case_name: caseName });
        input.select();
      }
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) unlock(input.value, false);
  });

  var saved = sessionStorage.getItem('ale-case-pass');
  if (saved) unlock(saved, true);
  else gtag('event', 'case_gate_view', { case_name: caseName });
})();
</script>
</body>
</html>
`;
}

for (const page of pages) {
  const plaintext = readFileSync(page.src, 'utf8');
  // The gate shows the same title as the case page it unlocks
  page.heading = plaintext.slice(plaintext.indexOf('<body')).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1].trim();
  const payload = gateOnly
    ? JSON.parse(readFileSync(page.out, 'utf8').match(/<script id="payload" type="application\/json">([\s\S]*?)<\/script>/)[1])
    : encrypt(plaintext);
  writeFileSync(page.out, gatePage(page, payload));
  console.log(`${page.out} written (${(payload.ct.length / 1e3).toFixed(0)} KB payload${gateOnly ? ', reused' : ''})`);
}
