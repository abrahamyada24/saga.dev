# SagaMenu Sprints 18-25 Implementation Report

Date: 29 July 2026
Scope: local isolated worktree only
Branch: `codex/sagamenu-wave2-sprint22`
Starting commit: `06765326`

## Executive Summary

Sprints 18-25 have been implemented as a coherent local product slice across the
interactive prototype and the Laravel domain foundation. The work keeps SagaMenu
inside its approved boundary: a preview-only e-menu and e-catalog for Bio Menu
mobile and Store Display tablet, without cart, ordering, checkout, POS, or
WhatsApp ordering.

The implementation is ready for owner review and controlled human usability
testing. It is not yet staging-ready or production-ready because real
infrastructure and participant-based acceptance gates have not been completed.

## Implemented Scope

### Sprint 18 - Evidence Baseline

Status: PARTIAL, automated evidence complete; human evidence pending.

- Preserved five-task usability pilot instrumentation without direct PII.
- Added route/action inventory checks and regression coverage.
- Preserved 93-item catalog stress coverage and mobile overflow checks.
- Confirmed no-autoplay behavior for menu video.
- Retained the preview-only product boundary in documentation and tests.

Remaining:

- Five moderated admin sessions.
- Three Bio Menu and two Store Display customer sessions.
- Manual keyboard and screen-reader review.
- Agreed staging performance baseline on representative devices and networks.

### Sprint 19 - Quick Operations and Bulk Editing

Status: VERIFIED LOCALLY.

- Checkbox row selection and current-view select all.
- Sticky bulk action bar for available, sold out, show, hide, and category.
- Inline price, category, availability, and surface editing.
- Saved views for sold out, missing media, scheduled, and translation work.
- Mobile Shift Mode and grouped undo.
- Laravel tenant-scoped, idempotent batch update and undo service.
- Cross-catalog mutation rejection and audit batch storage.

### Sprint 20 - Change Center and Catalog Health

Status: VERIFIED LOCALLY.

- Dedicated `Perubahan & Kesehatan` workspace.
- Draft-versus-published field diff grouped by content, operations, structure,
  appearance, and media.
- Selective discard in the prototype.
- Stable blocking and warning issue codes.
- Publish blocking for blocking health issues.
- Dashboard attention count linked to validator output.

### Sprint 21 - Public Discovery and Performance UX

Status: VERIFIED LOCALLY, device performance gate pending.

- Sticky category rail above the menu.
- Category overflow selector.
- Search clear control, result count, zero-result recovery, and filter reset.
- Dietary and allergen information filters.
- Deep-link item opening and focus restoration.
- Lazy images, async decoding, schedule-aware visibility, and no autoplay.
- Responsive mobile and tablet touch behavior without horizontal overflow.

### Sprint 22 - Language and Accessibility

Status: VERIFIED LOCALLY, manual assistive-technology gate pending.

- Indonesian and English public locale switch.
- Per-item translation editor and fallback behavior.
- Localized public cards and detail content.
- Alt text and video transcript health checks.
- Transcript rendering in public detail.
- Skip links, visible focus, reduced-motion support, and contrast validation.
- Plus Jakarta Sans remains the product fallback when a custom font is absent.

### Sprint 23 - QR, Share, and Scheduling

Status: VERIFIED LOCALLY, print scan and scheduler recovery gate pending.

- Managed QR routes with name, source, destination, outlet, active state, and
  aggregate scan count.
- Create, toggle, copy, and download interactions.
- Social share preview.
- Item visibility scheduling with organization timezone.
- Laravel QR active-window enforcement with safe HTTP 410 outside the window.
- Schedule-aware public offering visibility.

### Sprint 24 - Multi-outlet, Team, and Version History

Status: PROTOTYPE VERIFIED; existing Laravel authorization invariants preserved.

- Always-visible outlet scope and active-outlet switching.
- Outlet cards for master catalog and per-outlet setup.
- Owner, manager, and editor role matrix.
- Pending invitation state.
- Version history and restore-as-draft behavior.
- Existing owner invariant and tenant authorization remain covered by the wider
  Laravel test suite.

Production follow-up:

- Persist full invitation lifecycle and version restore commands.
- Implement propagation conflicts and per-outlet override precedence.

### Sprint 25 - Analytics to Action and Release Controls

Status: VERIFIED LOCALLY; staging release gate pending.

- Bio Menu versus Store Display performance split.
- QR source attribution.
- Detail-open, video-play, zero-result, and sold-out interest metrics.
- Operational observations framed as prompts, without causal claims.
- Metric definitions and privacy disclosure.
- Laravel event allowlist and daily aggregate rollup extensions.
- No raw search term, session identifier, visitor identity, catalog content, or
  media is added to central aggregate reporting.

## Laravel Foundation

Key additions:

- `offering_translations`
- `catalog_operation_batches`
- QR scheduling and metadata fields
- video-play and sold-out-open aggregate columns
- `BulkOfferingUpdater`
- `CatalogHealthValidator`
- `CatalogDraftDiffer`
- `ScheduleEvaluator`
- translation-aware and schedule-aware public rendering
- aggregate analytics event and rollup support

The database changes are additive. Rollback is provided by the migration `down`
method. Any rollback must first confirm that no new translation or batch audit
records need to be retained.

## Verification Evidence

| Gate | Result |
| --- | --- |
| Laravel full suite | 78 passed, 508 assertions, including release preflight |
| Laravel production asset build | Passed |
| Laravel Pint formatting | Passed |
| Git whitespace validation | Passed |
| Prototype contract check | 11 routes, 96 actions, passed |
| Sprint 18-25 browser E2E | Passed, no console errors |
| Existing complete-wave browser regression | Passed |
| Sprints 9-17 regression | Passed |
| Public mobile overflow | None |
| Unnamed buttons | 0 |
| Video autoplay | Disabled |

Browser evidence is stored under `prototype-vercel/qa/`, including:

- `sprints-18-25-quick-ops.png`
- `sprints-18-25-health.png`
- `sprints-18-25-distribution.png`
- `sprints-18-25-workspace.png`
- `sprints-18-25-analytics.png`
- `sprints-18-25-public-mobile.png`

## Known Gaps and Release Gates

1. Human task-time targets are not verified until the ten planned participant
   sessions are completed.
2. Laravel staging still needs an approved real database, object storage,
   malware scanning, queues, scheduler recovery, email provider, and monitoring.
3. QR export must be scanned from the agreed minimum print size on real devices.
4. Accessibility needs manual keyboard, screen-reader, zoom, and contrast review.
5. Public performance budgets need representative Android and slow-network tests.
6. Multi-outlet propagation, conflict resolution, and full invitation lifecycle
   require persisted backend implementation before production.
7. Backup/restore and release rollback must be rehearsed in staging.

## Local Rollback

Prototype rollback:

1. Remove the `sprints-18-25.css` and `sprints-18-25.js` includes from
   `prototype-vercel/index.html`.
2. Remove the three new navigation routes if the extension is disabled.
3. Reset prototype browser storage from `Reset demo`.

Laravel rollback:

1. Disable access to the new operations UI while preserving existing catalog
   editing and publishing.
2. Run the specific migration rollback only after backing up additive records.
3. Rebuild frontend assets.
4. Run the complete Laravel and browser regression suites.

## Recommended Next Gate

Run a controlled owner review first, followed by the ten Sprint 18 human
sessions. Fix only severity-1 and repeated severity-2 usability findings before
opening staging infrastructure work. This prevents infrastructure effort from
locking in an interaction model that has not yet been validated by users.
