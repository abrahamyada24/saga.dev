# SagaMenu Deployment Report

Date: 2026-07-29
Overall status: PARTIALLY_DEPLOYED

## Deployed

The static SagaMenu review prototype was deployed to the existing verified
Vercel project.

- Project: `sagamenu-prototype-review`
- Project ID: `prj_fnhuPOgIhoonBXI4FUzVw3BqY7sY`
- Target: Vercel production review artifact
- Deployed source: `8baf5c0f0f6a0692e64990e54a7dc545fb725f8b`
- Source branch: `codex/sagamenu-wave2-sprint22`
- Deployment ID: `dpl_AHsyuBoTxYNmTyBaAwQcshtY6hCQ`
- Immutable URL:
  `https://sagamenu-prototype-review-9ob7bf0pq-andreas-projects16.vercel.app`
- Stable review URL: `https://sagamenu-prototype-review.vercel.app`
- Vercel state: `READY`
- Alias error: none

The deployed source was clean and matched the pushed remote branch before
deployment. This is the first recorded prototype deployment in this sequence
without Vercel's `gitDirty` marker.

## Delivered source batches

- `edbda7ec`: content operations and UI/UX Sprints 18-25.
- `90c6347f`: fail-closed release manifest and staging preflight.
- `8baf5c0f`: regression harness alignment for Quick Ops inline fields.
- Earlier immutable delivery commits remain in history:
  - `2b745783`: public ETag, cache, and stateless delivery.
  - `b3c375dd`: delivery evidence.
  - `1e027ce1`: live mobile catalog sitemap.

## Validation

Local release validation:

- Laravel: 85 tests, 562 assertions passed.
- Laravel Pint: passed.
- Vite production build: passed.
- Composer production dependency audit: zero advisories.
- npm production dependency audit: zero vulnerabilities.
- Prototype contract: 11 routes and 96 actions passed.
- Sprint 0, Sprint 1, Sprint 2, complete-wave, Sprints 9-17, Sprints
  18-25, and full prototype E2E passed.

Public deployment validation:

- Stable URL returned HTTP 200.
- CSP, HSTS, `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, and strict referrer policy were present.
- Sprint 0, Sprint 1, Sprint 2, Sprints 18-25, and full E2E passed against
  the stable URL.
- No console error, page error, horizontal overflow, unnamed desktop button,
  or Vercel runtime error was observed.

## Rollback

The previous production review deployment remains `READY` and is listed by
Vercel as a rollback candidate:

- Deployment ID: `dpl_Hetn3PTgi4sdwrwsuz9CnTPrkqAH`
- Immutable URL:
  `https://sagamenu-prototype-review-3xvb2exov-andreas-projects16.vercel.app`

No rollback was executed because the new deployment and public acceptance
checks passed. Rollback remains an alias promotion to the previous immutable
deployment.

## Not deployed: Laravel SaaS

The Laravel/VPS runtime was not deployed. The fail-closed release preflight
returned 10 passed and 34 failed checks. Missing real evidence includes:

- approved HTTPS staging VPS and release operator;
- PostgreSQL;
- Redis queue and cache;
- S3-compatible application and offsite backup storage;
- scheduler, mail, monitoring, malware scan, and video worker;
- secure staging runtime configuration;
- backup restore and rollback rehearsal;
- previous compatible immutable Laravel release;
- Saga Platform non-production sandbox rehearsal;
- owner review and human UAT.

The central integration remains disabled. Prototype `localStorage`, demo data,
and Vercel static hosting are not evidence for Laravel persistence, tenancy,
uploads, queues, billing, or central identity.

## Operational warning

Drive D had approximately 111 MB free at the final audit. Git reported one
temporary pack and several temporary object files totaling about 232.82 MB.
They were identified as rebuildable Git garbage, but deletion was blocked by
the execution policy. No source, valid Git pack, refs, or user data was removed.
