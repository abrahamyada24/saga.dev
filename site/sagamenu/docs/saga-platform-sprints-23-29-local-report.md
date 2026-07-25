# SagaMenu Saga Platform Sprints 23-29 Report

## Verdict

**LOCAL IMPLEMENTATION COMPLETE; NOT STAGING-READY**

SagaMenu now has an immutable local source baseline and a tested implementation commit. The integration remains disabled by default. No push, merge, deployment, DNS, live data, customer communication, paid service mutation, or production credential change was performed.

## Immutable evidence

- Isolated branch: `codex/sagamenu-wave2-sprint22`
- Wave 2 baseline: `9a1692eb425460bf3d8b8ca9929073909d0dab73`
- Sprints 23-28 implementation: `00e50780fb4bba9a9ac78cf3238a1f3555cfc2d2`
- Central baseline inspected read-only: `aeb3cb0e4500f53ffd6663998979639cb25712d4`
- Product path: `site/sagamenu`
- Feature flag default: `SAGAMENU_SAGA_PLATFORM_ENABLED=false`

## Sprint 23 - Canonical source

Status: **VERIFIED**

- Converted the previously untracked product snapshot into an immutable local commit.
- Excluded `.env`, databases, logs, sessions, cache, storage data, and secrets.
- Preserved the isolated worktree and no-push/no-merge boundary.

## Sprint 24 - Contract rehearsal

Status: **LOCAL VERIFIED; CENTRAL E2E BLOCKED**

- Added `SagaPlatformContract` as the single fail-closed validator.
- Signup requires `subscriptionId`, `planCode`, `subscriptionStatus`, and `lifecycleVersion`.
- Verification requires the same fields plus `trialEndsAt`.
- Added `sagamenu:saga-platform-rehearse`, which fakes all eight canonical calls locally, validates signed headers, and performs no network or domain writes.
- Added `X-Content-SHA256` and `Idempotency-Key` on applicable outbound requests.

Important mismatch: the inspected central baseline verification implementation returns `productAccountId`, `trialEndsAt`, and status metadata, but not all five final canonical fields. SagaMenu correctly rejects that response until a newer central commit or contract-compatible sandbox is supplied.

## Sprint 25 - Lifecycle and entitlement projection

Status: **LOCAL VERIFIED; INBOUND CENTRAL ADAPTER BLOCKED**

- Added monotonic lifecycle and entitlement projection.
- Stale lifecycle updates are recorded and ignored.
- Same-version conflicting payloads fail closed.
- Added projection fields for plan, entitlement version, entitlements, quota policy, license, reason, and sync timestamps.
- Added central subscription actions for suspend, resume, and cancel.
- Central-origin dashboard sessions are allowed only for `active` and `trialing`.
- Public catalog behavior for restricted subscription states remains unchanged because the business access matrix has not been approved.

No public inbound webhook route was invented. The projector is ready, but activation waits for a verified central-to-product event contract and signed inbound authentication specification.

## Sprint 26 - Legacy account migration

Status: **LOCAL VERIFIED; OWNER POLICY INPUT REQUIRED**

- Added a PII-safe migration inventory using keyed email fingerprints.
- Dry-run is the default; local candidate writes require `--write`.
- Added bounded legacy login compatibility.
- Compatibility is default-off and requires both an explicit flag and expiry timestamp.
- Fallback runs only after central `PLT_AUTH_FAILED`, only for unmapped local users, and never copies password hashes.
- Duplicate email, multi-tenant ownership, and missing credential cases require manual review.

## Sprint 27 - Billing rehearsal

Status: **LOCAL VERIFIED; PLAN AND PAYMENT INPUT REQUIRED**

- Enforced owner-only checkout and subscription lifecycle actions.
- Added a persistent checkout attempt ledger with request hash and idempotency key.
- Amounts come only from the server-side plan allowlist.
- Retry reuses the same idempotency key.
- Checkout URLs are accepted only when HTTPS.
- Safe central error codes are returned without leaking upstream internals.

Real plan codes, prices, billing cycles, payment gateway mode, and callback semantics remain external inputs.

## Sprint 28 - UI, accessibility, and UAT states

Status: **LOCAL VERIFIED**

- Kept branded SagaMenu signup, login, verification, and provisioning retry.
- Added a branded account-status screen for past due, expired, suspended, cancelled, provisioning failed, and unavailable states.
- Added screen-reader status/error regions, field relationships, autocomplete metadata, focus-visible states, password guidance, privacy link, and responsive status layouts.
- Restricted central sessions are invalidated before the dashboard is served.

Central password reset is not implemented because the inspected central contract has no verified reset endpoint. Filament local reset remains a legacy/local behavior while the integration is disabled.

## Sprint 29 - Acceptance gate

Status: **LOCAL PASS; EXTERNAL BLOCKERS REMAIN**

Latest implementation verification:

```text
php artisan test --compact
46 tests passed, 243 assertions
```

Additional verified gates:

- Pint: passed.
- Vite production build: passed.
- Composer audit: no advisories after upgrading Guzzle from `7.13.2` to `7.15.1`.
- npm production audit: zero vulnerabilities.
- Contract JSON parsing: passed.
- Source secret scan: clean; documented values are placeholders only.
- Local canonical rehearsal: eight mocked requests, no network, no domain writes.
- Visual auth QA: four mobile/tablet/desktop screens returned 200 with no console errors, horizontal overflow, hidden headings, or unlabeled controls.
- Filament `/admin/login` redirects to the branded flow while the integration is enabled.
- Feature-off rollback and restricted-session invalidation: passed.

## Privacy boundary

Only these usage aggregates may leave SagaMenu:

- `activeBusinesses`
- `trials`
- `subscriptions`
- `outletsCount`
- `catalogsPublished`
- `qrCodesCount`
- `serviceHealth`

Catalog content, item descriptions, media, custom fonts, visitor-level events, search terms, session identifiers, and granular analytics remain in the SagaMenu database.

## Remaining blockers

1. A central commit or sandbox must return the explicit final signup and verification fields.
2. Sandbox base URL, environment-bound key ID, and HMAC secret are unavailable.
3. Central-to-SagaMenu lifecycle/entitlement event contract and inbound signature policy are unavailable.
4. Owner-approved plan codes, prices, billing cycles, and trial duration are unavailable.
5. Restricted-state behavior for public Store Display and Bio Menu needs a business decision.
6. Legacy migration compatibility end date and conflict-resolution owner are not approved.
7. Staging VPS, TLS, PostgreSQL, Redis, queue, scheduler, email, backup, monitoring, and restore proof are unavailable.

## Rollback

Set `SAGAMENU_SAGA_PLATFORM_ENABLED=false`, refresh Laravel config, and confirm central-origin sessions are invalidated on the next request. Do not delete central mappings, checkout attempts, migration candidates, or SagaMenu domain data during rollback.
