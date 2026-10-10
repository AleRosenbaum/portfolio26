# Portfolio — Ale Rosenbaum

Personal portfolio site for Ale Rosenbaum, Senior Product Designer at Marktplaats (Amsterdam).

## Structure

Plain HTML/CSS/JS. No framework. Four pages plus an internal design system page:

- `index.html` — main SPA. JS `go()` function swaps between Home and Contact views. Nav hides on home. Opening `index.html#contact` lands on the Contact view.
- `brenger.html` — password gate for the Brenger case study ("Integrating Brenger into Marktplaats").
- `offers.html` — password gate for the Structured Offers case study ("From Silence to Structured Offers").
- `quaddro.html` — the Quaddro case study ("Designing for the Wrong Market"). Public, not password gated, and not yet linked from the home grid.
- `design-system.html`: internal reference that renders every token in `tokens.css` live (colors, fonts, type scale, line heights, spacing, radii, layout). Reachable only by URL: not linked anywhere and marked `noindex`. It parses `tokens.css` at load time, so it never needs editing when tokens change. Keep the `/* ─── Group ─── */` headings and trailing `/* note */` comments in `tokens.css`, because the page uses them for grouping and descriptions.

## Shared navigation and footer

`sticky-header.css/js` and `site-footer.css/js` are injected on every page. Both scripts own their element outright, so a page must not define its own `<nav>` or `<footer>`:

- `sticky-header.js` appends the floating pill nav and, by default, shows it from the first fold. `index.html` opts out with `<body data-floating-nav="scroll">`, which reveals the nav only once the hero scrolls past (`[data-sticky-header-trigger]`, then `.hero`, then the first `figure`) or the Contact view opens. When the nav is always on, the body gets `.floating-nav-always` and 56px of top padding to clear the fixed bar.
- The script also removes any `<nav>` whose text contains "Case study". The case pages used to carry their own static bar, and the already-encrypted gate payloads still do.
- `site-footer.js` removes any existing `<footer>` before appending the shared dark one.

The gate pages inject all four files into the decrypted payload at runtime.

## Case study password wall

The case pages are AES-256-GCM encrypted (staticrypt-style). The real pages live in `_src/` (not served by GitHub Pages because Jekyll skips underscore directories — do NOT add a `.nojekyll` file). The public `brenger.html` / `offers.html` are generated gate pages: a styled password form plus the encrypted payload; WebCrypto (PBKDF2, 600K iterations) decrypts and `document.write`s the real page on the correct password. The password is kept in `sessionStorage` so unlocking one case unlocks both for the session.

**After editing anything in `_src/`, regenerate the gates:** `node encrypt-cases.mjs <password>`. It also runs `stamp-assets.mjs`.

**After editing `tokens.css`, `sticky-header.*` or `site-footer.*`, run `node stamp-assets.mjs`** (or the encrypt script). Pages link these files with a content hash (`/tokens.css?v=1a2b3c4d`); GitHub Pages lets browsers cache them for 10 minutes, and without a new hash a browser can pair new HTML with an old stylesheet and break the layout. The password itself is never committed. Caveats: case imagery (`offers/`, `brenger-hero.png`) is not encrypted and stays publicly fetchable by URL; both case pages share one password.

Both case pages use the editorial case-study layout: a 680px centered reading column, 68rem containers for wide imagery, full-bleed hero, white statement bands, orange stat numbers, and scroll-reveal animations (vanilla JS). Sections are styled inline; tokens come from `tokens.css` and shared roles (`.heading-mixed`, `.label`, `.mark`, `.bold`) live in the page's style block. Brenger imagery lives in `brenger/`; Offers imagery lives in `offers/`.

## Design system

All tokens live in `tokens.css`, linked by every page (home, case sources, Quaddro, the gate template in `encrypt-cases.mjs`) before `sticky-header.css` and `site-footer.css`. Never redefine a token inside a page; add it to `tokens.css`.

- **Colors:** warm gray scale `--gray00` to `--gray40` (32° hue), accent `--site-color: #ff7006`, plus semantic tokens (`--text-color`, `--meta-color`, `--wash-color`, `--ink-surface`, `--on-ink`, `--success-color`, `--error-color`, glass and scrim overlays). No raw hex or rgba in pages.
- **Font:** Instrument Sans only (`--font-sans`), weights 400, 500, 600 and 700 from Google Fonts. No serif and no italic anywhere.
- **Weights:** `--fw-regular` (400), `--fw-medium` (500), `--fw-bold` (600). Emphasis is always bold: `<em>` renders as `--fw-bold` and `.bold` does the same for whole elements. Never use `font-style: italic`.
- **Type scale:** six roles named after web conventions. `--fs-h1` (40 to 64px, page titles), `--fs-h2` (32 to 48px, statements and big numbers), `--fs-h3` (24 to 32px, section headings), `--fs-large` (20px), `--fs-base` (16px), `--fs-small` (12px). Headings are fluid with `clamp()`. Never use a raw font size; pick a role. The heading tag sets its size: `tokens.css` styles every `<h1>`, `<h2>` and `<h3>` with the matching role, so never put a font size on a heading tag. A non-heading element that borrows a heading size must also set the matching line height. Each page has exactly one `<h1>` (on the home page it is the bio).
- **Line heights:** `--lh-heading` (1.1) for h1 and h2, `--lh-ui` (1.2) for h3 and single line UI, `--lh-body` (1.5) for large, base and small.
- **Spacing:** 8px grid. Use `--space-1` (8px) to `--space-20` (160px). Literal values in inline styles must also be multiples of 8px.
- **Radii:** `--radius-s` 8px, `--radius-m` 16px, `--radius-l` 24px, `--radius-xl` 32px, `--radius-pill`.
- **No dark mode** (removed intentionally).

## Layout

One shared column, defined in `tokens.css`: `--measure` (680px), `--column` (defaults to `--measure`), `--gutter` (24px) and `--column-box` (a container of `--column` plus both gutters). The floating nav, the hero, the body text and the footer all line up to the column edges on every page. Text containers use `max-width: var(--column-box); margin: 0 auto; padding: 0 var(--gutter)` (or `1.5rem`, the same value).

- **Home is the only wide page.** `index.html` sets `--inset` (120px desktop, 80px tablet at 64em, 24px mobile at 50em) and widens `--column` to `calc(100% - 2 * var(--inset))`, so the nav and footer follow the home edges. The contact view keeps its text at `--measure`, left aligned to the same edge.
- Case studies may break out of the column only for imagery: full-bleed hero images and `--container-max` (68rem) image grids.

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
