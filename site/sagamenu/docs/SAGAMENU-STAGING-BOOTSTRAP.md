# SagaMenu Laravel VPS Staging Bootstrap

Status: local implementation only. This document does not authorize a Laravel
deployment and does not describe the existing Vercel prototype as the SagaMenu
SaaS runtime.

## Purpose

The staging bootstrap is a fail-closed contract between an immutable SagaMenu
release, a real staging target, and target-generated operational evidence. It
must pass before database migration or release symlink switching.

The existing `sagamenu:release-preflight` remains the release approval gate. The
new `sagamenu:staging-bootstrap-preflight` adds 55 infrastructure and runtime
checks and will not infer missing provider state.

## Existing App Audit

| Role | Finding | Decision |
| --- | --- | --- |
| Product Orchestrator | The largest remaining risk is operational staging evidence, not another customer feature. | Keep this batch isolated to release readiness. |
| UX Workflow Architect | No customer workflow changes are needed. | No UI scope. |
| UI Visual Designer | No visual asset is needed for a server preflight. | No UI scope. |
| Frontend Engineer | The Vercel review prototype is a separate artifact. | Do not modify or relabel it. |
| Backend Architect | Laravel already had a 44-check release manifest gate. | Compose with it instead of replacing it. |
| Database & Integration Engineer | PostgreSQL, Redis, S3 storage, backup, and Saga Platform need target evidence. | Require explicit round-trip results. |
| Security Engineer | Config presence is not proof; raw credentials must never enter evidence. | Accept booleans and relative evidence references only. |
| QA & Acceptance Engineer | Happy-path tests alone could let placeholders pass. | Test stale probes, SHA mismatch, missing capabilities, and secret redaction. |
| DevOps & Release Engineer | A preflight after migration is too late. | Run both preflights before shared storage linking and migration. |
| Code Review & Production Auditor | No provider, target, backup restore, or UAT exists locally. | Keep status `IMPLEMENTED_NOT_DEPLOYED`. |

## Research Primer

- Laravel 13 requires PHP 8.3 or newer and its documented PHP extensions. Its
  web server must direct requests to `public`, production debug must be off, and
  an application health route should be monitored.
- Laravel queues need a configured backend and a continuously running worker.
  Redis configuration by itself is not worker evidence.
- Laravel scheduling requires one scheduler invocation every minute.
  `schedule:list` confirms registration, while SagaMenu's heartbeat confirms
  execution.
- Laravel's S3-compatible filesystem support proves adapter compatibility, not
  provider connectivity. SagaMenu therefore requires a disposable
  write/read/delete probe for both application and backup disks.
- PostgreSQL's `pg_isready` checks server connection status. SagaMenu additionally
  requires an application query, migration state, `pg_dump`, `pg_restore`, and a
  disposable restore rehearsal.

Official references:

- https://laravel.com/docs/13.x/deployment
- https://laravel.com/docs/13.x/queues
- https://laravel.com/docs/13.x/filesystem
- https://laravel.com/docs/13.x/scheduling
- https://laravel.com/docs/13.x/redis
- https://www.php.net/manual/en/function.extension-loaded.php
- https://www.postgresql.org/docs/16/app-pg-isready.html
- https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html
- https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html

## Files

- `release/sagamenu-staging-manifest.json`: reviewed release approval contract.
- `release/sagamenu-staging-probe.json`: target-generated non-secret facts.
- `release/sagamenu-staging-probe.example.json`: deliberately failing template.
- `deploy/scripts/staging-bootstrap-preflight.sh`: immutable source and host tool
  wrapper.
- `app/Services/Release/StagingBootstrapContract.php`: pure evaluator.
- `app/Console/Commands/StagingBootstrapPreflight.php`: JSON parser and CLI.

Do not commit the real staging probe or provider evidence. The example contains
no credential and must remain red.

## Required Evidence

The probe binds to:

1. The exact 40-character source commit.
2. The exact release ID.
3. The SHA-256 of the exact release manifest bytes.
4. The same HTTPS staging URL.
5. A generation time no more than
   `SAGAMENU_STAGING_PROBE_MAX_AGE_MINUTES` old.

It then records non-secret outcomes for:

- PHP 8.3+, required extensions, Composer, Git, Node, npm, PostgreSQL tools,
  ffmpeg, and ClamAV.
- PostgreSQL query and migration state.
- Redis cache and queue connections.
- Separate S3-compatible application and backup disk round trips.
- Redis queue worker consumption and failed-job review.
- Scheduler registration and fresh SagaMenu heartbeat.
- Real staging mail handshake.
- Monitoring alert acknowledgement.
- Video worker, ffmpeg, and malware scan round trip.
- HTTPS reachability, valid TLS, and HTTP 200 health.
- Verified offsite backup and disposable PostgreSQL restore.
- Saga Platform disabled, or a signed round trip to a non-production sandbox.
- Previous immutable release, database compatibility, rollback rehearsal, and
  rollback health.

Evidence references must be relative paths under `evidence/`. URLs, absolute
paths, placeholders, and parent directory traversal are rejected. The referenced
files themselves must stay in the secured release evidence store, not Git.

## Staging Procedure

Run these steps only after a real staging host and provider credentials are
available:

1. Checkout the reviewed release as a detached, clean 40-character SHA.
2. Create the real release manifest from the example and obtain owner, security,
   UAT, backup, and rollback approvals.
3. Compute the manifest digest:

   ```bash
   sha256sum release/sagamenu-staging-manifest.json
   ```

4. Run disposable provider probes on the staging target. Record only booleans,
   timestamps, driver names, and relative evidence references in
   `release/sagamenu-staging-probe.json`.
5. Keep secrets in the server secret manager or protected environment. Never
   write passwords, access keys, tokens, customer data, catalog content, media,
   or visitor-level analytics into the probe or evidence index.
6. Run:

   ```bash
   SAGAMENU_COMMIT=<exact-40-character-sha> \
   SAGAMENU_RELEASE_MANIFEST=release/sagamenu-staging-manifest.json \
   SAGAMENU_STAGING_PROBE=release/sagamenu-staging-probe.json \
   bash deploy/scripts/staging-bootstrap-preflight.sh
   ```

7. Stop if any gate fails. Do not migrate, switch the current symlink, or restart
   workers.
8. After all gates pass, run the reviewed deployment process for that exact SHA.
   Smoke-test the health route and operator-critical flows, then record the
   release result.

## Rollback

The code change can be rolled back by reverting its immutable commit. At runtime,
the deployment remains blocked before migration, so a failed bootstrap requires
no database rollback. A real staging deployment may proceed only when the probe
names and verifies a previous immutable release and demonstrates database
compatibility and a successful rollback rehearsal.

## Current Blockers

- No real Laravel VPS staging target.
- No PostgreSQL, Redis, S3-compatible storage, queue worker, mail, monitoring,
  or video worker provider evidence.
- No HTTPS health proof from the Laravel runtime.
- No offsite backup plus disposable restore evidence.
- No Saga Platform sandbox evidence; Saga Platform must remain disabled until
  that evidence exists.
- No exact-release owner UAT or rollback rehearsal.
