# Tanawin Hub

A minimal launcher / home screen for Tanawin Bed & Breakfast. One static
`index.html`, no build step, no backend, no auth — just three brand-styled
cards linking out to each Tanawin app:

- **Finance** — live, links to https://tanawin-expenses.pages.dev/
- **Kitchen** — live, links to https://tanawin-kitchen.tanawinbnb.workers.dev/
- **Menu** — live, links to https://tanawin-menu.tanawinbnb.workers.dev/staff
  (the staff side; guests reach the menu itself via the QR code at
  https://tanawin-menu.tanawinbnb.workers.dev/)
- **Payroll** — live, links to https://tanawin-payroll.tanawinbnb.workers.dev/
  (PIN-gated; payslip renderer + archive)

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

## Logo & brand

The brand block is the real reversed logo, `assets/tanawin-icon.jpg`, copied
from the Finance repo (`public/tanawin-icon.jpg`). It is a JPG with no
transparency: the page background is `#933212` because that is the exact
background baked into the JPG — change one and you must change the other,
or the logo shows as a visible square.

Accent colors inside the cards use the canonical Finance palette: maroon
`#9A3518`, sand `#FBFAF6` / `#F4F1E7` / `#E8E2D0`, ink `#1F1B16` / `#3F392F` /
`#6E6759`, soft maroon `#CC7459`, cream-on-maroon text `#F1E4D6`.

Favicon / home-screen icons (`assets/icon-192.png`,
`assets/apple-touch-icon.png`) are reused from Finance's PWA icon set.
