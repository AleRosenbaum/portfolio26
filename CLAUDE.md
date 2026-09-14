# Portfolio — Ale Rosenbaum

Personal portfolio site for Ale Rosenbaum, Senior Product Designer at Marktplaats (Amsterdam).

## Structure

Plain HTML/CSS/JS. No framework. Four pages:

- `index.html` — main SPA. JS `go()` function swaps between Home and Contact views. Nav hides on home. Opening `index.html#contact` lands on the Contact view.
- `brenger.html` — password gate for the Brenger case study ("Integrating Brenger into Marktplaats").
- `offers.html` — password gate for the Structured Offers case study ("From Silence to Structured Offers").
- `quaddro.html` — the Quaddro case study ("Designing for the Wrong Market"). Public, not password gated, and not yet linked from the home grid.

## Shared navigation and footer

`sticky-header.css/js` and `site-footer.css/js` are injected on every page. `sticky-header.js` appends a floating pill nav that appears once the hero scrolls past, looking for `[data-sticky-header-trigger]`, then `.hero`, then the first `figure`. `site-footer.js` removes any existing `<footer>` before appending the shared dark one, so a page must not define its own. The floating nav only appears after the trigger scrolls past, so the case pages each keep a static `<nav>` at the very top (name on the left, `Case study · <year>` on the right) to cover the first fold. The gate pages inject all four files into the decrypted payload at runtime.

## Case study password wall

The case pages are AES-256-GCM encrypted (staticrypt-style). The real pages live in `_src/` (not served by GitHub Pages because Jekyll skips underscore directories — do NOT add a `.nojekyll` file). The public `brenger.html` / `offers.html` are generated gate pages: a styled password form plus the encrypted payload; WebCrypto (PBKDF2, 600K iterations) decrypts and `document.write`s the real page on the correct password. The password is kept in `sessionStorage` so unlocking one case unlocks both for the session.

**After editing anything in `_src/`, regenerate the gates:** `node encrypt-cases.mjs <password>`. The password itself is never committed. Caveats: case imagery (`offers/`, `brenger-hero.png`) is not encrypted and stays publicly fetchable by URL; both case pages share one password.

Both case pages use the editorial case-study layout: a 680px centered reading column, 68rem containers for wide imagery, full-bleed hero, white statement bands, orange stat numbers, and scroll-reveal animations (vanilla JS). Sections are styled inline; shared tokens/roles (`.heading-mixed`, `.label`, `.mark`, `.serif-italic`) live in the page's style block. Brenger imagery lives in `brenger/`; Offers imagery lives in `offers/`.

## Design system

- **Colors:** warm gray palette via HSL tokens (`--gray00` through `--gray40`), accent `--site-color: #ff7006`
- **Fonts:** Instrument Serif (display/italic accents) + Spectral (body serif), loaded from Google Fonts
- **Spacing:** 8px grid. All spacing values must be multiples of 8px.
- **Type scale:** three line-heights: `1.1` (headings), `1.2` (large UI), `1.5` (body/lists). Font sizes in rem on 8px grid.
- **No dark mode** — removed intentionally.

## Layout

- `index.html` uses a 3-column CSS grid (`--grid-spec`) for the nav and contact page. Home content is full-width with fixed horizontal padding: `120px` desktop / `80px` tablet (max-width: 64em) / `24px` mobile (max-width: 50em).
- The case studies (`_src/brenger.html`, `_src/offers.html`) use the editorial layout described in the password wall section above.

## Home page sections

1. **Hero** — name (2rem), bio (3rem), then two columns: Experience list + Links list
2. **Cases grid** — 2×2 CSS grid, `gap: 40px`. Each card: square 1:1 thumbnail with `border-radius: 16px`, then logo (40×40px, `border-radius: 8px`, drop shadow) + title + description.

## Cases

| Card | Image | Icon | Links to |
|---|---|---|---|
| Brenger (last-mile logistics) | `brenger-hero.png` | `brenger-icon.png` | `brenger.html` |
| Structured Offers | `offers-hero.png` | `brenger-icon.png` (placeholder) | `offers.html` |
| DHL Shipping | `dhl-hero.png` | `brenger-icon.png` (placeholder) | not linked yet |
| Quaddro (US to Brazil pivot) | `quaddro-hero.png` | `quaddro-logo.jpeg` | `quaddro.html`, not linked yet |

## Assets

- `brenger-hero.png` — hero photo used in both the card and the case page
- `brenger-icon.png` — Brenger app icon (orange circle with chevron)
- `brenger-card.png` — unused, kept for reference
- `brenger/` — Brenger research artifacts and Phase 1–3 product screens
- `marktplaats-icon.png` — Marktplaats app icon (downloaded, not yet in use)
- `offers-hero.png` — two phones showing offer/counter-offer UI
- `dhl-hero.png` — phone with DHL van in Amsterdam background
- `offers/` — all imagery for the Structured Offers case page (hero, research shots, Miro boards, prototypes, offer-card SVGs, buyer/seller flow GIFs)
- `quaddro-hero.png`, `quaddro-logo.jpeg` — Quaddro card and case hero
- `quaddro/` — Quaddro case imagery, cropped out of the original 2022 pitch deck. Eight files: `bizbox-app`, `us-retention`, `csd-matrix`, `research-plan`, `personas`, `research-nuggets`, `mvp-screens`, `quaddro-brazil`. Each `.case-figure` on the page falls back to an on-page export brief if its file is missing, so the page degrades readably rather than breaking.

## Writing style

- No em dashes (`—`). Rewrite sentences naturally instead.
- English for case titles and descriptions. Portuguese only in the contact form (legacy, leave as-is).
- Tone: direct, professional, no fluff.

## Owner

Ale Rosenbaum — Senior Product Designer, Marktplaats, Amsterdam. Background in product design since 2017 (Brazil → Netherlands). Interested in AI as a design material.
