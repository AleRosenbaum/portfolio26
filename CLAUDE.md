# Portfolio — Ale Rosenbaum

Personal portfolio site for Ale Rosenbaum, Senior Product Designer at Marktplaats (Amsterdam).

## Structure

Plain HTML/CSS/JS. No framework, no build step. Three pages:

- `index.html` — main SPA. JS `go()` function swaps between Home and Contact views. Nav hides on home. Opening `index.html#contact` lands on the Contact view.
- `brenger.html` — case study page for the Brenger × Marktplaats project.
- `offers.html` — case study page for Structured Offers ("From Silence to Structured Offers"). Editorial layout with full-bleed hero, white statement bands, scroll-reveal animations (vanilla JS), and orange stat numbers. Images live in `offers/`.

## Design system

- **Colors:** warm gray palette via HSL tokens (`--gray00` through `--gray40`), accent `--site-color: #ff7006`
- **Fonts:** Instrument Serif (display/italic accents) + Spectral (body serif), loaded from Google Fonts
- **Spacing:** 8px grid. All spacing values must be multiples of 8px.
- **Type scale:** three line-heights: `1.1` (headings), `1.2` (large UI), `1.5` (body/lists). Font sizes in rem on 8px grid.
- **No dark mode** — removed intentionally.

## Layout

- `index.html` uses a 3-column CSS grid (`--grid-spec`) for the nav and contact page. Home content is full-width with fixed horizontal padding: `120px` desktop / `80px` tablet (max-width: 64em) / `24px` mobile (max-width: 50em).
- `brenger.html` uses the simplified Medium-style layout: `.col` is `max-width: 680px; margin-inline: auto; padding-inline: 20px`. `.wide` is `max-width: 68rem` with same padding.

## Home page sections

1. **Hero** — name (2rem), bio (3rem), then two columns: Experience list + Links list
2. **Cases grid** — 2×2 CSS grid, `gap: 40px`. Each card: square 1:1 thumbnail with `border-radius: 16px`, then logo (40×40px, `border-radius: 8px`, drop shadow) + title + description.

## Cases

| Card | Image | Icon | Links to |
|---|---|---|---|
| Brenger (last-mile logistics) | `brenger-hero.png` | `brenger-icon.png` | `brenger.html` |
| Structured Offers | `offers-hero.png` | `brenger-icon.png` (placeholder) | `offers.html` |
| DHL Shipping | `dhl-hero.png` | `brenger-icon.png` (placeholder) | not linked yet |

## Assets

- `brenger-hero.png` — hero photo used in both the card and the case page
- `brenger-icon.png` — Brenger app icon (orange circle with chevron)
- `brenger-card.png` — unused, kept for reference
- `marktplaats-icon.png` — Marktplaats app icon (downloaded, not yet in use)
- `offers-hero.png` — two phones showing offer/counter-offer UI
- `dhl-hero.png` — phone with DHL van in Amsterdam background
- `offers/` — all imagery for the Structured Offers case page (hero, research shots, Miro boards, prototypes, offer-card SVGs, buyer/seller flow GIFs)

## Writing style

- No em dashes (`—`). Rewrite sentences naturally instead.
- English for case titles and descriptions. Portuguese only in the contact form (legacy, leave as-is).
- Tone: direct, professional, no fluff.

## Owner

Ale Rosenbaum — Senior Product Designer, Marktplaats, Amsterdam. Background in product design since 2017 (Brazil → Netherlands). Interested in AI as a design material.
