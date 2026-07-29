# SagaMenu Release Hygiene and Staging Preflight

Status: local implementation only
Deployment status: not deployed

## Purpose

This gate prevents a local prototype, dirty worktree, moving branch, placeholder
provider, or incomplete UAT record from being treated as a staging release.
It does not create infrastructure and it never verifies a provider merely
because an environment variable exists.

## Existing App Audit

### Code Review and Production Auditor

- The current Sprint 18-25 worktree contains reviewed but uncommitted changes.
- The previous deploy script defaulted to the moving `main` branch.
- Automated product tests were green, but there was no single machine-readable
  release decision joining source, providers, acceptance, and rollback.

### Security

- Release output reports only boolean/configuration state and check IDs.
- Credential values, webhook URLs, database passwords, storage keys, and customer
  data are never written to the manifest or command result.
- Saga Platform may remain disabled. If enabled, verified central sandbox
  evidence becomes mandatory.

### QA

- The preflight is fail-closed.
- Placeholder manifests, dirty source, non-HTTPS target, local storage, log mail,
  incomplete UAT, and missing rollback evidence fail.
- Static tests enforce preflight ordering before migration and symlink switch.

### DevOps

- `deploy/scripts/deploy.sh` now requires a full immutable commit SHA.
- Checkout commit equality and clean status are verified before dependency
  installation.
- Runtime preflight runs before database migration and current-release switch.

### Product

- This batch does not widen SagaMenu scope or change customer-facing behavior.
- The next release decision remains blocked on source finalization, staging
  provider ownership, human UAT, backup/restore proof, and rollback rehearsal.

## Release Manifest

Start from:

`release/sagamenu-staging-manifest.example.json`

Create the real file outside Git or in an approved release-evidence location:

`release/sagamenu-staging-manifest.json`

Do not put secrets in it. Every provider and acceptance entry uses:

```json
{
  "status": "verified",
  "evidenceRef": "evidence/reference-without-secret"
}
```

An evidence reference identifies a ticket, report, checksum, or test artifact.
It must not contain a credential, token, customer identifier, or private payload.

## Local Command

```bash
php artisan sagamenu:release-preflight \
  --manifest=release/sagamenu-staging-manifest.json
```

Machine-readable output:

```bash
php artisan sagamenu:release-preflight \
  --manifest=release/sagamenu-staging-manifest.json \
  --json
```

The command returns non-zero when any gate fails.

## Staging Runtime Contract

Required:

- `APP_ENV=staging`
- `APP_DEBUG=false`
- HTTPS `APP_URL`
- configured `APP_KEY`
- PostgreSQL
- S3-compatible default object storage
- Redis queue and cache
- encrypted database/Redis sessions with secure cookies
- real staging mail transport
- S3-compatible offsite backup disk
- monitoring destination
- required malware scanning
- required video processing
- built Vite manifest

Provider manifest entries are separately required for database, object storage,
queue, scheduler, mail, monitoring, and backup. Runtime configuration alone is
not accepted as proof that a provider works.

## Deployment Contract

The deployment operator must supply:

```bash
export SAGAMENU_REPOSITORY="<approved repository>"
export SAGAMENU_COMMIT="<approved full 40-character SHA>"
export SAGAMENU_RELEASE_MANIFEST="release/sagamenu-staging-manifest.json"
```

Do not run deployment until the manifest passes from a clean checkout and the
target host, repository, commit, backup, rollback target, and operator are
approved.

## Rollback

Application rollback:

1. Stop the release if preflight fails. No migration or symlink switch has run.
2. If failure happens after activation, run `deploy/scripts/rollback.sh` with the
   approved previous immutable release path.
3. Restart workers and run `sagamenu:health-check`.
4. Verify admin login, Bio Menu, Store Display, and QR routes.

Database rollback:

- A symlink rollback is allowed only when `rollback.databaseCompatibility` is
  verified in the manifest.
- Destructive schema rollback requires a separate approved migration plan and
  backup/restore evidence.
- Never delete central mappings, catalog data, audit batches, translations, or
  analytics merely to roll back an application release.

## Current Blockers

- Sprint 18-25 changes have not been finalized into a reviewed immutable commit.
- No approved staging URL or target host is recorded.
- Database, object storage, Redis, scheduler, mail, monitoring, and backup
  provider evidence is unavailable.
- Human owner review and UAT evidence is incomplete.
- Backup restore and rollback rehearsal have not been run on staging.
- Saga Platform central sandbox evidence remains unavailable and the feature
  flag must stay off.
