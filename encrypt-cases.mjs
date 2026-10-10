// Encrypts the case-study sources in _src/ into password-gated public pages.
// Usage: node encrypt-cases.mjs <password>
// Run after every edit to _src/brenger.html or _src/offers.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node encrypt-cases.mjs <password>');
  process.exit(1);
}

const ITERATIONS = 600000;

const pages = [
  {
    src: '_src/brenger.html',
    out: 'brenger.html',
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
    title: 'From Silence to Structured Offers · Ale Rosenbaum',
    description: 'How I designed structured offers for Marktplaats, turning silent conversations into clearer negotiations and more successful deals.',
    url: 'https://alerosenbaum.com/offers.html',
    image: 'https://alerosenbaum.com/offers-hero.png',
    imageWidth: 1024,
    imageHeight: 1024,
    imageAlt: 'Two phone screens showing the structured offer and counter-offer experience',
  },
];

function encrypt(plaintext) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return {
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    ct: ct.toString('base64'),
    iter: ITERATIONS,
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
gtag('config', 'G-VXNMWSJCZE');
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-font-smoothing: antialiased; }
body {
  background: var(--wash-color);
  color: var(--text-color);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.gate-nav {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  max-width: var(--container-max);
  width: 100%;
  margin: 0 auto;
  padding: var(--space-3) var(--space-3) 0;
}
.gate-nav a { font-size: var(--fs-16); color: inherit; text-decoration: none; }
.gate-nav a:hover { color: var(--site-color); }
.gate-nav span { font-size: var(--fs-small); color: var(--meta-color); }
.gate-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) var(--space-3);
}
.gate {
  width: 100%;
  max-width: 26rem;
  text-align: center;
}
.gate-label {
  font-size: var(--fs-small);
  color: var(--site-color);
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: uppercase;
  margin-bottom: var(--space-2);
}
.gate h1 {
  font-family: var(--font-heading);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  line-height: var(--lh-heading);
  text-wrap: balance;
  margin-bottom: var(--space-1);
}
.gate p {
  font-size: var(--fs-small);
  color: var(--meta-color);
  margin-bottom: var(--space-4);
}
.gate form { display: flex; flex-direction: column; gap: var(--space-1); }
.gate input {
  font-family: var(--font-sans);
  font-size: var(--fs-16);
  color: var(--text-color);
  background: var(--gray05);
  border: 1px solid var(--hairline-color);
  border-radius: var(--radius-s);
  padding: var(--space-1) var(--space-2);
  outline: none;
  text-align: center;
  transition: border-color .2s;
}
.gate input::placeholder { color: var(--gray20); }
.gate input:focus { border-color: var(--meta-color); }
.gate button {
  font-family: var(--font-sans);
  font-size: var(--fs-16);
  padding: var(--space-1) var(--space-2);
  background: var(--ink-surface);
  color: var(--on-ink);
  border: none;
  border-radius: var(--radius-s);
  cursor: pointer;
  transition: opacity .2s;
}
.gate button:hover { opacity: .8; }
.gate button:disabled { opacity: .5; cursor: wait; }
.gate-error {
  font-size: var(--fs-small);
  color: var(--error-color);
  min-height: 1.5em;
}
.gate-hint {
  font-size: var(--fs-small);
  color: var(--gray20);
  margin-top: var(--space-5);
}
.gate-hint a { color: var(--meta-color); }
</style>
</head>
<body>

<nav class="gate-nav">
  <a href="index.html">Ale Rosenbaum</a>
  <span>Protected case study</span>
</nav>

<div class="gate-wrap">
  <div class="gate">
    <p class="gate-label">Password required</p>
    <h1>This case study is private.</h1>
    <p>Enter the password to view it.</p>
    <form id="gate-form">
      <input type="password" id="gate-pass" placeholder="Password" autocomplete="current-password" autofocus required>
      <button type="submit" id="gate-btn">Unlock</button>
      <div class="gate-error" id="gate-error"></div>
    </form>
    <p class="gate-hint">No password? <a href="mailto:alesrosenbaum@gmail.com">Ask me for access</a>.</p>
  </div>
</div>

<script id="payload" type="application/json">${JSON.stringify(payload)}</script>
<script>
(function () {
  var data = JSON.parse(document.getElementById('payload').textContent);
  var form = document.getElementById('gate-form');
  var input = document.getElementById('gate-pass');
  var btn = document.getElementById('gate-btn');
  var errEl = document.getElementById('gate-error');

  function b64(s) {
    var bin = atob(s);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async function decrypt(pass) {
    var enc = new TextEncoder();
    var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64(data.salt), iterations: data.iter, hash: 'SHA-256' },
      keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(data.iv) }, key, b64(data.ct));
    return new TextDecoder().decode(plain);
  }

  async function unlock(pass, fromStorage) {
    btn.disabled = true;
    errEl.textContent = '';
    try {
      var html = await decrypt(pass);
      sessionStorage.setItem('ale-case-pass', pass);
      if (html.indexOf('/sticky-header.css') === -1) {
        html = html.replace('</head>', '<link rel="stylesheet" href="/sticky-header.css"></head>');
      }
      if (html.indexOf('/sticky-header.js') === -1) {
        var stickyHeaderScript = '<script src="/sticky-header.js"><' + '/script>';
        html = html.replace('</body>', stickyHeaderScript + '</body>');
      }
      if (html.indexOf('/site-footer.css') === -1) {
        html = html.replace('</head>', '<link rel="stylesheet" href="/site-footer.css"></head>');
      }
      if (html.indexOf('/site-footer.js') === -1) {
        var siteFooterScript = '<script src="/site-footer.js"><' + '/script>';
        html = html.replace('</body>', siteFooterScript + '</body>');
      }
      document.open();
      document.write(html);
      document.close();
    } catch (e) {
      btn.disabled = false;
      if (fromStorage) {
        sessionStorage.removeItem('ale-case-pass');
      } else {
        errEl.textContent = 'Wrong password. Try again.';
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
})();
</script>
</body>
</html>
`;
}

for (const page of pages) {
  const plaintext = readFileSync(page.src, 'utf8');
  const payload = encrypt(plaintext);
  writeFileSync(page.out, gatePage(page, payload));
  console.log(`${page.out} written (${(payload.ct.length / 1e3).toFixed(0)} KB payload)`);
}
