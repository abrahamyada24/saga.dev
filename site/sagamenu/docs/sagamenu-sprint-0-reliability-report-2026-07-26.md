# SagaMenu Sprint 0 Reliability Report

Date: 2026-07-26  
Scope: Static Vercel prototype reliability only  
Source branch: `codex/sagamenu-wave2-sprint22`  
Starting commit: `9413b1a3`

## Objective

Sprint 0 removes false-positive save states from the menu wizard before the create and edit experiences are redesigned in later sprints.

## Delivered

### Upload Reliability

- Uploaded JPG, PNG, and WebP files are compressed to WebP.
- Safe preview sources now allow HTTP/HTTPS URLs and base64 JPEG/PNG/WebP images.
- Arbitrary data MIME types remain rejected.
- Upload completion is persisted before the success status is shown.
- Uploaded images survive create draft recovery and remain visible after the menu is created.

### Draft Reliability

- Create drafts remain stored under the existing create-draft key.
- Edit drafts use a separate localStorage key per menu ID.
- Reopening an edited menu recovers the correct item-specific draft.
- `Simpan & lanjut nanti` persists before closing.
- Closing while an autosave is pending requires confirmation and persists before exit.
- Escape uses the same guarded-close behavior.
- Final create or edit removes only the relevant recovery draft.
- Reset demo removes create and edit recovery drafts.

### Validation and Review

- Required-field validation is now inline and in Indonesian.
- Invalid fields use `aria-invalid` and a visible error summary.
- The review step now covers eight areas: name, category, price, image, description, availability, badge, and choices/information.
- Create and edit use different final CTA copy.
- Mobile keeps `Simpan & lanjut nanti` available instead of hiding the recovery action.

## Security Controls

- File input remains limited to JPG, PNG, and WebP with a 5 MB maximum.
- Data URL allowlisting is limited to base64 JPEG, PNG, and WebP.
- `javascript:`, SVG data payloads, and arbitrary data MIME types fall back to the safe image.
- No token, credential, PII, or customer data was added.

## Automated Evidence

### Prototype static check

Command: `npm.cmd run check`  
Result: passed, all routes, previews, and explicit actions detected.

### Sprint 0 browser acceptance

Command: `npm.cmd run qa:sprint0`  
Result: passed.

Verified:

- Indonesian required-field error and focus behavior.
- Real local image upload and WebP conversion.
- SVG data payload rejection and safe fallback behavior.
- Preview source equals the processed image source.
- Image is decoded and visible after create.
- Create draft recovery.
- Edit draft recovery at `Rp 36.000`.
- Guarded close recovery at `Rp 37.000`.
- Final edit appears in the menu table.
- Eight review rows are present.
- Mobile validation and footer recovery action are visible.
- Zero console errors and zero page errors.

The same suite was rerun against `https://sagamenu-prototype-review.vercel.app` after deployment and passed with the same results.

### Full prototype E2E

Command: `node scripts/qa.mjs`  
Result: passed.

Verified legacy flows including create, duplicate, category protection, appearance, maintenance, public detail, tablet/mobile previews, publish failure, publish success, analytics, responsive overflow, image loading, and button naming.

### Laravel regression

Command: `php artisan test`  
Result: 62 tests passed, 436 assertions.

### Formatting

Command: `vendor\bin\pint.bat --test`  
Result: passed.

## Acceptance Gates

| Gate | Result |
| --- | --- |
| Uploaded image is the image shown and stored | PASS |
| Create draft can be recovered | PASS |
| Edit draft can be recovered per item | PASS |
| Pending changes cannot be silently lost on close | PASS |
| Validation is actionable and Indonesian | PASS |
| Existing prototype flows remain functional | PASS |
| Laravel regression suite remains green | PASS |
| Production prototype deployment is ready and live QA passes | PASS |

## Prototype Deployment

- Target: Vercel production prototype
- Deployment ID: `dpl_3vhq4tbjiCG5bPPPejByUHnGCvyf`
- Deployment state: `READY`
- Review alias: `https://sagamenu-prototype-review.vercel.app`
- Post-deploy Sprint 0 E2E: passed

## Deferred to Later Sprints

- Separate create wizard and focused edit editor.
- Quick edit for price and availability.
- Mobile catalog cards replacing the horizontally scrolling data table.
- Consolidation of duplicate publish and preview actions.
- Replacement of nested category/add-on dialogs.
- Undo-based deletion and richer action menus.

## Rollback

Revert the Sprint 0 changes to `prototype-vercel/app.js`, `index.html`, `styles.css`, the QA scripts, and this documentation. Existing browser data can be reset with `Reset demo`; no server database migration is involved.

## Release Boundary

This report verifies the static prototype and local Laravel regression suite. It does not make the Laravel/Saga Platform integration staging-ready or production-ready.
