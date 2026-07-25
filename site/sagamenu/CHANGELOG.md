# Changelog

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
