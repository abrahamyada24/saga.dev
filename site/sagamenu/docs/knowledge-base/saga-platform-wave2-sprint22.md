# SagaMenu Wave 2 Sprint 22 Knowledge Base

Status: **local implementation, feature flag off, not staging-ready**

## Authority

- Central source: Saga Platform commit `aeb3cb0e4500f53ffd6663998979639cb25712d4` (`feat: add Saga Platform commercial self-service core`).
- Product discovery source: `docs/saga-platform-integration-discovery.md` and `docs/saga-platform-integration-contract.json`.
- Where the discovery contract still contains placeholders, this Sprint 22 overlay and the verified central commit take precedence.
- Saga Platform owns identity, password credential, email verification, organization/product account identity, trial, subscription, plan, payment, and lifecycle state.
- SagaMenu owns its HttpOnly local session, business/outlet mapping, catalog domain data, publish state, and operational authorization.

## Safety gate

`SAGAMENU_SAGA_PLATFORM_ENABLED=false` is the default. Disabled mode hides `/signup`, `/login`, `/verify-email`, provisioning retry, and checkout. It also invalidates an existing central-origin local session on its next web request without deleting any SagaMenu domain data.

Do not enable the integration until SagaMenu has an approved immutable source commit, environment-scoped central service credentials, and end-to-end test evidence against a non-production Saga Platform runtime.

## Branded identity flow

1. `GET/POST /signup` stays on the SagaMenu domain.
2. SagaMenu BFF signs `POST /internal/v1/products/sagamenu/signups` with HMAC-SHA256.
3. The browser is sent to SagaMenu `/verify-email`; the HMAC secret never reaches the browser.
4. SagaMenu BFF signs `POST /internal/v1/products/sagamenu/verifications`.
5. Verification response fields are consumed as canonical central state.
6. SagaMenu idempotently creates the local user projection, business, owner membership, main outlet, draft main catalog, subscription projection, and central mapping.
7. SagaMenu reports readiness to `POST /internal/v1/products/sagamenu/provisioning-results` using the verification response `lifecycleVersion`.
8. `POST /login` creates and exchanges an opaque central code through the BFF.
9. SagaMenu validates the HMAC assertion and rotates into a local Laravel session. The assertion and exchange code are not stored.

## Canonical response fields

Signup must return all of:

- `signupAttemptId`
- `platformUserId`
- `organizationId`
- `workspaceId`
- `productAccountId`
- `subscriptionId`
- `planCode`
- `subscriptionStatus`
- `lifecycleVersion`

Verification must return all of:

- `productAccountId`
- `subscriptionId`
- `planCode`
- `subscriptionStatus`
- `lifecycleVersion`
- `trialEndsAt`

Provisioning result must return `productAccountId`, `status`, and `lifecycleVersion`. Missing canonical fields produce `PLT_CONTRACT_RESPONSE_INCOMPLETE`; SagaMenu does not guess plan, status, subscription, or lifecycle state.

## HMAC v1

Required headers:

- `X-Saga-Key-Id`
- `X-Saga-Timestamp`
- `X-Saga-Nonce`
- `X-Saga-Signature`
- `X-Saga-Contract-Version: 1.0`
- `X-Correlation-Id`

Canonical string, joined with newline:

```text
timestamp
nonce
key-id
UPPERCASE-METHOD
normalized-path
sha256(exact-request-body)
```

Signature: `v1=` plus lowercase hexadecimal HMAC-SHA256. Key ID and secret are read only from server environment configuration.

## Signed product assertion

Expected format: `v1.<base64url-json>.<base64url-hmac>`.

SagaMenu verifies signature, issuer `saga-platform`, audience `sagamenu-web`, product `sagamenu`, subject, organization, product account, `iat`, `exp`, maximum 300-second assertion TTL, and one-time `jti`. A replayed `jti` is rejected. The assertion only bootstraps a rotated local HttpOnly session; it is never stored in database or session.

## Local mapping

`saga_platform_accounts` maps opaque central ULIDs to local records:

- central user -> local `users.central_user_id`
- central organization -> local `organizations.central_organization_id`
- central workspace -> local `locations.central_workspace_id`
- central product account -> one local business/account mapping
- central subscription -> local subscription projection

Unique constraints plus a transaction make provisioning replay-safe. An existing local email with domain ownership is never auto-linked; it returns an owner-review state.

Central users have `users.password = null`. SagaMenu never copies a central password hash.

## Checkout boundary

`POST /billing/subscription-checkout` is authenticated and feature-gated. The browser supplies only `plan_code` and `billing_cycle`. Amount is resolved from `SAGAMENU_SAGA_PLATFORM_CHECKOUT_PLANS_JSON`; an empty or missing allowlist fails closed. The BFF calls `POST /internal/v1/products/sagamenu/subscription-checkouts` with a stable session idempotency key.

No checkout is executed by installation, tests, or this sprint. Local tests use an HTTP fake and central dry-run shaped responses only.

## Usage privacy boundary

Only these central-baseline SagaMenu metrics may leave the product:

- `activeBusinesses`
- `trialBusinesses`
- `activeSubscriptions`
- `outletsCount`
- `catalogsPublished`
- `qrCodesCount`
- `serviceHealth`

All values are aggregate scalars. Catalog content, descriptions, prices, media, fonts, raw analytics, search terms, visitor/session identifiers, top-item data, and granular QR sources are prohibited. The daily command is `sagamenu:saga-platform-usage`; the scheduler runs it only when the feature flag is enabled.

## Environment placeholders

```text
SAGAMENU_SAGA_PLATFORM_ENABLED=false
SAGAMENU_SAGA_PLATFORM_BASE_URL=
SAGAMENU_SAGA_PLATFORM_PRODUCT_CODE=sagamenu
SAGAMENU_SAGA_PLATFORM_KEY_ID=
SAGAMENU_SAGA_PLATFORM_HMAC_SECRET=
SAGAMENU_SAGA_PLATFORM_CONTRACT_VERSION=1.0
SAGAMENU_SAGA_PLATFORM_ISSUER=saga-platform
SAGAMENU_SAGA_PLATFORM_AUDIENCE=sagamenu-web
SAGAMENU_SAGA_PLATFORM_PLAN_CODE=
SAGAMENU_SAGA_PLATFORM_TERMS_VERSION=2026-07-16
SAGAMENU_SAGA_PLATFORM_CHECKOUT_PLANS_JSON={}
```

The secret must be injected by a server secret manager or environment provisioner. Never put an actual value in source control, client JavaScript, logs, screenshots, or documentation.

## Rollback

1. Set `SAGAMENU_SAGA_PLATFORM_ENABLED=false` and refresh application config.
2. New branded identity, verification, checkout, and scheduled usage calls stop immediately.
3. Central-origin users are logged out on their next web request.
4. Do not delete `saga_platform_accounts`, central ID columns, business, outlet, catalog, or local audit data.
5. Existing legacy/local accounts remain unchanged.
6. Investigate with safe correlation IDs only; never log password, token, assertion, HMAC secret, or full upstream body.

Database rollback of the Wave 2 migration is not the operational rollback. Schema removal requires a separate approved migration after mappings and nullable central-password users have been handled.
