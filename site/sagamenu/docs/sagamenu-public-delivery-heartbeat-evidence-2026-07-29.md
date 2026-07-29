# SagaMenu Public Delivery Heartbeat Evidence

Date: 29 July 2026, 16:09-20:02 WIB heartbeat
Status: `IMPLEMENTED_NOT_DEPLOYED`
Branch: `codex/sagamenu-wave2-sprint22`
Base commit: `067653264a240a5a80d0a7a094a76676210f0717`
Implementation commit: `2b7457835c152bac325b9ddaa3e51b9dd0ea2a0c`

## Ownership and Isolation

- Initial worktree state: 43 modified or untracked status entries.
- The delivery batch introduced six isolated status entries.
- The implementation commit contains exactly five code, config, test, route,
  and research files.
- This evidence file is committed separately, leaving the same 43 pre-existing
  status entries unstaged.
- No pre-existing item was reset, deleted, staged, or committed.
- The temporary changelog section was removed because that file was already
  modified before this batch.

Batch files:

- `app/Http/Middleware/PublicCatalogDelivery.php`
- `config/sagamenu.php`
- `routes/web.php`
- `tests/Feature/PublicCatalogDeliveryTest.php`
- `docs/sagamenu-public-delivery-research-and-sprint-2026-07-29.md`
- `docs/sagamenu-public-delivery-heartbeat-evidence-2026-07-29.md`

## Research Result

The audit covered operator availability updates, public browsing speed,
accessibility, image loading, SEO, privacy-light analytics, failure behavior,
and multi-tenant authorization.

The selected gap was explicit public delivery resilience:

- live HTML had no conditional validator;
- successful public pages had no managed-cache failure policy;
- the first implementation test exposed a Laravel session cookie on otherwise
  public cacheable responses.

Official documentation used:

- MDN HTTP caching, ETag, 304, stale-while-revalidate, and stale-if-error;
- Laravel 13 middleware, responses, cache, and scoped routing;
- web.dev native lazy loading and responsive images;
- WCAG 2.2 focus, target, text alternative, and reflow requirements;
- Google Search LocalBusiness and Restaurant structured data;
- OWASP authorization and per-object permission validation.

## Implementation

- Strong SHA-256 ETag for successful live Store Display and Bio Menu HTML.
- Conditional `If-None-Match` support returning HTTP 304 without a body.
- Browser freshness of zero seconds.
- Shared freshness of 60 seconds.
- Stale-while-revalidate window of 30 seconds.
- Stale-if-error window of 24 hours.
- Independent validators for store and mobile surfaces.
- Session, shared-error-session, and CSRF cookie middleware excluded only from
  the two read-only live public routes.
- Preview, maintenance, privacy, admin, auth, API, and analytics remain outside
  the shared public-cache policy.

## Validation

| Gate | Result |
| --- | --- |
| Targeted delivery tests | 4 passed, 26 assertions |
| Public and content regression | 20 passed, 182 assertions before stateless hardening |
| Public plus delivery regression after stateless hardening | 16 passed, 183 assertions |
| Laravel full suite | 82 passed, 534 assertions |
| Production frontend build | Passed |
| Prototype action contract | 11 routes, 96 actions |
| Sprint 18-25 browser E2E | Passed, zero browser errors |
| Complete prototype browser regression | Passed |
| Conditional transfer contract | First body greater than 1 KB; repeat body 0 bytes with 304 |
| Publish invalidation | Old ETag returns fresh HTTP 200 and new ETag |
| Public cookie isolation | No `Set-Cookie` on live public response |
| Composer production audit | 0 advisories |
| npm production audit | 0 vulnerabilities |
| Pint | Passed |
| Git diff whitespace check | Passed |

## Risk

- A managed cache may show availability up to 60 seconds behind the origin.
- During an eligible upstream error, stale public information may be served for
  up to 24 hours.
- SagaMenu remains preview-only, so stale information cannot submit an order.
- CDN behavior still requires provider-specific staging proof before activation.

## Rollback

1. Remove `PublicCatalogDelivery` from the two live routes.
2. Restore the normal web middleware list on those routes.
3. Remove the delivery middleware, config block, focused test, and this sprint
   documentation.
4. Run the full Laravel and browser regression suites.

No schema, snapshot, catalog, analytics, account, or customer data changes are
required for rollback.

## Blockers

1. The 43-entry pre-existing diff still lacks final provenance approval.
2. Drive `D:` recovered from zero bytes to approximately 293 MB free without
   deleting any project, source, user data, or rebuildable artifact in this run.
3. Staging target, provider evidence, backup, rollback rehearsal, Andreas review,
   and human UAT remain intentionally postponed.

## Next Action

At the evening review:

1. Review the immutable delivery implementation and evidence commits.
2. Review the 60-second shared freshness and 24-hour failure window.
3. Resolve provenance of the 43 remaining worktree entries independently.
4. Keep deployment blocked until the release preflight and staging evidence are
   fully verified.
