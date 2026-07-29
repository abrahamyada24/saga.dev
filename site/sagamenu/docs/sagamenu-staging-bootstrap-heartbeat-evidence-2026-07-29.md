# SagaMenu Staging Bootstrap Evidence - 2026-07-29

## Decision

`IMPLEMENTED_NOT_DEPLOYED`

The Laravel VPS staging bootstrap contract is implemented and locally verified
at implementation commit:

`fae791a801a3078192c146cf015ff05178e9e14a`

No Laravel application, migration, provider configuration, DNS, TLS, customer
data, or live service was changed. The Vercel review prototype was not modified
or reclassified as the Laravel SaaS runtime.

## Scope Provenance

- Starting clean commit:
  `bb5f3aac54bb5c19c59216713a684f0117c6f42d`
- Implementation commit:
  `fae791a801a3078192c146cf015ff05178e9e14a`
- Branch: `codex/sagamenu-wave2-sprint22`
- Files in the implementation commit: 10
- Older SagaMenu changes included in this batch: none
- User data or non-rebuildable artifacts removed: none

## Storage Audit

After validation, drive `D:` had approximately 11.6 MiB free. Git reported:

- pack storage: 1.19 GiB;
- temporary garbage: 14 files, 232.82 MiB;
- largest temporary file:
  `.git/objects/pack/tmp_pack_4hg0xX`, 232.38 MiB.

All cleanup candidates matched Git-generated `tmp_pack_*` or `tmp_obj_*` files
inside the resolved `.git/objects` directory. Cleanup was not performed because
the host policy rejected file deletion. No alternative garbage collection,
source deletion, build deletion, or user-data cleanup was attempted.

## Validation

| Check | Result |
| --- | --- |
| Full Laravel suite | PASS - 92 tests, 602 assertions |
| Targeted staging tests | PASS - 11 tests, 63 assertions |
| Pint | PASS |
| PHP syntax for new PHP files | PASS |
| Vite production build | PASS |
| Composer security audit | PASS - no advisories |
| npm production dependency audit | PASS - 0 vulnerabilities |
| `deploy.sh` Bash syntax | PASS |
| `staging-bootstrap-preflight.sh` Bash syntax | PASS |
| Git whitespace check | PASS |
| Worktree after implementation validation | clean |

## Negative Gate Evidence

Direct existing release preflight with the secret-free example manifest:

- Status: failed
- Passed: 10
- Failed: 34

The 34 failures remain the known immutable source, target, provider, acceptance,
rollback, and runtime blockers. They were not converted into success by local or
prototype evidence.

Composed staging bootstrap preflight with both example files:

- Status: failed
- Bootstrap passed: 5
- Bootstrap failed: 50
- Bootstrap total: 55
- Nested base preflight passed: 9
- Nested base preflight failed: 35

The nested base count is one higher because the example probe explicitly reports
`appKeyConfigured=false`; the direct command reads the locally configured
development key. Neither command exposes the key or any provider value.

Automated negative cases cover:

- malformed JSON without payload echo;
- stale target evidence;
- release manifest digest mismatch;
- source commit mismatch and dirty source;
- missing PHP extensions and required host executables;
- PostgreSQL, Redis, S3, queue worker, HTTPS, and restore failures;
- Saga Platform sandbox without a signed round trip;
- rollback without rehearsal;
- URL or traversal-shaped evidence references;
- secret-like fields excluded from evaluator output;
- deployment ordering before migration and release switching.

## Release Gate

Laravel staging remains blocked until a real target provides all of the
following for the exact implementation release:

- immutable release manifest and matching target probe;
- PHP 8.3+ and required extensions;
- PostgreSQL connectivity, migration review, backup, and disposable restore;
- Redis cache and queue connectivity plus worker consumption;
- separate S3-compatible application and backup storage round trips;
- scheduler heartbeat, real mail handshake, monitoring alert acknowledgement,
  and video worker round trip;
- valid HTTPS health endpoint;
- Saga Platform disabled or verified against a signed non-production sandbox;
- exact-release owner UAT, security review, backup approval, and rollback
  rehearsal.

No staging deployment may start while either the 44-check release preflight or
55-check bootstrap preflight is red.

## Rollback

Before deployment, rollback is:

```bash
git revert fae791a801a3078192c146cf015ff05178e9e14a
```

The new deploy gate executes before shared storage linking, database migration,
worker restart, or current symlink switching. A bootstrap failure therefore
leaves the previous runtime untouched.
