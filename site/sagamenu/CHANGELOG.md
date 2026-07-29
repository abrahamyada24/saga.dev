# Changelog

## 2026-07-29 - Public media loading budget

- Preserved image dimensions in immutable catalog snapshots and rendered them
  when available to reduce layout movement.
- Prioritized exactly one first-viewport menu image per public surface while
  keeping remaining card and dialog images lazy.
- Changed hidden menu videos from metadata preload to no preload.
- Added public media performance contract tests and retained compatibility with
  older snapshots that have no image dimensions.
- Patched development build dependencies covered by current high-severity npm
  advisories without changing production dependency scope.
- No infrastructure, provider, prototype, or Laravel deployment was changed.

## 2026-07-29 - Laravel VPS staging bootstrap contract

- Added a fail-closed 55-check target evidence contract for PHP, PostgreSQL,
  Redis, S3-compatible storage, workers, scheduler, mail, monitoring, video,
  HTTPS, backup restore, Saga Platform sandbox, exact source, and rollback.
- Bound the target probe to the exact release manifest digest and immutable
  source commit, with stale evidence and placeholder rejection.
- Inserted the staging bootstrap gate before migration in the deployment script.
- Added a secret-free red template, host wrapper, negative-gate tests, and the
  operator runbook in `docs/SAGAMENU-STAGING-BOOTSTRAP.md`.
- No Laravel target was deployed and the Vercel prototype was not changed.

## Unreleased - Release hygiene and staging preflight (local only)

### Added

- Machine-readable staging release manifest contract.
- Fail-closed `sagamenu:release-preflight` command for source, provider, runtime,
  acceptance, backup, and rollback gates.
- Automated tests for placeholder rejection, safe output, immutable checkout,
  and preflight ordering.
- Release hygiene runbook with non-destructive rollback guidance.

### Changed

- Deployment requires a full immutable Git SHA and refuses a dirty checkout.
- Preflight now runs before database migration and release symlink activation.

### Safety

- The example manifest intentionally fails until real evidence is supplied.
- No secret value is emitted or stored in release evidence.
- No merge, deployment, live database, provider, DNS, or customer state changed.

## Unreleased - Sprints 18-25 content operations and public discovery (local only)

### Added

- Editorial Quick Ops with inline edits, filtered bulk actions, saved views, Shift Mode, idempotent batch ledger, and grouped undo.
- Draft-versus-live Change Center, field-level diff, selective discard, and stable Catalog Health issue codes.
- Public search recovery, sticky top categories, dietary filters, locale switching, translations, transcripts, schedules, and accessible focus behavior.
- QR distribution workspace, source attribution, social preview, managed destinations, and active scheduling windows.
- Outlet scope, role matrix, pending invitations, version history, and restore-as-draft prototype flows.
- Privacy-light analytics for surface views, QR sources, detail opens, video plays, zero results, and sold-out interest.
- Laravel translation, batch-operation, health, diff, schedule, QR-window, and aggregate analytics foundations with feature tests.
- Automated browser acceptance for Sprints 18-25 across admin and Bio Menu mobile states.

### Safety

- SagaMenu remains a preview-only menu and catalog; ordering, cart, checkout, POS, and WhatsApp ordering are excluded.
- Catalog content, media, raw search terms, session identifiers, and visitor-level analytics stay outside Saga Platform aggregate reporting.
- Human usability sessions, real object storage, queue/scheduler recovery, accessibility manual review, and staging performance remain release gates.
- No push, merge, deploy, live database, DNS, credential, paid service, or customer communication was performed.

## Unreleased - Sprints 9-17 usability and video wave (local only)

### Added

- Five-task usability pilot mode with PII-minimized JSON evidence export.
- Direct focal-point editing, menu-complexity summary, and tabbed Brand Kit.
- Prototype and Laravel video-menu flow for MP4/WebM upload, Media Library, snapshot, and public detail players.
- Tenant and file-signature tests, public no-autoplay contract, 93-item stress test, design freeze, and pilot protocol.

### Safety

- Laravel video processing, thumbnails, and authoritative duration checks remain staging infrastructure gates.
- Human pilot sessions have not been run; automated pilot evidence does not replace usability acceptance.
- Saga Platform remains default-off and no VPS, DNS, live database, customer data, or payment service was changed.

## Unreleased - Dashboard wizard complete prototype wave (local only)

### Added

- Visual Media Library with upload, search, filters, alt text, focal point, gallery, usage, and safe remove.
- Variant groups, price deltas, add-on ordering, allergens, dietary labels, ingredients, caffeine, spice, and serving notes.
- Category, add-on, and media side sheets with usage-impact summaries.
- Guided catalog setup and surface-confirmed publication with safe failure and retry.
- Brand Kit with logo, four-color tokens, contrast validation, custom-font license confirmation, radius, and image treatment.
- Independent Bio Menu and Store Display preset systems with migration fallback.
- Complete-wave Playwright coverage and prototype review runbook.

### Safety

- Static prototype data remains browser-local and contains no customer or live operational data.
- Production object storage, malware scanning, tenant isolation, and persistent publish remain separate Laravel gates.
- No push, merge, DNS, credential, payment, or customer communication was performed.

## Unreleased - Commercial policy lock (local only)

### Added

- Approved 14-day centrally authoritative trial policy.
- Approved `sagamenu_pro` pricing at Rp100.000 monthly and Rp1.000.000 annually.
- Generic HTTP 503 maintenance response for restricted Store Display, Bio Menu, QR destinations, and preview tokens.
- Hard legacy compatibility cutoff of 1 August 2026 at 23:59:59 Asia/Jakarta, with Andreas as migration conflict owner.

### Safety

- Public maintenance pages never disclose billing status or catalog content.
- Feature-flag rollback does not bypass a persisted restricted account status.
- Legacy organizations without a central mapping continue to render during migration.

## Unreleased - Saga Platform Sprints 23-29 (local only)

### Added

- Immutable local SagaMenu source baseline and implementation commits.
- Canonical fail-closed response validator and eight-call local contract rehearsal.
- Versioned lifecycle, entitlement, quota, and license projection with stale-event rejection.
- Owner-only subscription lifecycle actions and persistent idempotent checkout ledger.
- PII-safe legacy migration inventory and bounded default-off login compatibility.
- Branded restricted-account states and accessibility improvements for authentication screens.
- Filament login bypass prevention while central identity is enabled.
- Activation runbook, support knowledge base, and local readiness report.

### Changed

- Checkout and lifecycle responses must satisfy the canonical central contract.
- Central sessions are denied unless product access is `active` or `trialing`.
- Applicable outbound requests include content digest and idempotency headers.
- Guzzle is upgraded to `7.15.1` to resolve four dependency advisories found during the final security gate.

### Blocked

- Central baseline verification does not yet expose every final required field.
- Central sandbox credentials, inbound event contract, approved plans, and staging runtime evidence are unavailable.

## Unreleased - Wave 2 Sprint 22 (local only)

### Added

- Feature-flagged Saga Platform HMAC client for signup, verification, session create/exchange, provisioning result, subscription checkout, and usage snapshot endpoints.
- Branded SagaMenu `/signup`, `/login`, and `/verify-email` flows with safe errors.
- HMAC assertion verification, replay protection, local session rotation, and server-only secret handling.
- Idempotent central user/organization/workspace/product-account/subscription mapping to local business, outlet, owner membership, trial projection, and draft menu.
- Server-priced subscription checkout BFF with a fail-closed plan allowlist.
- Aggregate-only usage snapshot command and feature-gated schedule.
- Sprint 22 acceptance tests and rollback session invalidation.

### Changed

- Central-origin local users may have a null password; central credential hashes are never copied into SagaMenu.
- Central `subscriptionId`, `planCode`, `subscriptionStatus`, and verification `lifecycleVersion` are mandatory canonical fields. Product-side plan/status/lifecycle defaults are prohibited.

### Safety

- Integration remains disabled by default.
- No production, staging, DNS, live data, paid service, customer communication, push, or merge was performed.
- SagaMenu remains blocked from staging readiness until its source has an approved immutable commit.
