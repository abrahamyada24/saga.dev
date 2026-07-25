# SagaMenu Saga Platform Activation Runbook

## 1. Approved product inputs

- Trial: 14 days, centrally authoritative.
- Paid plan: `sagamenu_pro`.
- Monthly price: Rp100.000.
- Annual price: Rp1.000.000.
- Public catalog: maintenance response unless account and subscription are `active` or `trialing`.
- Legacy compatibility cutoff: 1 August 2026 at 23:59:59 Asia/Jakarta.
- Migration conflict owner: Andreas.

Refund, proration, renewal, tax, and payment retry semantics still require Saga Platform/payment-provider confirmation.

## 2. Align the central contract

The Saga Platform owner must provide an immutable commit where signup and verification return:

```text
subscriptionId
planCode
subscriptionStatus
lifecycleVersion
```

Verification must also return:

```text
trialEndsAt
```

Run central contract tests and attach the commit SHA. Do not use the inspected `aeb3cb0...` baseline as E2E proof because its verification response is incomplete.

## 3. Provision a sandbox credential

The Saga Platform owner creates an environment-bound `sagamenu` service account with only the required scopes. Store the base URL, key ID, and HMAC secret in the staging secret manager. Never send the secret in chat, Git, screenshots, or documentation.

Populate these staging variables:

```text
SAGAMENU_SAGA_PLATFORM_ENABLED=false
SAGAMENU_SAGA_PLATFORM_BASE_URL=<sandbox HTTPS URL>
SAGAMENU_SAGA_PLATFORM_KEY_ID=<sandbox key id>
SAGAMENU_SAGA_PLATFORM_HMAC_SECRET=<secret manager injection>
SAGAMENU_SAGA_PLATFORM_CONTRACT_VERSION=1.0
SAGAMENU_SAGA_PLATFORM_CHECKOUT_PLANS_JSON='{"sagamenu_pro:monthly":100000,"sagamenu_pro:annual":1000000}'
SAGAMENU_LEGACY_LOGIN_COMPATIBILITY_ENABLED=false
SAGAMENU_LEGACY_LOGIN_COMPATIBILITY_ENDS_AT=2026-08-01T23:59:59+07:00
```

Keep the feature disabled.

## 4. Prepare a clean staging release

1. Review local commits `9a1692eb...` and `00e50780...`.
2. Push and merge only after repository-owner approval.
3. Deploy a clean checkout to a non-production VPS.
4. Configure PostgreSQL, Redis, queue, scheduler, TLS, mail, backup, malware scan, and monitoring.
5. Run:

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
npm ci
npm run build
```

## 5. Run local and staging-safe checks

In local/testing only:

```bash
php artisan sagamenu:saga-platform-rehearse
php artisan test --compact
vendor/bin/pint --test
```

On staging while the feature is still off:

```bash
php artisan about
php artisan route:list --path=billing
php artisan sagamenu:saga-platform-migration-audit
php artisan sagamenu:saga-platform-usage --dry-run
```

Review output for counts only. Do not include customer emails or catalog content in evidence.

## 6. Execute sandbox E2E

Use synthetic test identities and no real customer data.

1. Enable `SAGAMENU_SAGA_PLATFORM_ENABLED=true`.
2. Refresh config.
3. Open branded `/signup`.
4. Complete signup and email verification.
5. Confirm exactly one user, organization, outlet, draft catalog, subscription, and Saga Platform mapping.
6. Log in through signed assertion exchange.
7. Confirm session rotation and HttpOnly cookie behavior.
8. Exercise a dry-run checkout with an approved test plan.
9. Exercise suspend, resume, and cancel in the sandbox.
10. Send one aggregate usage snapshot and inspect its exact seven keys.
11. Confirm no catalog, media, search, session, or visitor detail reached central logs.

## 7. Rehearse rollback

1. Set `SAGAMENU_SAGA_PLATFORM_ENABLED=false`.
2. Run `php artisan config:cache`.
3. Confirm `/signup`, `/login`, verification, billing, and usage integration are unavailable.
4. Confirm a central-origin session is invalidated.
5. Confirm organizations, catalogs, mappings, migration candidates, and checkout attempts remain intact.
6. Re-enable only after the incident owner approves.

## 8. Inventory legacy accounts

Start with dry-run:

```bash
php artisan sagamenu:saga-platform-migration-audit
```

After owner review, create local candidates:

```bash
php artisan sagamenu:saga-platform-migration-audit --write
```

Andreas resolves duplicate email and multi-tenant ownership conflicts manually. Never auto-merge identities and never copy local password hashes to Saga Platform.

If a compatibility window is approved:

```text
SAGAMENU_LEGACY_LOGIN_COMPATIBILITY_ENABLED=true
SAGAMENU_LEGACY_LOGIN_COMPATIBILITY_ENDS_AT=2026-08-01T23:59:59+07:00
```

Disable it at the approved deadline. If staging is not ready by then, leave compatibility disabled and request a new explicit deadline from Andreas.

## 9. Production go/no-go

Production remains **NO-GO** until all are attached:

- Compatible immutable central commit.
- Successful sandbox E2E evidence.
- Approved pricing and restricted-state matrix.
- Legacy migration owner and deadline.
- Security review with no unresolved critical/high findings.
- TLS, backup, restore, monitoring, queue, scheduler, and rollback proof.
- Repository owner approval for push/merge and release.
