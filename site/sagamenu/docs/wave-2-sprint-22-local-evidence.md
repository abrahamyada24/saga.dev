# SagaMenu Wave 2 Sprint 22 - Local Evidence

## Verdict

**LOCAL PASS; NOT STAGING-READY**

The implementation exists only in an isolated local worktree and is disabled by default. No production/live data, DNS, customer communication, paid-service mutation, push, merge, or deployment occurred.

## Source evidence

- Parent repository baseline: `e2e07105a01959fc38df615b2528cc68b0ad209e`.
- Local branch: `codex/sagamenu-wave2-sprint22`.
- Local worktree: `C:\Users\Windows 11\.codex\worktrees\sagamenu-wave2-sprint22`.
- SagaMenu source snapshot: copied from the untracked `site/sagamenu` tree; `.env`, local databases, logs, sessions, cache data, private/public storage data were excluded.
- Central contract baseline: `aeb3cb0e4500f53ffd6663998979639cb25712d4`, verified in the separate Saga Platform technical-track repository.

Because the SagaMenu source was untracked before isolation, the branch base does not provide an immutable SagaMenu source revision. This remains a hard staging-readiness blocker even though local tests pass.

## Implemented evidence

- `config/sagamenu.php` and `.env.example`: default-off feature flag and empty server-only placeholders.
- `app/Services/SagaPlatform/SagaPlatformClient.php`: exact-body HMAC v1 client for all requested central endpoints.
- `app/Services/SagaPlatform/SagaPlatformAssertionVerifier.php`: signed assertion validation and replay protection.
- `app/Http/Controllers/SagaPlatformAuthController.php`: branded signup, verification, provisioning, and login BFF.
- `app/Services/SagaPlatform/SagaMenuProvisioner.php`: transactional idempotent central-to-local mapping.
- `app/Http/Controllers/SagaPlatformBillingController.php`: server-priced checkout BFF.
- `app/Services/SagaPlatform/SagaMenuUsageSnapshotBuilder.php`: seven-key privacy allowlist.
- `app/Console/Commands/ReportSagaMenuUsageSnapshot.php`: aggregate snapshot reporter.
- `app/Http/Middleware/InvalidateDisabledSagaPlatformSession.php`: rollback logout for central-origin sessions.
- `database/migrations/2026_07_16_000004_add_saga_platform_wave2_foundation.php`: central mappings and nullable local password.
- `tests/Feature/SagaPlatformWave2Sprint22Test.php`: contract/security/privacy acceptance coverage.

## Local test evidence

Latest targeted result:

```text
php artisan test tests/Feature/SagaPlatformWave2Sprint22Test.php
9 passed, 90 assertions
```

Latest full regression result after the final response-field clarification and retry hardening:

```text
php artisan test
36 passed, 182 assertions
```

Local branded-page smoke used a temporary process-only feature override with no Saga Platform base URL or credential:

```text
GET http://127.0.0.1:8094/signup -> 200, Saga Menu branding present
GET http://127.0.0.1:8094/login  -> 200, Saga Menu branding present
```

No form was submitted and no central or paid-service request was made.

## Fail-closed evidence

- Disabled feature routes return 404.
- Central session is invalidated when the feature flag is switched off.
- Missing canonical central fields return `PLT_CONTRACT_RESPONSE_INCOMPLETE`.
- Local provisioning rejects central binding conflicts and legacy owner auto-linking.
- Assertion rejects invalid signature, issuer/audience/product/time window, and repeated `jti`.
- Checkout rejects missing subscription mapping and missing server-side plan price.
- Usage builder rejects unknown or nested metrics.
- Test fixtures place forbidden catalog and visitor-search text in local data and prove it is absent from the central usage body.

## Unresolved blockers

1. SagaMenu still lacks an approved immutable source commit.
2. No Saga Platform sandbox base URL, key ID, or HMAC secret was supplied to this worktree.
3. No live HTTP end-to-end run against the central baseline was performed.
4. Checkout plan allowlist is intentionally empty; owner-approved plan codes and amounts are unavailable.
5. Inbound asynchronous lifecycle/entitlement event consumption is outside this BFF slice and remains future work.
6. Staging runtime, queue, scheduler, TLS, DNS, and rollback drill were not exercised.

## Rollback evidence

Operational rollback is feature-flag based and non-destructive:

```text
SAGAMENU_SAGA_PLATFORM_ENABLED=false
```

After config refresh, identity/checkout/reporting routes are unavailable, scheduled usage is skipped, and central-origin sessions are invalidated on the next request. Central mappings and SagaMenu operational data remain intact for investigation or reactivation.
