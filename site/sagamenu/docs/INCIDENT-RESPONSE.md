# Saga Menu Incident Response

## Severity

- Critical: cross-tenant data exposure, credential compromise, destructive data loss, or full outage.
- High: publish failure affecting multiple clients, backup failure beyond one cycle, or admin access bypass.
- Medium: isolated client error with workaround.
- Low: visual or content issue without data/security impact.

## First Response

1. Record detection time, reporter, affected organization, and visible symptoms.
2. Preserve logs and audit records.
3. For suspected data exposure, disable affected access and rotate relevant credentials.
4. For public rendering failure, keep or restore the latest known-good active snapshot.
5. Notify the named incident owner.

## Recovery

- Use maintenance mode only when necessary.
- Roll back application release if schema compatibility permits.
- Restore data only into an isolated environment first.
- Validate tenant isolation, active snapshots, and audit records before reopening access.

## Aftercare

- Document root cause, impact window, data involved, corrective actions, and prevention owner.
- Convert every corrective action into a test, monitoring rule, or runbook update.
