# SagaMenu Sprints 9-17 Report

Date: 29 July 2026
Branch: `codex/sagamenu-wave2-sprint22`
Baseline: `eb5eac5379e6c9c8375760562d49079d162e360f`
Status: local implementation, automated QA, Vercel deployment, and live prototype QA complete

## Deployment Evidence

- Stable review: `https://sagamenu-prototype-review.vercel.app`
- Immutable review: `https://sagamenu-prototype-review-3xvb2exov-andreas-projects16.vercel.app`
- Deployment id: `dpl_Hetn3PTgi4sdwrwsuz9CnTPrkqAH`
- Target/status: production / Ready
- Created: 29 July 2026 at 01:07 WIB

Sprint 0, Sprint 1, Sprint 2, complete-wave, Sprints 9-17, and full prototype E2E all passed against the stable URL.

## Delivered

### Sprint 9 - Usability instrumentation

- Built-in five-task `Mode uji`.
- Session duration, hesitation marking, notes, event timeline, and JSON export.
- Event payload excludes direct identity fields and catalog/customer content.
- Human pilot protocol and acceptance gate.

### Sprint 10 - UX final polish

- Direct focal-point editing on the image.
- Complexity summary for variants and add-ons.
- Brand Kit split into Identitas, Tipografi, Bentuk, and Preset.
- Reduced-motion handling and responsive pilot/video states.
- Regression fix for guided setup event handling.

### Sprint 11 - Video menu

- Prototype upload, progress, error/retry/remove, preview, Media Library filtering, public player, and seeded demo video.
- Laravel MP4/WebM signature validation and configurable 50 MB limit.
- Tenant-safe `menu_video` mapping from editor or Media Library.
- Snapshot MIME, thumbnail, and duration fields.
- Bio Menu and Store Display players with controls, metadata preload, no autoplay, and pause-on-close behavior.

### Sprint 12 - Design freeze

- Editorial KV Ops hierarchy, dimensions, typography, color, interaction, video, accessibility, and change-control decisions frozen in `docs/sagamenu-design-freeze-v1-2026-07-29.md`.

### Sprints 13-16 - Laravel foundation and gates

- Media configuration and environment placeholders.
- Media Library video type, filtering, upload limits, and processing status.
- Offering editor upload/selection and edit hydration.
- Tenant isolation and disguised-file rejection.
- Public snapshot/player contract.
- Production video processing remains fail-visible as an infrastructure gate.

### Sprint 17 - Automated readiness audit

- Full Laravel and browser regression.
- 93-item stress state with pagination and desktop/mobile overflow checks.
- Dependency audit and accessibility button-name checks.
- Local screenshot evidence generated.

## Automated Evidence

- Laravel: 65 tests, 459 assertions, all passed.
- Pint: passed.
- Prototype dependency audit: 0 vulnerabilities.
- Static contract check: 8 routes, 3 previews, 72 actions.
- Sprint 0, Sprint 1, Sprint 2, complete-wave, Sprints 9-17, and full prototype E2E: passed.
- Sprint 9-17 result: 5/5 automated pilot tasks, 8 events, 1 test hesitation, no direct PII fields, 93 stress items, no desktop/mobile overflow, 0 unnamed buttons, 0 console errors, 0 page errors.

Screenshots:

- `prototype-vercel/qa/sprints-9-17-pilot.png`
- `prototype-vercel/qa/sprints-9-17-video-editor.png`
- `prototype-vercel/qa/sprints-9-17-video-detail.png`
- `prototype-vercel/qa/sprints-9-17-mobile.png`

## Readiness

| Gate | Status |
| --- | --- |
| Local code and automated tests | PASS |
| Static Vercel prototype review | PASS |
| Human usability pilot | BLOCKED - owner sessions not run |
| Laravel staging | BLOCKED |
| Production | BLOCKED |

Laravel staging still requires real evidence for PostgreSQL, Redis, object storage, queue worker, scheduler, ClamAV, video processing/thumbnail/duration validation, offsite backup and restore drill, TLS, monitoring, SMTP, Saga Platform sandbox contract, and operator sign-off.

## Rollback

- Prototype: redeploy the previous immutable Vercel deployment.
- Laravel feature: revert this local sprint commit before merge; no database migration was added.
- Video activation: keep `SAGAMENU_VIDEO_PROCESSING_REQUIRED=true` and do not expose unprocessed uploads in a production rollout until the processing worker contract is approved.
- Saga Platform feature flag remains default-off.

## Next Decision

Andreas reviews the deployed prototype and runs the five human pilot sessions. Only accepted findings enter the Laravel visual-parity sprint. Automated evidence alone must not be used to declare staging or production readiness.
