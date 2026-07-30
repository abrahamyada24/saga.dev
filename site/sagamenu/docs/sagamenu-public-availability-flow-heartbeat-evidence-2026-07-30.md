# SagaMenu Public Availability Flow Evidence

Date: 30 July 2026
Status: `IMPLEMENTED_NOT_DEPLOYED`

## Source and Isolation

- Base: `455d254c5253634ceb8b6174ebebbb00457a1ffb`
- Implementation commit:
  `107dd5d8e2e860107793a6a08f303d402aa2e559`
- Branch: `codex/sagamenu-public-availability-state`
- Workspace:
  `C:\Users\Windows 11\.codex\isolated\sagamenu-heartbeat-2301`
- The implementation commit contains exactly 16 scoped files.
- The historical D-drive worktree, its existing dirty items, and user data were
  not staged, reset, cleaned, committed, or deployed.

## Before and After

Before:

- the table action silently toggled only available and sold out;
- temporary, coming-soon, and seasonal states were collapsed in admin previews;
- seasonal was grayscaled as unavailable on public cards;
- card and detail labels were maintained separately;
- unknown snapshot values could appear available in the dialog;
- every unavailable item was counted as a sold-out open.

After:

- the operator selects one of five named states in a focused modal;
- the successful action publishes a new immutable snapshot and confirms the
  resulting label;
- failure rolls back both the item state and active snapshot;
- dashboard, editor preview, Bio Menu, Store Display, card, and detail use one
  canonical resolver;
- seasonal is informational and available while its existing schedule is
  active;
- unknown values fail closed as `Ketersediaan belum dikonfirmasi`;
- only explicit sold-out items emit `sold_out_opened`.

## Validation

| Gate | Result |
| --- | --- |
| Focused availability flow | PASS - 5 tests, 80 assertions |
| Full Laravel suite | PASS - 100 tests, 703 assertions |
| Operator modal | PASS - current state, five choices, explanatory copy |
| Operator publish success | PASS - notification and row state update |
| Publish rollback | PASS - item and active snapshot unchanged on failure |
| Immutable snapshot | PASS - canonical public state, no Filament-only color metadata |
| Store Display tablet 1024 x 768 | PASS - state visible, no grayscale, no overflow |
| Bio Menu mobile 390 x 844 | PASS - card/detail state visible, no overflow |
| Browser console/page errors | PASS - none observed |
| Public status accessibility | PASS - visible text cue; color is supplementary |
| Vite production build | PASS |
| Pint | PASS |
| Composer security audit | PASS - no advisories |
| npm dependency audit | PASS - 0 vulnerabilities |
| Bash deployment script syntax | PASS through Git Bash |
| Git whitespace check | PASS |

Local browser evidence was recorded under ignored QA storage:

- `storage/app/qa-availability-flow/operator-status-modal-1440.png`
- `storage/app/qa-availability-flow/operator-status-success-1440.png`
- `storage/app/qa-availability-flow/store-seasonal-tablet-1024.png`
- `storage/app/qa-availability-flow/bio-seasonal-detail-mobile-390.png`

The local QA server was stopped after the run. These screenshots and the local
SQLite fixture are acceptance evidence only, not production runtime evidence.

## Security and Release Gates

- No migration, provider, credential, tenant boundary, upload policy, or
  customer data changed.
- Unknown availability values fail closed.
- Snapshot payload excludes Filament-only presentation metadata.
- Public analytics no longer overstates sold-out engagement.
- The staging bootstrap parser still behaves fail closed:
  5 passed, 50 failed, 55 total.
- The nested release preflight remains failed:
  9 passed, 35 failed, 44 total.
- No Laravel staging or production URL/release exists for this commit.
- The existing Vercel prototype was not changed and is not evidence for the
  Laravel SaaS.

## Rollback

Before deployment:

```bash
git revert 107dd5d8e2e860107793a6a08f303d402aa2e559
```

Rollback is code-only. The additive snapshot field is ignored by older code;
there is no schema, provider, infrastructure, or customer-data rollback.

## Deployment Blocker and Next Action

The concrete blocker is the absence of a real Laravel staging target and its
signed 55-gate probe: PostgreSQL, Redis, S3-compatible application and backup
storage, queue, scheduler, mail, monitoring, video worker, HTTPS, backup restore,
Saga Platform sandbox or disabled-mode evidence, exact-release UAT, and rollback
rehearsal are not available.

Next action: provision the real staging target, generate the probe for this exact
reviewed release, close all failed gates, then run mobile/tablet/operator smoke
and owner UAT before any deploy decision.
