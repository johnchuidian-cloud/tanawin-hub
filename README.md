# Tanawin Hub

A minimal launcher / home screen for Tanawin Bed & Breakfast. One static
`index.html`, no build step, no backend, no auth — just three brand-styled
cards linking out to each Tanawin app:

- **Finance** — live, links to https://tanawin-expenses.pages.dev/
- **Kitchen** — coming soon (disabled card)
- **Menu** — coming soon (disabled card)

Each app keeps its own login; the hub is a starting point, not single sign-on.

## Hosting

Deployed on Cloudflare Pages from this repo's `main` branch (no framework,
no build command, output directory = repo root). Every push to `main`
publishes automatically.

## When Kitchen / Menu go live

In `index.html`, for each app:

1. Change the wrapping `<div class="card disabled">` to `<a class="card" href="APP_URL">`.
2. Change the icon class from `soon` to `active`.
3. Replace the `<span class="pill">Coming soon</span>` with `<span class="arrow">&rarr;</span>`.

## Logo

The starburst above the "i" in the wordmark is currently a CSS/SVG-drawn
placeholder. Swap it for the real reversed (cream-on-terracotta) logo asset
when available.
