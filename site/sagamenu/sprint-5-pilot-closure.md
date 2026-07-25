# Saga Menu Sprint 5 Pilot Closure

## Status

ready

## Execution Gate

allowed for local implementation and verification; external staging deployment requires an available host and credentials.

## Target Environment

local/dev with production-ready VPS artifacts

## Goal

Close every product and operational item identified after Wave 1-4, then run a controlled pilot dry run with evidence.

## Acceptance Criteria

### Sprint 5A

- The application prevents deactivating, demoting, or removing the last active Owner.
- Owners can invite and manage team memberships from Filament.
- Catalog and offering duplication preserve supported nested content without sharing mutable child records.
- Collection and offering tables support persistent reorder.
- Quick availability publish atomically updates only availability and creates a new active snapshot.
- QR download returns PNG and a stable QR continues to follow catalog/organization slug changes.
- Three appearance presets apply controlled values and remain editable.
- Offering gallery media can be managed from the owner dashboard.
- Rollup-based insights include top offerings, collections, searches, and QR sources.
- Long-copy and missing-media fixtures are covered by tests/browser checks.
- An owner journey creates content, previews, publishes, restores, and unpublishes without SQL.

### Sprint 5B

- Backup contains database, media archive, manifest, checksums, and optional offsite copy.
- Restore verification validates a fresh backup locally and a production restore script exists.
- Health/monitoring checks cover database, cache, storage, failed jobs, scheduler heartbeat, and backup freshness.
- CI, Nginx, Supervisor, scheduler, deploy, rollback, and environment templates are executable/documented.
- PostgreSQL/Redis validation is run when the required runtime is available; otherwise the missing external gate is recorded.

### Sprint 5C

- Organizations have onboarding, pilot, and attention states with operator-facing controls.
- SagaDev has a Needs Attention view and owners have onboarding progress visibility.
- A pilot tenant dry run is executed across dashboard, Mobile Catalog, Store Display, QR, analytics, support, backup, and restore verification.
- Security and production audit reports contain explicit GO/NO-GO decisions and residual risks.

## Non-Goals

- Cart, order, payment, POS, inventory, booking, or loyalty.
- Purchasing or provisioning a VPS without owner-provided provider access.
- Claiming external monitoring, SMTP delivery, TLS, or offsite storage without runtime evidence.

## Max Iteration Rounds

2
