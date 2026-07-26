# SagaMenu Sprint 1 Action Hierarchy Report

Date: 2026-07-26
Scope: Static Vercel prototype action hierarchy
Source branch: `codex/sagamenu-wave2-sprint22`
Starting commit: `e4ca37c183bf8c647d572197fbca4a17b31f1984`

## Objective

Sprint 1 removes competing preview, publish, save, and item-row actions while preserving the fast operational workflows needed by restaurant and coffee-shop operators.

## Product Decisions

### Global Actions

- One global preview entry: `Preview menu`.
- The preview launcher offers `Bio Menu` and `Store Display`.
- One global publication entry: `Tinjau & terbitkan`.
- The global publication label becomes `Publikasi` when no draft is waiting.
- Final publication still happens only from the readiness screen.

### Page Actions

- Ringkasan keeps `Tambah menu` as its contextual primary action.
- Menu keeps `Tambah menu` as its only page-head action.
- Duplicate preview and publish buttons were removed from the Ringkasan header.
- The duplicate publish CTA was removed from the publication metadata rail.
- The draft attention row is now informational instead of another publish entry.

### Menu Row Actions

- Availability remains visible because it is a frequent operational action.
- Edit remains visible because it is the primary item action.
- Duplicate and delete move into `Aksi lainnya`.
- Delete receives destructive styling and keeps confirmation.
- Overflow menus close on outside click and Escape.
- Focus returns to the overflow trigger after Escape.
- Only one overflow menu can remain open.
- Bottom rows open the popover upward.

### Terminology

- Visible Indonesian UI uses `terbitkan`, `diterbitkan`, and `penerbitan`.
- The sidebar and page heading now use `Preview & Terbitkan`.
- Create/edit terminology from Sprint 0 remains unchanged.

## Accessibility

- Global preview and publication actions have stable `aria-label` values on mobile, where visible text is intentionally collapsed.
- The preview launcher uses menu semantics, initial focus, Arrow Up/Down, Home/End, and Escape.
- Overflow triggers have item-specific accessible names.
- Duplicate and delete menu items retain item-specific accessible names.

## Responsive Behavior

- Global actions remain accessible at 390 px.
- The preview launcher stays within the viewport.
- The launcher option copy remains visible on mobile.
- No document-level horizontal overflow was introduced.
- Route changes reset the workspace to the top.

## Automated Evidence

### Sprint 1 focused E2E

Command: `npm.cmd run qa:sprint1`
Result: passed twice consecutively.

Verified:

- Exactly one global preview and publish entry.
- No duplicate preview or publish action in Ringkasan page-head.
- Preview launcher mouse and keyboard behavior.
- Bio Menu preview opening.
- Route scroll reset.
- Menu page-head action hierarchy.
- Quick status and edit actions.
- Hidden duplicate/delete before overflow opens.
- Duplicate and delete functionality.
- Outside-click and Escape dismissal.
- Bottom-row popover direction.
- Mobile accessible names and viewport bounds.
- Zero console and page errors.

### Reliability regression

Command: `npm.cmd run qa:sprint0`
Result: passed.

### Full prototype E2E

Command: `node scripts/qa.mjs`
Result: passed.

### Static action scan

Command: `npm.cmd run check`
Result: passed, 49 explicit actions checked.

### Laravel regression

Command: `php artisan test`
Result: 62 tests passed, 436 assertions.

### Formatting

Command: `vendor\bin\pint.bat --test`
Result: passed.

## Production Prototype Deployment

- Deployment ID: `dpl_HcL56buMZ43meauieryx6ZbfZUbJ`
- Immutable URL: `https://sagamenu-prototype-review-cuyq2xp5e-andreas-projects16.vercel.app`
- Stable review URL: `https://sagamenu-prototype-review.vercel.app`
- Vercel target: `production`
- Vercel state: `READY`

Post-deployment verification against the stable review URL:

- Sprint 1 focused E2E: passed.
- Sprint 0 reliability regression: passed.
- Full prototype E2E: passed.
- Console errors: none.
- Page errors: none.

## Acceptance Gates

| Gate | Result |
| --- | --- |
| One global preview entry | PASS |
| One global publication entry | PASS |
| Contextual page actions remain clear | PASS |
| Destructive actions are visually separated | PASS |
| Overflow actions work with mouse and keyboard | PASS |
| Desktop and mobile hierarchy remain usable | PASS |
| Sprint 0 reliability remains intact | PASS |
| Full Laravel regression remains green | PASS |
| Production prototype deployment and live QA | PASS |

## Deferred

- Dedicated create wizard.
- Focused single-page edit experience.
- Quick edit for price and availability.
- Mobile item cards replacing the horizontal table.
- Nested category/add-on dialog redesign.
- Undo-based delete.

## Release Boundary

This report verifies the static prototype and local Laravel regression. It does not make the Laravel/Saga Platform integration staging-ready or production-ready.
