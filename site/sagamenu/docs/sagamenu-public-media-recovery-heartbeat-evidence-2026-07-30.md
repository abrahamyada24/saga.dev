# SagaMenu Public Media Recovery Evidence

Date: 2026-07-30 (Asia/Jakarta)

## Status

`IMPLEMENTED_NOT_DEPLOYED`

- Implementation commit: `bff2d75dc33647ba7b88f2366c32dd49cd584797`
- Branch: `codex/sagamenu-public-availability-state`
- Baseline: `5ec840054ecd00b6dd699a303827e20c9ee1c024`
- Scope: public Bio Menu and Store Display media recovery

## Before -> After

- Broken images could leave an unexplained media area -> primary and gallery images now show a branded, accessible fallback.
- A failed video could remain as a dead player -> a clear failure panel now preserves access to menu details.
- Recovery required a page reload -> customer can choose `Coba lagi` and the player returns when media becomes available.
- Video errors were only observed on the `video` element -> errors from both `video` and nested `source` elements are handled.

## Acceptance Evidence

- Real local HTTP 404 video produced `Video belum dapat diputar`.
- Retry produced `Memuat ulang video` and temporarily disabled the retry action.
- A simulated `canplay` event returned the player to the ready state.
- Broken primary images produced `role="img"` with `Foto Iced Aren Latte belum tersedia`.
- Bio Menu at 390 x 844 and Store Display at 1180 x 820 had no horizontal overflow.
- Browser QA reported no page errors.
- Video remains `preload="none"` and never autoplays.

## Validation

- Targeted PHP: 8 tests, 59 assertions, passed.
- Final targeted PHP: 4 tests, 34 assertions, passed.
- Full PHP: 101 tests, 718 assertions, passed.
- Vite production build: passed.
- Laravel Pint: passed.
- Composer audit: 0 advisories.
- npm production audit: 0 vulnerabilities.
- npm full audit: 0 vulnerabilities.
- `git diff --check`: passed.

## Deployment Decision

The existing Vercel prototype was not redeployed because its `prototype-vercel` tree is unchanged from deployed source `8baf5c0f0f6a0692e64990e54a7dc545fb725f8b`. Public smoke against `https://sagamenu-prototype-review.vercel.app` returned HTTP 200 on desktop and mobile, showed no horizontal overflow, and loaded the Menu & Katalog flow.

Laravel exact-SHA bootstrap remained fail-closed at 5 passed and 50 failed out of 55 gates. The media recovery commit is therefore pushed but not live.

## Blocker

No real Laravel staging target with a signed 55-gate probe is available. This blocks verification of provider connectivity, backup and disposable restore, rollback, UAT, and public smoke for the Laravel release.

## Rollback

- Prototype: no new deployment was made, so no rollback action is required.
- Laravel source: revert `bff2d75dc33647ba7b88f2366c32dd49cd584797`.
- Data: no migration, schema change, or production data mutation is included.
