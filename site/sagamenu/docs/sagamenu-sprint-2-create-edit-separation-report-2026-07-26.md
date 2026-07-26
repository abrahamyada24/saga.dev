# SagaMenu Sprint 2 Create and Edit Separation Report

Date: 2026-07-26
Scope: Static Vercel prototype menu creation and editing experience
Source branch: `codex/sagamenu-wave2-sprint22`
Starting commit: `9bb69323`

## Objective

Sprint 2 separates two different operator tasks:

- Creating a menu is a guided, progressive workflow.
- Editing a menu is a focused update workflow without repeated onboarding steps.

The implementation preserves the draft, upload, validation, and recovery reliability introduced in Sprint 0 and the action hierarchy introduced in Sprint 1.

## Product Decisions

### Create Wizard

- Keeps four linear steps: Information, Media, Choices, and Review.
- Shows one step at a time.
- Blocks forward navigation until required basic information is valid.
- Keeps `Simpan & lanjut nanti` for unfinished creation.
- Adds `Buat & tambah lagi` for operators entering multiple menus.
- Opens a fresh empty wizard after the current menu is created.
- Keeps a persistent Bio/Store preview and draft-public explanation.

### Focused Edit

- Removes the create stepper and review step.
- Shows Information, Photo, and Choices in one scrollable workspace.
- Adds a compact section navigator.
- Uses the current menu name as the editor title.
- Provides one primary action: `Simpan perubahan`.
- Keeps validation and directs focus to the first invalid field.
- Resets scroll to the Information section on every open.
- Keeps draft recovery per menu ID.

### Responsive Behavior

- Create and edit have separate sticky footer arrangements.
- Mobile edit only exposes `Tutup` and `Simpan perubahan`.
- Mobile section navigation is horizontally scrollable without document overflow.
- Desktop retains the larger live preview rail.
- Both modes remain usable at 390 px without dialog overflow.

## Accessibility

- Create stepper retains `aria-current`.
- Edit section buttons use text and Lucide icons.
- Header close labels identify create or the edited item.
- Validation errors remain connected to their fields.
- Invalid edit submission focuses the first invalid field.
- Mobile actions retain visible text.

## Automated Evidence

### Sprint 2 Focused E2E

Command: `npm.cmd run qa:sprint2`
Result: passed.

Verified:

- Create and edit expose different modes and structures.
- Create has four steps and only one visible panel.
- Create review exposes both finish and add-another actions.
- Add-another creates the item and opens a fresh wizard.
- Edit exposes three work sections without a stepper or review.
- Edit section navigation works.
- Direct edit validation and save work.
- Autosave and guarded-close recovery preserve the latest value.
- Create and edit reopen at the correct state.
- All three mobile review actions remain inside the viewport without overlap.
- Desktop and mobile have no document or editor overflow.
- Console and page errors are empty.

### Regression

- Sprint 0 reliability E2E: passed.
- Sprint 1 action hierarchy E2E: passed.
- Full prototype E2E: passed.
- Static action scan: passed, 50 actions checked.
- Laravel regression: 62 tests passed, 436 assertions.
- Laravel Pint: passed.

## Production Prototype Deployment

- Deployment ID: `dpl_J2cn4uTbcehut3HeN3hPvpXqGqmd`
- Immutable URL: `https://sagamenu-prototype-review-44h2oy3hb-andreas-projects16.vercel.app`
- Stable review URL: `https://sagamenu-prototype-review.vercel.app`
- Vercel target: `production`
- Vercel state: `READY`

Post-deployment verification:

- Sprint 2 focused E2E: passed.
- Sprint 0 reliability regression: passed.
- Sprint 1 action hierarchy regression: passed.
- Full prototype E2E: passed.
- Console errors: none.
- Page errors: none.

## Acceptance Gates

| Gate | Result |
| --- | --- |
| Create and edit use different mental models | PASS |
| Create remains a guided four-step flow | PASS |
| Edit no longer forces a review wizard | PASS |
| Draft recovery remains separate and reliable | PASS |
| Validation returns focus to the problem | PASS |
| Mobile and desktop have no horizontal overflow | PASS |
| Sprint 0 and Sprint 1 regressions remain green | PASS |
| Full Laravel regression remains green | PASS |
| Production prototype deployment and live QA | PASS |

## Deferred

- Quick inline editing from the menu list.
- Undo-based delete.
- Variants and nested add-on builder refinement.
- Mobile item cards replacing the current data table.
- Persistent server-side drafts and production media storage.

## Release Boundary

This sprint verifies the static prototype and local Laravel regression only. The prototype uses browser `localStorage`; it does not make the Laravel/Saga Platform integration staging-ready or production-ready.
