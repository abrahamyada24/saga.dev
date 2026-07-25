# SagaMenu Product Decisions - 25 July 2026

## Decision owner

Andreas is the final owner for duplicate identity, tenant ownership, and migration conflict decisions.

## Trial

- Approved duration: 14 days.
- Saga Platform remains the source of truth for trial start and `trialEndsAt`.
- SagaMenu records and enforces the canonical central response; it does not calculate or invent trial state.
- Recommended central plan code: `sagamenu_trial`.

## Paid plan

Keep one paid MVP plan:

| Plan | Billing cycle | Price |
| --- | --- | ---: |
| SagaMenu Pro | Monthly | Rp100.000 |
| SagaMenu Pro | Annual | Rp1.000.000 |

Recommended central plan code: `sagamenu_pro`.

Annual billing saves Rp200.000 compared with twelve monthly payments, an effective discount of approximately 16.7%.

The product checkout allowlist is:

```json
{
  "sagamenu_pro:monthly": 100000,
  "sagamenu_pro:annual": 1000000
}
```

The plan code, subscription status, and lifecycle version must still come from Saga Platform. SagaMenu owns only the approved checkout price allowlist.

## Restricted public catalog

Public content is available only when the mapped central account and subscription are `active` or `trialing`.

For every other mapped state, including `past_due`, `expired`, `suspended`, `cancelled`, and `provisioning_failed`:

- Store Display does not expose catalog content.
- Bio Menu does not expose catalog content.
- Existing preview tokens do not expose draft content.
- QR links keep their destination but land on the maintenance response.
- The customer sees a generic maintenance page with no billing or account-status disclosure.
- Response is HTTP 503 with `Cache-Control: no-store, private` and `Retry-After: 3600`.
- Disabling the Saga Platform network feature does not bypass the last known restriction.

Organizations that have not been mapped to Saga Platform remain on the legacy behavior during migration.

## Legacy compatibility deadline

- Compatibility fallback remains disabled by default.
- Approved cutoff: 1 August 2026 at 23:59:59 Asia/Jakarta.
- Only unmapped legacy users may use fallback after central returns `PLT_AUTH_FAILED`.
- Central-mapped users can never use the local password path.
- If staging and migration are not ready by the cutoff, leave compatibility disabled. Any extension requires a new explicit decision from Andreas.

## Recommended MVP commercial policy

- Do not add more paid tiers before pilot usage shows a real quota or feature boundary.
- Do not let the browser submit prices.
- Do not expose suspension or payment details on public menu pages.
- Do not delete local catalogs when access is restricted.
- Reactivation restores the same published catalog after the canonical central status becomes `active` or `trialing`.
- Refund, proration, renewal, tax, and failed-payment retry rules remain Saga Platform/payment-provider decisions.
