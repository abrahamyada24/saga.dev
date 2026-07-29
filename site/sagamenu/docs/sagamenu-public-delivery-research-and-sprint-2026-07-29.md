# SagaMenu Public Delivery Research and Sprint

Date: 29 July 2026
Status: implementation strategy and local evidence
Product boundary: preview-only e-menu and e-catalog

## Existing App Audit

### Product and operator

- Availability and sold-out can be updated individually or in a tenant-scoped
  idempotent batch.
- Publish uses an active immutable snapshot, so drafts do not leak.
- The operator can review catalog health before publish.
- The highest remaining operational risk is delivery during repeat traffic and
  transient origin failure, not the editing workflow itself.

### Public experience

- Category navigation, search recovery, dietary filters, locale fallback,
  reduced motion, visible focus, and no-autoplay are implemented.
- Public images use native lazy loading, but every card currently uses lazy
  loading. First-viewport eager/LCP selection and responsive derivatives remain
  future media-pipeline work.
- Live pages allow indexing but do not yet publish canonical URL or LocalBusiness
  structured data.

### Data, analytics, and security

- Public catalogs resolve the catalog through its organization relationship.
- Draft and preview access remain separate from live snapshot access.
- Analytics uses an event allowlist, rate limit, aggregate rollup, and excludes
  raw search text and direct visitor identity.
- Existing tenant checks align with deny-by-default and per-object authorization,
  but cross-tenant tests must remain mandatory for every new mutation.

### Failure state

- Restricted subscriptions return a generic HTTP 503 maintenance page with
  `no-store` and no catalog content.
- Live payload is cached inside Laravel, but successful public HTML previously
  had no explicit ETag or shared-cache failure policy.

## Official Research Findings

1. MDN documents that reusable HTTP responses reduce browser transfer and origin
   work. ETag plus `If-None-Match` allows a `304 Not Modified` response without a
   response body.
   - https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
   - https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag
2. MDN defines `stale-while-revalidate` for serving stale responses while
   refreshing and `stale-if-error` for 500, 502, 503, and 504 upstream failures.
   - https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
3. Laravel supports route-specific middleware and response post-processing,
   matching a narrow public-delivery policy without changing admin or API routes.
   - https://laravel.com/docs/13.x/middleware
4. Laravel `Cache::flexible` supports application-level stale-while-revalidate.
   The current active-snapshot payload cache can adopt it later, but changing
   payload freshness in this dirty worktree would widen this sprint.
   - https://laravel.com/docs/13.x/cache
5. web.dev recommends eager loading for first-viewport/LCP images and native lazy
   loading below the fold. It also recommends `srcset` and `sizes` so browsers
   choose an appropriate derivative.
   - https://web.dev/articles/browser-level-image-lazy-loading
   - https://web.dev/articles/serve-responsive-images
6. WCAG 2.2 requires visible, unobscured focus, usable target sizing, meaningful
   labels, non-text alternatives, reflow, and predictable focus behavior.
   - https://www.w3.org/TR/WCAG22/
7. Google Search documents `LocalBusiness` and `Restaurant` structured data,
   including a fully qualified `menu` URL. Structured data requires real business
   facts and therefore should not be generated from incomplete demo fields.
   - https://developers.google.com/search/docs/appearance/structured-data/local-business
8. OWASP recommends least privilege, deny by default, permission checks on every
   request, relationship-aware authorization, and tests for object access.
   - https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html

## Prioritized Gaps

| Rank | Gap | Value | Isolation |
| --- | --- | --- | --- |
| 1 | ETag and resilient public-cache policy | Faster repeat loads and origin-failure tolerance | High |
| 2 | First-viewport and responsive image derivatives | Better LCP and lower image bytes | Blocked by media pipeline |
| 3 | Canonical URL and validated LocalBusiness JSON-LD | Search discoverability | Needs approved business facts |
| 4 | Service-worker offline menu | Full offline revisit | Higher stale-content and invalidation risk |
| 5 | Field performance telemetry | Real device insight | Needs consent, retention, and staging endpoint |

## Selected Sprint

### Problem

Live Bio Menu and Store Display rendered correctly but did not expose conditional
validators or a shared-cache resilience contract.

### Operator and business value

- Repeat visitors can revalidate with a bodyless response.
- A managed cache may shield a short origin failure with the last successful
  public menu.
- Browser freshness remains zero, preserving rapid availability updates.

### Scope

- One route middleware applied only to live Store Display and Bio Menu.
- Live public routes are stateless and do not emit a session cookie.
- Strong ETag derived from rendered public HTML.
- `Accept-Encoding` variation.
- Browser `max-age=0`.
- Shared-cache freshness of 60 seconds.
- Stale revalidation of 30 seconds.
- Stale-on-error window of 24 hours.

Excluded:

- preview tokens;
- maintenance and error responses;
- admin and authentication;
- API and analytics;
- service workers and offline write behavior;
- CDN-specific purge APIs.

### Acceptance criteria

1. First successful live response includes ETag and the approved cache contract.
2. Matching `If-None-Match` returns HTTP 304 with an empty body.
3. A new publish changes the ETag and returns HTTP 200 immediately at origin.
4. Store and mobile surfaces use independent validators.
5. Preview response never receives shared-cache directives or ETag.
6. Successful live responses do not emit `Set-Cookie`.
7. Existing maintenance `no-store` behavior remains unchanged.
8. Full Laravel, browser E2E, build, formatting, and dependency audits pass.

### Risk and mitigation

- Shared caches may show sold-out state up to 60 seconds late. Keep browser
  freshness at zero and shared freshness bounded to 60 seconds.
- Stale-on-error can show old public availability during an outage. This is
  preferable to a blank menu, but the UI must never present ordering capability.
- Content hashing still renders at origin. It saves transfer and enables managed
  cache behavior; snapshot-derived early 304 is a future optimization.

### Release and rollback

- No deployment in this sprint.
- Remove `PublicCatalogDelivery` from the two routes to disable the policy.
- Removing the middleware does not change schema, snapshots, analytics, or
  customer data.
