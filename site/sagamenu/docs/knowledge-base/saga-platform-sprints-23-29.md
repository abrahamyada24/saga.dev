# Saga Platform Sprints 23-29 Knowledge Base

## Support summary

SagaMenu central integration is implemented and locally tested, but is disabled by default and must not be described as staging-ready.

## Authentication

- Signup and login stay on SagaMenu branded pages.
- Password credentials go server-to-server to Saga Platform.
- SagaMenu accepts a signed assertion only after nonce-bound exchange.
- Central-origin users have no local password hash.
- Local session creation requires a valid assertion and `active` or `trialing` product access.

## Safe customer messages

- Verification required: ask the customer to complete email verification.
- Provisioning pending/failed: keep local data and retry provisioning.
- Past due/expired/suspended/cancelled: show the branded account-status page.
- Public Store Display, Bio Menu, QR destinations, and preview tokens show only the generic maintenance page for restricted mapped accounts.
- Contract response incomplete: do not guess plan or status; escalate to the Saga Platform owner.
- Identity binding conflict: route to manual review; never auto-merge.

## Legacy compatibility

Legacy fallback is off by default. The approved cutoff is 1 August 2026 at 23:59:59 Asia/Jakarta. It applies only to unmapped local users after central authentication returns `PLT_AUTH_FAILED` and must never be used for a user that already has `central_user_id`. Andreas owns manual migration conflict decisions.

## Billing

Only an active organization owner or SagaDev admin can create checkout or lifecycle requests. `sagamenu_pro` costs Rp100.000 monthly or Rp1.000.000 annually. Price comes from the server-side allowlist, and a persistent local ledger keeps retries idempotent.

## Privacy

Usage reports contain exactly seven allowlisted aggregate keys. Catalog content, media, fonts, visitor-level analytics, search terms, and session identifiers are forbidden.

## Rollback

Disable `SAGAMENU_SAGA_PLATFORM_ENABLED`, refresh configuration, and verify central sessions are invalidated. Rollback is non-destructive.

## Escalation

Escalate contract mismatch, central credential, lifecycle event schema, payment semantics, and sandbox availability to the Saga Platform owner. Escalate duplicate email and tenant ownership conflicts to the migration owner.
