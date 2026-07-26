# SagaMenu Vercel Prototype Deployment

Date: 26 July 2026
Status: `DEPLOYED_PROTOTYPE_READY`
Product boundary: static interactive review artifact, not the Laravel SaaS runtime

## Deployment

- Stable review URL: `https://sagamenu-prototype-review.vercel.app`
- Vercel project: `sagamenu-prototype-review`
- Project ID: `prj_fnhuPOgIhoonBXI4FUzVw3BqY7sY`
- Latest deployment ID: `dpl_BnA6cjV9uuQiaS9Rd4CcwBA5bmsC`
- Latest immutable deployment URL: `https://sagamenu-prototype-review-m65fyxk9j-andreas-projects16.vercel.app`
- Vercel target: `production`
- Vercel state: `READY`
- Source branch: `codex/sagamenu-wave2-sprint22`
- Local baseline commit: `0276c69c3aaa9a9c5b8547a27f2e9e0093513356`
- Editorial KV Ops source is committed locally at the final implementation gate. It is not pushed or merged.

No custom domain, customer data, Saga Platform credential, payment credential, or live database was attached.

## Prototype Features

- Editorial KV Ops operational owner dashboard.
- Menu list, search, category filter, status filter, create, edit, delete, and sold-out toggle.
- Category add, edit, visibility, and ordering controls.
- Add-on group add, edit, and delete.
- Editorial KV preset, custom color controls, and browser-session font preview.
- Draft indicator and publish version simulation.
- Bio Menu mobile preview.
- Store Display tablet preview with categories above the menu.
- Menu detail with photo, description, serving variants, add-ons, and allergen information.
- Promo highlight.
- QR and copy-link simulation.
- Maintenance mode.
- Aggregate analytics demo.
- Browser-local reset.
- ImageGen 2 story, empty, success, maintenance, and safe-error assets.

## Verification Evidence

Local and deployed browser QA both passed:

- Initial menu rows: 12.
- Rows after create flow: 13.
- Maintenance state: visible.
- Menu detail: visible.
- Tablet cards: 14.
- Loaded tablet images: 14.
- Desktop and mobile horizontal overflow: none.
- Mobile navigation: passed.
- Console errors: none.
- Page errors: none.
- Publish simulation: passed.
- ImageGen runtime assets: loaded.
- Buttons without accessible names: none.

Vercel evidence:

- Build completed successfully.
- Build error-only scan contained no error.
- Runtime error/fatal scan for the final deployment returned no logs.
- Root URL returned HTTP 200.
- `Content-Security-Policy` present.
- `X-Frame-Options: SAMEORIGIN`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.

Detailed implementation and QA report: `docs/sagamenu-editorial-kv-ops-implementation-report-2026-07-26.md`.

## Review Checklist

1. Open the stable review URL.
2. Review Ringkasan and sidebar structure.
3. Add or edit a menu from Menu.
4. Toggle one menu to Sold out.
5. Add or hide a category.
6. Review add-on information.
7. Change preset and colors from Tampilan.
8. Open Bio Menu and Store Display previews.
9. Open a menu detail and inspect variants/add-ons.
10. Enable Maintenance mode from Publish & Share.
11. Disable Maintenance mode and publish the draft.
12. Reset the browser demo when finished.

## Boundary

The deployment uses static HTML, CSS, JavaScript, demo content, and `localStorage`. It does not prove Laravel hosting, persistent multi-tenant storage, central identity, subscription enforcement, payment, upload storage, queue processing, or Saga Platform sandbox integration. Those remain separate release gates for the VPS/Laravel implementation.
