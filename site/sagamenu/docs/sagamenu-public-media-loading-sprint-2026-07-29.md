# SagaMenu Public Media Loading Sprint

Date: 29 July 2026
Status: implementation and local validation
Base: `68883d686a7a00c89e7eeccdae367d763326c8f8`
Boundary: preview-only public e-menu; no ordering

## Existing App Audit - 10 Roles

| Role | Verified finding | Sprint decision |
| --- | --- | --- |
| Product Orchestrator | Operators already have draft/publish, quick sold-out, bulk availability, and immutable live snapshots. | Improve customer browsing instead of adding another editor control. |
| UX Workflow Architect | Store Display and Bio Menu already expose category, search, filters, and detail dialogs. | Preserve the current information architecture. |
| UI Visual Designer | Menu photography is the dominant public visual signal. | Keep the current composition and stabilize image space. |
| Frontend Engineer | Every card image was lazy, every hidden dialog hero image was eager, and every hidden video requested metadata. | Prioritize one card image and defer detail media. |
| Backend Architect | Snapshot payload is the public source of truth. | Add optional dimensions to the snapshot contract. |
| Database & Integration Engineer | `media_assets` already stores width and height. | No migration or provider integration. |
| Security Engineer | Existing media URLs and sanitization boundaries are unchanged. | Do not add proxying, upload, or credential scope. |
| QA & Acceptance Engineer | Existing public tests cover content, cache, maintenance, and draft isolation but not media loading hints. | Add DOM-level contract tests for both surfaces. |
| DevOps & Release Engineer | The 55-gate staging bootstrap must remain fail-closed. | No deploy or release-script change. |
| Code Review & Production Auditor | Real network savings require staging/browser evidence later. | Report local markup guarantees only. |

## Research Primer

- Restaurant operators need availability changes to reach customer channels
  quickly. Square documents immediate available/sold-out controls and scheduled
  resets, reinforcing that public browsing should not be slowed by unrelated
  media requests.
- web.dev recommends that the likely LCP image should not be lazy and may use
  `fetchpriority="high"`, while below-fold images should use lazy loading.
- web.dev recommends explicit image width and height so browsers reserve space
  before image bytes arrive and reduce layout shifts.
- MDN documents `preload="none"` as the option that avoids preloading video
  content before playback. This fits SagaMenu because videos live inside
  customer-opened detail dialogs and never autoplay.
- WCAG 2.2 requires non-text alternatives, reflow, visible focus, and predictable
  interaction. Existing alt text, native dialog, focus return, and reduced-motion
  behavior remain unchanged.

Official references:

- https://squareup.com/help/gb/en/article/8495-beta-item-availability
- https://squareup.com/us/en/releases/food-and-beverage
- https://web.dev/learn/design/responsive-images
- https://web.dev/articles/responsive-web-design-basics
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video
- https://www.w3.org/TR/WCAG22/

## Selected Batch

### Problem

The first visible card image was delayed like a below-fold asset, while every
hidden item dialog could load its hero image and video metadata before the
customer opened it. Larger catalogs therefore had a media request pattern that
grew with item count.

### Operator and customer value

- The first menu image can be discovered and prioritized earlier.
- Hidden item detail media no longer competes with first-viewport browsing.
- Explicit dimensions reserve image space and reduce visual movement.
- Video remains available on demand without autoplay or initial metadata cost.

### Scope

- Preserve image width and height in newly published immutable snapshots.
- Mark exactly one first available card image as eager/high priority per surface.
- Keep other card, dialog, and gallery images lazy.
- Change hidden dialog video from metadata preload to no preload.
- Retain compatibility with old snapshots that lack image dimensions.
- Apply available patch-only fixes for high-severity development toolchain
  advisories and re-run the complete dependency audit.

Excluded:

- image resizing or CDN derivatives;
- `srcset` and format negotiation;
- service worker or offline cache;
- dashboard/editor changes;
- provider configuration;
- prototype changes;
- Laravel deployment.

## Acceptance Gates

1. A newly published snapshot includes optional media width and height.
2. Bio Menu and Store Display each render exactly one eager/high-priority card
   image when an image exists.
3. Remaining card images and all dialog/gallery images are lazy.
4. Hidden videos use `preload="none"` and do not autoplay.
5. Images with known dimensions render width and height attributes.
6. Old snapshots without dimensions still render successfully.
7. Public cache, maintenance, draft isolation, analytics, and accessibility
   behavior remain green.
8. Full tests, build, formatting, and production dependency audits pass.

## Risk, Release, and Rollback

- A customer opening a detail immediately may wait briefly for its deferred
  media. The card image and fallback remain visible.
- The first card image is a deterministic heuristic, not field LCP evidence.
- Existing snapshots receive the new dimensions only after a future publish;
  their rendering remains backward compatible.
- Rollback is a code revert only. No schema, snapshot rewrite, provider, user
  data, or infrastructure rollback is required.
- Deployment remains blocked by the existing 44-check release and 55-check
  staging bootstrap gates.
