# SagaMenu Live Sitemap Sprint

Date: 2026-07-29
Status: IMPLEMENTED_NOT_DEPLOYED
Scope: one isolated improvement after Public Menu Delivery Resilience

## Problem and operator value

SagaMenu had public Store Display and Bio Menu routes but no machine-readable
discovery surface for live catalogs. A sitemap reduces manual URL discovery work
after a menu is published while keeping draft and commercial access rules intact.

This is deliberately a discovery improvement, not an indexing promise. Search
engines still decide whether and when a URL is crawled or indexed.

## Ten-role audit

| Role | Decision |
| --- | --- |
| Product Orchestrator | List only customer-facing Bio Menu URLs. Do not turn the kiosk surface into a second canonical URL. |
| UX Workflow Architect | No dashboard workflow is added; publish remains the only operator action that changes discoverability. |
| UI Visual Designer | No visual change. |
| Frontend Engineer | No client bundle change. |
| Backend Architect | Generate XML from immutable active snapshots and configured application origin. |
| Database & Integration Engineer | Read existing catalog, snapshot, organization, account, and subscription projections; add no schema. |
| Security Engineer | Exclude maintenance tenants and reject invalid `APP_URL`; never derive canonical URLs from an untrusted Host header. |
| QA & Acceptance Engineer | Parse XML in tests and cover live, disabled, unpublished, restricted, cache, cookie, and invalid-origin behavior. |
| DevOps & Release Engineer | Keep route stateless and reuse the public ETag/cache middleware; provider submission remains a later release task. |
| Code Review & Production Auditor | Isolate controller, route, test, and this evidence file from the 43 pre-existing dirty items. |

## Contract

- Endpoint: `GET /sitemap.xml`
- Media type: `application/xml; charset=UTF-8`
- Canonical surface: mobile Bio Menu only (`/m/{brand}/{catalog}`)
- Source: active immutable catalog snapshots
- Included: active snapshot, unarchived catalog, mobile surface enabled, public
  access policy permits the organization
- Excluded: Store Display, preview URLs, drafts, unpublished catalogs, archived
  catalogs, disabled mobile surfaces, and maintenance tenants
- Origin: `config('app.url')`; an invalid value fails closed with HTTP 503
- Delivery: stateless, no session cookie, strong ETag, conditional 304, shared
  cache policy inherited from `PublicCatalogDelivery`
- Capacity: first 50,000 eligible catalogs, matching the single-sitemap protocol
  limit; catalogs are read in bounded database batches
- `lastmod`: active snapshot `published_at`, representing the last significant
  published content change

## Acceptance criteria

- XML is well formed and has the sitemap protocol namespace.
- A seeded live catalog produces one fully qualified mobile URL.
- Store Display and preview URLs never appear.
- Unpublished, mobile-disabled, archived, or restricted catalogs never appear.
- The route emits no `Set-Cookie`.
- A matching `If-None-Match` returns bodyless HTTP 304.
- An invalid canonical application URL returns HTTP 503.
- Existing Laravel tests and production build remain green.
- Only this sprint's files are staged and committed.

## Risks and controls

- Duplicate surfaces: list mobile only.
- Draft leakage: read `activeSnapshot.payload`, not mutable catalog content.
- Tenant leakage: reuse `PublicCatalogAccessPolicy`.
- Host-header poisoning: use configured `APP_URL`.
- Stale discovery: the ETag changes with XML output and published timestamps.
- Scale ceiling: one sitemap is capped at 50,000 URLs; a sitemap index is a
  future requirement before this limit is approached.

## Release and rollback

Release remains blocked until an exact commit is accepted for a configured
staging target and passes environment, backup/restore, security, UAT, and public
smoke gates.

Rollback is code-only: revert the sitemap commit or remove the named route. It
adds no migration, queue job, scheduled task, object-storage object, or customer
data mutation. The existing public catalog routes continue independently.

## Sources

- Google Search Central, Build and submit a sitemap:
  <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>
- Google Search Central, Create and submit a robots.txt file:
  <https://developers.google.com/crawling/docs/robots-txt/create-robots-txt>
- Sitemaps XML format:
  <https://www.sitemaps.org/protocol.html>
