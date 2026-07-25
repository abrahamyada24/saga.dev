# SagaMenu - Saga Platform Integration Discovery

> Wave 2 Sprint 22 overlay: the verified central baseline is commit `aeb3cb0e4500f53ffd6663998979639cb25712d4`. Its HMAC v1 endpoints and canonical response fields supersede the placeholder endpoint/auth proposals below for the local implementation. See `docs/knowledge-base/saga-platform-wave2-sprint22.md`. The SagaMenu source remains non-immutable and is not staging-ready.

**Document status:** discovery only, read-only audit plus recommended contract  
**Audit date:** 2026-07-16 (Asia/Jakarta)  
**Product code:** `sagamenu`  
**Repository root:** `C:\Users\Windows 11\Documents\SAGADEVS`  
**Product path:** `site/sagamenu`  

## 1. Status vocabulary

- **VERIFIED**: directly supported by the current local source, schema, configuration, routes, or tests.
- **PLACEHOLDER**: recommended integration design that still requires Saga Platform API/owner confirmation and implementation.
- **UNAVAILABLE**: not found or cannot be established from the available repository/runtime.
- **BLOCKED**: cannot be finalized safely until a named owner supplies a decision or external contract.

No production environment, secret, token, `.env` value, customer record, or PII was inspected or copied into this document.

## 2. Source provenance

| Item | Status | Finding |
|---|---|---|
| Repository | VERIFIED | Git root is `C:\Users\Windows 11\Documents\SAGADEVS`. |
| Branch | VERIFIED | `main`; the audit did not switch branches. |
| Repository HEAD | VERIFIED | `e2e07105a01959fc38df615b2528cc68b0ad209e`, dated `2026-06-24T10:26:47+07:00`. |
| Product source commit | UNAVAILABLE | `site/sagamenu/` is wholly untracked at the repository HEAD (`git ls-files site/sagamenu` returned 0). The HEAD above is only a workspace baseline, not a commit that contains SagaMenu. |
| Working tree | VERIFIED | `?? site/sagamenu/`; local sprint work exists and was not reset, overwritten, staged, committed, or mixed with implementation changes by this audit. |
| Stack | VERIFIED | PHP `^8.3`, Laravel `^13.8`, Filament `~5.0`; see `composer.json:8-12`. |

**Source-control gate:** the exact SagaMenu revision is BLOCKED until the product tree is committed or otherwise assigned an immutable source artifact/hash by the repository owner.

## 3. Current entry points and authentication

### 3.1 Public and dashboard routes

- **VERIFIED** `GET /` redirects to `/admin`: `routes/web.php:8`.
- **VERIFIED** branded public surfaces are `GET /s/{brand}/{catalog}` and `GET /m/{brand}/{catalog}`: `routes/web.php:14-17`.
- **VERIFIED** preview is `GET /preview/{token}` with throttling: `routes/web.php:17`.
- **VERIFIED** QR redirect/download routes exist: `routes/web.php:21-26`.
- **VERIFIED** analytics ingestion is only `POST /api/events`: `routes/api.php:6-8`.
- **VERIFIED** Filament generates `/admin/login`, password-reset, email-verification, logout, and profile routes through panel configuration: `app/Providers/Filament/AdminPanelProvider.php:28-33`.
- **UNAVAILABLE** no product landing page route, product signup/register route, branded auth BFF endpoint, or central-auth callback was found.

### 3.2 Current auth provider and session

- **VERIFIED** auth uses Laravel's local `web` session guard and Eloquent `App\Models\User`: `config/auth.php:18-20,40-68`.
- **VERIFIED** local users contain a hashed local password and email verification timestamp: `app/Models/User.php:15-33`; `database/migrations/0001_01_01_000000_create_users_table.php:14-21`.
- **VERIFIED** panel access requires `is_active` and non-null `email_verified_at`: `app/Models/User.php:44-47`.
- **VERIFIED** database-backed sessions are the default; HTTP-only is true, SameSite is `lax`, and encryption/secure-cookie behavior is environment controlled: `config/session.php:21,50,172,185,202`. `.env.example:30-32` requests database sessions and encryption.
- **VERIFIED** the panel label is `Saga Menu`: `app/Providers/Filament/AdminPanelProvider.php:28-30`.
- **UNAVAILABLE** no Saga Platform identity client, JWKS/assertion validator, OAuth/OIDC flow, service authentication, central ID mapping, or product-account access check was found.

**Current auth conclusion:** authentication, reset, verification, password hash, and session creation are entirely local. The current login page is minimally product-branded through Filament, but it does not meet the decided central-identity architecture.

## 4. Verified local product model

| Capability | Status | Current source of truth and evidence |
|---|---|---|
| User | VERIFIED | Local `users`; password, verification, activity, and global role in `app/Models/User.php:15-33`. No central ID. |
| Organization/business | VERIFIED | `organizations` with business type, status, plan, locale, currency, timezone, contact, address, settings: `database/migrations/2026_07_07_000002_create_saga_menu_core_tables.php:11-26`. |
| Membership/team | VERIFIED | `organization_user`, roles owner/manager/editor, primary flag, invitation/acceptance; status/deactivation added in `database/migrations/2026_07_16_000003_complete_pilot_controls.php:21-25`. |
| Owner invariant | VERIFIED | Membership mutation is transactional and locked in `app/Services/OrganizationMembershipService.php:12-57`; application observers prevent loss of the final active owner in `app/Providers/AppServiceProvider.php:87-112`. |
| Invitation | VERIFIED | Email-bound, hashed one-time token, 7-day expiry, accepted only by matching signed-in email: `app/Services/OrganizationInvitationService.php:15-66`. |
| Outlet/location | VERIFIED | `locations` is organization-scoped with address, maps, timezone, hours, default and active flags: core migration `:42-55`. |
| Catalog/menu | VERIFIED | `catalogs` is organization/location scoped, supports two surfaces, photo/list mode, theme fields, business info and draft/published state: core migration `:80-109`. |
| Category | VERIFIED | `collections`: core migration `:137-148`. |
| Item/menu offering | VERIFIED | `offerings` includes descriptions, price/promo, availability, visibility, dietary/allergen fields and external action metadata: core migration `:151-191`. |
| Modifier/add-on | VERIFIED | Variant groups/options, option groups/options, offering-option pivots and inclusions exist: core migration `:215-265`. |
| Media/image | VERIFIED | `media_assets` stores image-oriented metadata and offering media relations: core migration `:58-78,203-213`. |
| Video | PLACEHOLDER | Generic `media_assets.type` could represent video, but dashboard upload only permits image and font MIME types: `app/Filament/Resources/MediaAssets/MediaAssetResource.php:36-42`. No verified video processing/player pipeline. |
| Theme/custom font | VERIFIED | `catalogs.appearance`, uploaded font relation, and `custom_fonts` exist: core migration `:87,103,267-276`; catalog UI `app/Filament/Resources/Catalogs/CatalogResource.php:82-94`. |
| QR | VERIFIED | `qr_routes` supports code, source, destination surface, and active/paused/archive state: core migration `:304-315`. |
| Custom domain | UNAVAILABLE | No custom-domain table, domain verification, certificate, DNS, routing, or ownership flow was found. |
| Preview | VERIFIED | Expiring hashed preview tokens with snapshot payload: core migration `:292-302`; `app/Services/Publishing/PreviewTokenService.php:15-38`. |
| Publish | VERIFIED | Validates visible category/item, locks catalog, creates immutable checksummed snapshot, atomically switches active snapshot, supports restore/unpublish: `app/Services/Publishing/CatalogPublisher.php:20-112`. |
| Analytics | VERIFIED | Allowlisted public events, idempotent `event_id`, hashed session key and constrained metadata: `app/Http/Controllers/AnalyticsEventController.php:15-59`. Raw events are locally retained for 180 days: `app/Models/AnalyticsEvent.php:19-23`. |
| Package/plan | VERIFIED (storage only) | `organizations.plan_key`; `subscriptions` has plan/status/dates/entitlements; demo has catalogs/custom-font/analytics values: core migration `:367-377`, `database/seeders/DemoCoffeeMenuSeeder.php:267-273`. |
| Entitlement/quota/license enforcement | UNAVAILABLE | No quota ledger, license table, usage counter enforcement, or access middleware consuming `entitlements` was found. Subscription fields are editable free text by SagaDev admin: `app/Filament/Resources/Subscriptions/SubscriptionResource.php:28-50`. |
| Billing/payment | VERIFIED (manual records only) | Local invoice records and admin CRUD exist: core migration `:379-390`; `app/Filament/Resources/Invoices/InvoiceResource.php:28-55`. No payment provider/webhook/central synchronization was found. |
| Pilot state | VERIFIED | Organization has onboarding, pilot, attention, reason and pilot timestamps: `database/migrations/2026_07_16_000003_complete_pilot_controls.php:11-19`. |

## 5. Ownership boundary

### 5.1 Saga Platform central source of truth

The following boundary is a **PLACEHOLDER contract required by the decided architecture**, not current implementation:

- central identity and verified email;
- central user status;
- central organization/tenant identity;
- product account and provisioning status;
- trial, subscription, payment status, plan, entitlement, quota policy, and license;
- cross-product access and aggregate product health/usage/commerce reporting.

### 5.2 SagaMenu local source of truth

The following is **VERIFIED local product data** and must remain local:

- local user projection and secure product session, but not a duplicated password hash after migration;
- local organization projection, membership projection, locations/outlets;
- catalogs, categories, offerings, modifiers/add-ons, inclusions;
- media, video assets when implemented, theme, custom fonts;
- QR routes, preview tokens, publish snapshots;
- granular visitor analytics, search terms, offering/category slugs, session hashes;
- local operational audit logs, support issues, backup records, and product settings.

### 5.3 Allowed central report

**PLACEHOLDER allowlist:** organization/product-account IDs, reporting period, plan and entitlement version, lifecycle/provisioning/health state, aggregate counts of active catalogs/outlets/team seats/storage bytes, and coarse aggregate views/engagement/QR/search counts. Aggregate commerce data may include invoice/payment status and totals already owned by Saga Platform.

**Explicitly local-only:** catalog names/content/descriptions/prices, category/item/modifier structure, media/font files and URLs, raw analytics events, search terms, session hashes, visitor identifiers, customer contact fields, and granular per-item analytics. `top_searches`, `top_offerings`, `qr_sources`, and raw slugs must not be sent centrally without a separate privacy contract.

## 6. Target lifecycle

All central calls and events below are **PLACEHOLDER** pending Saga Platform's actual API specification.

1. **Visitor:** customer opens a SagaMenu-owned landing page.
2. **Signup submitted:** branded `POST /signup` is handled by SagaMenu BFF. It sends a generated `Idempotency-Key` to central `POST /v1/product-signups` with `product_code=sagamenu`.
3. **Pending verification:** SagaMenu displays a neutral pending screen. The central service owns verification state and sends the email; its link returns to the SagaMenu branded callback using a short-lived opaque code.
4. **Central identity verified:** SagaMenu BFF exchanges the code server-to-server and validates issuer, audience, signature, expiry, nonce/JTI, product and organization claims.
5. **Central organization/product account/trial:** Saga Platform creates or links the organization, creates the SagaMenu product account, applies the trial/plan/entitlements, and sets provisioning status.
6. **Local provisioning:** an authenticated, replay-protected event invokes the idempotent local provisioning job.
7. **Ready:** SagaMenu creates a local session from the validated central assertion and routes the owner to branded onboarding.
8. **Trialing/active:** central access response controls entitlement and product-account status; SagaMenu keeps operational data local.
9. **Expired/suspended/cancelled:** central event updates a local access projection. Admin capability/public-catalog behavior follows an owner-approved access matrix; destructive deletion is forbidden.
10. **Paid/reactivated:** payment/subscription state is central; an entitlement/account event re-enables permitted capabilities idempotently.

The current product implements only local login/verification/session plus manually editable local subscription records. Steps 2-10 are not yet integrated.

## 7. Recommended provisioning workflow

| Order | Step | Source of truth | Idempotency/rollback |
|---|---|---|---|
| 1 | Accept branded signup at SagaMenu BFF | SagaMenu attempt record, central identity result | Generate `sagamenu:signup:<uuid>`; never derive key from email. |
| 2 | Central create/link user and organization | Saga Platform | Reusing the key must return the same semantic result. Duplicate normalized email returns a link/verification state, never account-existence detail to the browser. |
| 3 | Create product account, trial, subscription, entitlement and license | Saga Platform | Central transaction/saga; status `provisioning_pending`. |
| 4 | Deliver `product_account.provisioning_requested.v1` | Saga Platform event | Unique `event_id`; at-least-once delivery; signed service request. |
| 5 | Persist inbox receipt and enqueue job | SagaMenu | Unique `event_id` and idempotency key before side effects. Duplicate returns the prior result. |
| 6 | Upsert local user/organization ID mappings and active owner membership | SagaMenu projection | One DB transaction with unique central IDs; enforce at least one active accepted owner. |
| 7 | Create optional default location and one starter catalog | SagaMenu | Stable deterministic keys scoped to `product_account_id`; catalog stays `draft`, never auto-publish empty content. |
| 8 | Upsert local access/subscription projection | Saga Platform is authoritative | Store central state/version only; never make local billing records authoritative. |
| 9 | Send provisioning result | SagaMenu to Saga Platform | Same request id on retry; central moves to `provisioned` or `provisioning_failed`. |
| 10 | Create local session after validated exchange | SagaMenu | Rotate session ID; session refers to mapped central user/product account. |

**Retry:** 3 attempts with exponential backoff and jitter for timeout, `429`, and `5xx`; honor `Retry-After`. Do not retry validation/authentication `4xx`. Recommended connect timeout is 3 seconds and total request timeout 10 seconds.

**Rollback/compensation:** mark provisioning failed and remove only newly created, still-empty local draft records associated with that provisioning attempt. Never delete pre-existing linked organizations/catalogs. Central account remains authoritative and retryable. Deprovision/suspension must be non-destructive.

## 8. Recommended integration surfaces

Canonical machine-readable fields are in `docs/saga-platform-integration-contract.json`.

### 8.1 SagaMenu BFF to Saga Platform

- `POST /v1/product-signups`
- `POST /v1/auth/password/login`
- `POST /v1/auth/code/exchange`
- `POST /v1/auth/password/reset-requests`
- `POST /v1/auth/password/resets`
- `GET /v1/products/sagamenu/accounts/{product_account_id}/access`
- `POST /v1/products/sagamenu/provisioning-results`
- `POST /v1/products/sagamenu/usage-reports`

### 8.2 Saga Platform to SagaMenu adapter

- `POST /api/integrations/saga-platform/v1/provision`
- `POST /api/integrations/saga-platform/v1/access-sync`
- `POST /api/integrations/saga-platform/v1/account-status-sync`
- `POST /api/integrations/saga-platform/v1/deprovision`
- `GET /api/integrations/saga-platform/v1/health`

Every endpoint name, field, and event in this section is **PLACEHOLDER** until accepted by both product and Saga Platform owners.

## 9. Identifier mapping

Recommended local additions, all **PLACEHOLDER**:

- `users.central_user_id`: nullable, opaque string/UUID, unique after backfill.
- `organizations.central_organization_id`: nullable, opaque string/UUID, unique after backfill.
- new `product_accounts`: `central_product_account_id`, local organization, product code, provisioning/access status, plan/entitlement/license versions and central timestamps.
- new `identity_links`: legacy local user to central user, linking method/status/evidence timestamps, no password material.
- new `integration_inbox` and `integration_outbox`: unique event/request IDs, sanitized payload hash, status, attempt counts and timestamps.

Local integer IDs must never be assumed to equal central IDs. API and event payloads carry both central IDs and only the minimum necessary local correlation IDs.

## 10. Legacy account migration

1. **Inventory:** normalize email case/whitespace and identify duplicate local emails, shared-email accounts, inactive users, unverified users, and conflicting tenant owners.
2. **Pre-link:** central lookup by a privacy-safe server API. Automatic linking requires exact normalized email plus verified central identity; ambiguous records go to manual review.
3. **Password strategy:** never copy, expose, compare remotely, or duplicate local password hashes. During a bounded compatibility window, an existing local password may be verified only inside SagaMenu, followed by central credential enrollment/reset. New credentials are then owned solely by central identity.
4. **Central-first login:** use central login when linked. For an unlinked legacy record, use a feature-flagged local fallback only to initiate secure linking, not as permanent dual auth.
5. **Tenant ownership:** preserve every local organization membership and primary-owner relationship. Conflicting claims require owner/admin review; never silently merge organizations.
6. **Duplicate email:** do not auto-merge users or memberships. Require verified ownership and explicit resolution, with audit trail.
7. **Compatibility period:** retain local password hash only for the approved migration window, stop all local password changes, and show a neutral linking/recovery flow.
8. **Rollback:** feature flag can return unlinked users to bounded local login; already linked accounts stay central-first. Do not delete mappings or local domain data during rollback.
9. **Completion:** remove local-password login only after migration metrics and support gates pass; subsequently null/drop password material through a separately approved migration.

## 11. Security and privacy risks

| Risk | Severity | Required control |
|---|---|---|
| Forged central assertion | Critical | Asymmetric signature verification, pinned issuer/audience/product, key rotation via trusted JWKS, short expiry, algorithm allowlist. |
| Replay of auth code/webhook | Critical | One-time code, nonce/JTI cache, unique `event_id`, timestamp tolerance, body digest, durable inbox. |
| Cross-tenant IDOR | Critical | Resolve every local record through mapped `central_organization_id`/`product_account_id`; retain policy checks and owner invariant. |
| Password/hash duplication | Critical | Central owns credentials; never transmit or store central password/hash locally. |
| Account enumeration | High | Same browser response for unknown/existing email on signup, reset, and linking. |
| Duplicate provisioning | High | Unique central IDs/idempotency keys, transactional upsert, at-least-once-safe handlers. |
| Stale entitlement | High | Versioned entitlement snapshot, short cache TTL, event sync plus periodic reconciliation, fail closed for privileged mutations. |
| Unsafe suspension/deprovision | High | Non-destructive state transition, audit log, explicit public-catalog policy, reversible reactivation. |
| Central leakage of product data | High | Report allowlist, schema validation, no raw catalog/search/session/media payloads. |
| Session fixation/theft | High | Rotate session after exchange, HTTPS/secure/HTTP-only cookies, encrypted database sessions, CSRF protection, inactivity/absolute expiry. |
| Service credential compromise | High | Asymmetric keys in secret manager, scoped audience, key rotation, no secrets in logs/config docs. |
| Sensitive logs | Medium | Redact tokens, auth codes, email, assertion payloads and request bodies; store correlation ID and payload hash only. |

Recommended service auth is a short-lived JWT (maximum 60 seconds) with `iss`, `sub`, `aud`, `iat`, `exp`, `jti`, `kid`, and a SHA-256 body digest, signed asymmetrically over TLS. Exact algorithm, issuer, audience and JWKS location are **BLOCKED** on Saga Platform security ownership.

## 12. Minimal branded UI change

All screens remain on the SagaMenu domain and use SagaMenu branding.

- `/signup`: name, email, password, business name/type, terms consent; submit to SagaMenu BFF.
- `/login`: email/password; optional future central MFA step displayed in the same branded flow.
- `/forgot-password` and `/reset-password`: neutral responses that do not disclose account existence.
- `/verify-email`: pending, resend cooldown, expired link, already verified.
- `/auth/callback`: short-lived processing screen; opaque code is exchanged server-side and removed from browser history.
- `/provisioning`: `preparing`, `ready`, `retrying`, or safe support state with correlation ID only.
- Dashboard status banner: trial remaining, active, grace, expired, suspended, cancelled; copy and dates must come from central access data, not hardcoded local values.

Safe error copy examples: `Kami belum dapat menyelesaikan proses ini. Coba lagi atau hubungi dukungan dengan kode referensi.` Do not expose whether an email exists, upstream response bodies, IDs, stack traces, token state, or payment details.

## 13. Required tests

### Contract and authentication

- signup is idempotent for identical key and rejects key reuse with a different payload;
- login/verification/reset stay on the SagaMenu domain;
- assertion rejects wrong signature, issuer, audience, product, expiry, `nbf`, nonce and replayed `jti`;
- local session is rotated and created only after successful central assertion validation;
- no central password/hash/token is persisted in SagaMenu;
- generic signup/reset responses prevent account enumeration.

### Provisioning and tenancy

- duplicate/reordered provisioning events create exactly one local projection;
- retry after partial failure converges without duplicate organization, owner, location or catalog;
- owner membership is active/accepted and final owner cannot be demoted, deactivated or removed;
- central organization/product account cannot access another tenant's local records;
- failed provisioning reports a sanitized stable error code and remains retryable;
- suspension/deprovision is non-destructive and reactivation restores access.

### Entitlement, publish and reporting

- stale/lower entitlement versions are ignored;
- quota is enforced atomically on create/upload/publish paths;
- expired/suspended behavior follows the approved access matrix;
- publish snapshot remains atomic and rollback remains available;
- central reports contain only allowlisted aggregates and no raw catalog/search/session/media data;
- report retry is idempotent by organization, period and report version.

### Migration

- linked, unlinked, duplicate-email, changed-email, inactive and unverified legacy users;
- users with multiple organizations/products;
- conflicting owner records require manual resolution;
- local fallback cannot be used after compatibility expiry;
- rollback keeps domain data and mappings intact.

## 14. Acceptance gates

1. **Source gate - BLOCKED:** SagaMenu has an immutable committed source revision.
2. **Central contract gate - BLOCKED:** Saga Platform owner supplies base URL, schema/OpenAPI, actual endpoint/event names, ID format, lifecycle enums and versioning policy.
3. **Identity security gate - BLOCKED:** security owner approves signed assertion/service-auth profile, JWKS rotation, replay window and secrets management.
4. **Data boundary gate - PLACEHOLDER:** product/privacy owners approve central report allowlist and retention.
5. **Lifecycle gate - BLOCKED:** business owner decides grace, expiry, cancellation and suspension behavior for dashboard mutations and already-published public catalogs.
6. **Provisioning gate - PLACEHOLDER:** transactional local projection, inbox/outbox, idempotent retries and central result callback pass integration tests.
7. **Migration gate - PLACEHOLDER:** duplicate email/ownership inventory, compatibility duration, support runbook and rollback drill are approved.
8. **UI gate - PLACEHOLDER:** signup/login/reset/verification/provisioning remain branded and pass mobile accessibility/error-state review.
9. **Security gate - PLACEHOLDER:** tenancy, replay, token validation, session, enumeration, rate-limit and log-redaction tests pass.
10. **Release gate - UNAVAILABLE:** staging end-to-end test with actual Saga Platform sandbox and webhook retries has not been run.

## 15. Inputs required from owners

- **Saga Platform API owner:** base URLs, OpenAPI/schema, sandbox, central enum set, ID formats, idempotency semantics, event delivery guarantees, reconciliation API.
- **Identity/security owner:** password/MFA/reset/verification UX contract, assertion format, issuer/audience, JWKS and key rotation, service auth, replay policy.
- **Product/business owner:** trial duration, plans, entitlements, quotas, license semantics, grace/expiry/suspension/cancellation/reactivation access matrix, custom-domain scope.
- **Privacy owner:** aggregate reporting allowlist, retention, lawful basis/consent and deletion/export obligations.
- **Migration owner:** compatibility window, duplicate email and owner-conflict policy, support escalation and rollback authority.
- **Repository owner:** commit the SagaMenu tree or provide an immutable source artifact before implementation review.

## 16. Final discovery summary

### VERIFIED

- Laravel/Filament local session authentication, local password/reset/verification and branded admin label.
- Local multi-tenant organization, membership, outlet, catalog, category, item, modifier, image/font media, theme, QR, preview, publish snapshot, analytics, manual subscription/invoice, and pilot-state foundations.
- Owner roles, invitation checks, publish validation, analytics allowlist and local granular analytics retention.

### PLACEHOLDER

- Every Saga Platform endpoint/event/field in the recommended contract.
- Branded central signup/login/reset/verification exchange, central ID mapping, product-account projection, inbox/outbox, provisioning, entitlement enforcement, aggregate reporting and legacy migration implementation.
- Video upload/processing and custom-domain product behavior.

### BLOCKED / UNAVAILABLE

- Immutable SagaMenu source commit.
- Actual Saga Platform API and security contract.
- Product decisions for lifecycle access, trial/plan/quota/license, public catalog behavior on suspension/expiry, privacy allowlist and compatibility period.
- Staging/runtime proof against a Saga Platform sandbox.

The machine-readable companion contract is `docs/saga-platform-integration-contract.json`.
