# Changelog

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
