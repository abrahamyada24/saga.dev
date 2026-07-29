# SagaMenu Public Media Loading Heartbeat Evidence

Date: 29 July 2026, 23:01 WIB heartbeat
Status: `IMPLEMENTED_NOT_DEPLOYED`

## Source and Isolation

- Remote base:
  `68883d686a7a00c89e7eeccdae367d763326c8f8`
- Implementation commit:
  `e08f04cb57c4c37beb4d60121bb7295afa5c72bd`
- Branch: `codex/sagamenu-public-menu-workflow`
- Workspace:
  `C:\Users\Windows 11\.codex\isolated\sagamenu-heartbeat-2301`
- Git common directory: local `.git` inside the isolated clone.
- Drive `D:` worktree, its 43 historical changes, source, and user data were not
  read for mutation, staged, reset, cleaned, or committed.
- Implementation commit contains exactly 10 scoped files.

## Selected Batch

Public Media Loading Budget:

- preserve optional image dimensions in newly generated immutable snapshots;
- prioritize exactly one first card image on each public surface;
- lazy-load remaining card, dialog, and gallery images;
- set hidden detail videos to `preload="none"` without autoplay;
- retain old snapshot compatibility;
- patch four development build dependencies covered by current npm advisories.

The Vercel prototype was not changed or treated as the Laravel SaaS runtime.

## Validation

| Gate | Result |
| --- | --- |
| Focused public/media regression | PASS - 19 tests, 202 assertions |
| Full Laravel suite | PASS - 95 tests, 623 assertions |
| Public surface priority image | PASS - exactly one per Bio Menu and Store Display |
| Remaining card images | PASS - lazy |
| Dialog and gallery images | PASS - all lazy |
| Known image dimensions | PASS - width and height rendered |
| Old snapshot compatibility | PASS - missing dimensions do not break rendering |
| Hidden detail video | PASS - `preload="none"`, no autoplay |
| Vite production build | PASS |
| Reproducible `npm ci` | PASS |
| Pint | PASS |
| Composer security audit | PASS - no advisories |
| npm full dependency audit | PASS - 0 vulnerabilities |
| Bash deploy/preflight syntax | PASS |
| Git whitespace check | PASS |

## Security and Release Boundaries

- No upload validation, URL policy, tenant authorization, analytics retention,
  authentication, or provider code changed.
- No migration or snapshot rewrite was run.
- Existing snapshots are read compatibly; dimensions appear after a future
  operator publish.
- The release and staging bootstrap implementation is byte-unchanged from the
  base.
- The secret-free example staging bootstrap remains fail-closed:
  5 passed, 50 failed, 55 total.
- No Laravel target, database, provider, DNS, TLS, queue, scheduler, backup, or
  customer environment was changed.

## Claim Boundary

Local tests prove generated HTML attributes, snapshot compatibility, and
application regressions. They do not prove field LCP, transferred bytes, mobile
network behavior, CDN behavior, or real video startup. Those measurements
require a real Laravel staging target and browser/network traces for the exact
release.

## Rollback

Before deployment:

```bash
git revert e08f04cb57c4c37beb4d60121bb7295afa5c72bd
```

Rollback is code-only. No schema, provider, snapshot rewrite, customer data, or
infrastructure rollback is required.

## Remaining Blockers

1. Real Laravel VPS staging target and all 55 bootstrap gates.
2. Exact-release browser QA on mobile and tablet with request waterfall, LCP,
   CLS, image failures, and video open/play traces.
3. Real provider, backup/restore, HTTPS, monitoring, UAT, and rollback evidence.
4. Human owner review of the deterministic first-image heuristic.

No deployment is authorized by this evidence.
