# SagaMenu Vercel Prototype Deployment

Date: 26 July 2026
Status: `DEPLOYED_PROTOTYPE_READY`
Product boundary: static interactive review artifact, not the Laravel SaaS runtime

## Deployment

- Stable review URL: `https://sagamenu-prototype-review.vercel.app`
- Vercel project: `sagamenu-prototype-review`
- Project ID: `prj_fnhuPOgIhoonBXI4FUzVw3BqY7sY`
- Latest deployment ID: `dpl_HcL56buMZ43meauieryx6ZbfZUbJ`
- Latest immutable deployment URL: `https://sagamenu-prototype-review-cuyq2xp5e-andreas-projects16.vercel.app`
- Vercel target: `production`
- Vercel state: `READY`
- Source branch: `codex/sagamenu-wave2-sprint22`
- Sprint 0 starting commit: `9413b1a30024945b65a17d5f5aa3fe046e283f71`
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

## Sprint 0 Reliability Update

The production prototype was updated on 2026-07-26 with:

- Real WebP upload preview and persistence.
- Separate recovery drafts for create and each edited menu.
- Guarded close behavior for pending changes.
- Indonesian inline validation and error summary.
- Complete eight-part review checklist.
- Distinct create and edit save actions.
- Mobile access to `Simpan & lanjut nanti`.

Focused Sprint 0 E2E passed locally and against the stable Vercel review URL with zero console and page errors. Full evidence is recorded in `docs/sagamenu-sprint-0-reliability-report-2026-07-26.md`.

## Sprint 1 Action Hierarchy Update

The production prototype was updated on 2026-07-26 with:

- One global `Preview menu` launcher for Bio Menu and Store Display.
- One global `Tinjau & terbitkan` entry.
- Contextual `Tambah menu` page actions without duplicate preview or publish buttons.
- Visible availability and edit controls on menu rows.
- Duplicate and delete actions in an accessible overflow menu.
- Consistent Indonesian publication terminology.
- Mobile-safe action labels and preview launcher bounds.

Focused Sprint 1 E2E, Sprint 0 regression, and the full prototype E2E passed locally and against the stable Vercel review URL with zero console and page errors. Full evidence is recorded in `docs/sagamenu-sprint-1-action-hierarchy-report-2026-07-26.md`.

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
