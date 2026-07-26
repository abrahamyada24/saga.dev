# SagaMenu Vercel Prototype Deployment

Date: 27 July 2026
Status: `DEPLOYED_PROTOTYPE_READY`
Product boundary: static interactive review artifact, not the Laravel SaaS runtime

## Deployment

- Stable review URL: `https://sagamenu-prototype-review.vercel.app`
- Vercel project: `sagamenu-prototype-review`
- Project ID: `prj_fnhuPOgIhoonBXI4FUzVw3BqY7sY`
- Latest deployment ID: `dpl_7SFHz6XWrk5WjFWQRuzyJqKbLZjM`
- Latest immutable deployment URL: `https://sagamenu-prototype-review-gn3a6lsg8-andreas-projects16.vercel.app`
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

## Sprint 2 Create and Edit Update

The production prototype was updated on 2026-07-26 with:

- A dedicated four-step create wizard.
- A focused single-page edit workspace without a repeated stepper or review step.
- Section navigation for Information, Photo, and Choices.
- A create-only `Buat & tambah lagi` workflow.
- A single primary `Simpan perubahan` action for edit.
- Separate mobile footer arrangements for create and edit.
- Reliable autosave, guarded close, validation focus, and scroll reset.

Focused Sprint 2 E2E, Sprint 0 regression, Sprint 1 regression, and the full prototype E2E passed locally and against the stable Vercel review URL with zero console and page errors. Full evidence is recorded in `docs/sagamenu-sprint-2-create-edit-separation-report-2026-07-26.md`.

## Sprints 3-8 Complete Wizard Wave

The production review prototype was updated on 27 July 2026 with:

- Visual Media Library with upload, alt text, focal point, gallery, usage, search/filter, and safe remove.
- Variant groups, price deltas, add-on ordering, food facts, and public-detail parity.
- Category, add-on, and media side sheets with usage impact and delete protection.
- Four-part catalog setup and surface-confirmed publish with safe failure and retry.
- Brand Kit with logo, colors, contrast, WOFF/WOFF2 validation, license gate, radius, and image treatment.
- Independent Bio and Store presets with migration fallback.

Sprint 0, Sprint 1, Sprint 2, the complete-wave E2E, and full prototype E2E all passed against the stable Vercel review URL. There were no console errors, page errors, horizontal overflow, or unnamed buttons. Full evidence and the manual review sequence are recorded in:

- `docs/sagamenu-sprints-3-8-complete-wave-report-2026-07-27.md`
- `docs/sagamenu-prototype-review-step-by-step-2026-07-27.md`

## Review Checklist

1. Open the stable review URL and click `Reset demo`.
2. Review Ringkasan, Media Library, and sidebar structure.
3. Create a basic menu through the four-step wizard.
4. Edit a menu through the focused single-page workspace.
5. Add a gallery image, variant, add-on, and food details.
6. Review safe delete in Media Library, Category, and Add-on.
7. Complete the guided catalog setup.
8. Change Brand Kit and separate Bio/Store presets.
9. Open Bio Menu and Store Display previews.
10. Open a menu detail and inspect variants/add-ons.
11. Test publish surface blocking, safe failure, and retry.
12. Review at 390 px and reset the browser demo when finished.

## Boundary

The deployment uses static HTML, CSS, JavaScript, demo content, and `localStorage`. It does not prove Laravel hosting, persistent multi-tenant storage, central identity, subscription enforcement, payment, upload storage, queue processing, or Saga Platform sandbox integration. Those remain separate release gates for the VPS/Laravel implementation.
