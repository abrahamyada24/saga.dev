# Saga Menu VPS Runbook

## Runtime

- Ubuntu LTS or equivalent.
- Nginx.
- PHP 8.3+ with `intl`, `mbstring`, `pdo_pgsql`, `redis`, `fileinfo`, `opcache`, and `gd`.
- PostgreSQL 16+.
- Redis 7+.
- Supervisor or systemd for queue workers.
- Cron for Laravel scheduler.
- TLS certificate with automatic renewal.

## Release Sequence

1. Put the application in maintenance mode when a migration is not backward compatible.
2. Pull the reviewed release into a timestamped release directory.
3. Run `composer install --no-dev --prefer-dist --optimize-autoloader`.
4. Run `npm ci && npm run build` outside the web request path.
5. Run `php artisan migrate --force`.
6. Run `php artisan optimize` and `php artisan filament:optimize`.
7. Point the current symlink to the new release.
8. Restart PHP-FPM and queue workers.
9. Run `php artisan sagamenu:health-check`.
10. Verify `/up`, one Mobile Catalog, one Store Display, and admin login.

## Scheduler

```cron
* * * * * cd /var/www/sagamenu/current && php artisan schedule:run >> /dev/null 2>&1
```

Scheduled responsibilities:

- Analytics rollup at 00:15.
- Backup at 01:15.
- Expired preview/event pruning at 02:15.
- Health check every five minutes.

## Queue Worker

Run at least one supervised worker:

```text
php artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
```

Restart workers after each release with `php artisan queue:restart`.

## Backup

- `php artisan sagamenu:backup` creates a PostgreSQL custom dump and public-media manifest.
- Copy backups to a separate machine/object-storage bucket. Local-only backup is not sufficient.
- Encrypt remote backups and restrict restore credentials.
- Keep daily backups for 14 days and weekly backups for at least 8 weeks during pilot.

## Restore Drill

1. Provision an isolated restore database.
2. Run `pg_restore --clean --if-exists --no-owner --dbname=<restore_db> <dump_file>`.
3. Restore media from the matching remote backup.
4. Configure a staging `.env` against the restored database.
5. Run `php artisan sagamenu:health-check`.
6. Verify admin login, active snapshot rendering, QR redirect, and latest audit entries.
7. Record restore duration, dump timestamp, result, and operator.

## Monitoring

Minimum alerts:

- `/up` unavailable for two consecutive checks.
- Queue has failed jobs.
- Scheduler has not completed for ten minutes.
- Disk usage above 80%.
- PostgreSQL connection or replication failure.
- HTTP 5xx error rate above pilot baseline.
- Backup file missing for more than 26 hours.

## Rollback

1. Point the current symlink to the previous release.
2. Restart PHP-FPM and queue workers.
3. Do not roll back a destructive database migration without its tested down/forward-fix plan.
4. Prefer a forward fix when the previous code cannot read the migrated schema.
5. Verify public snapshot routes and admin login after rollback.

## Secrets

- Do not store production `.env`, database passwords, mail credentials, or object-storage keys in Git.
- Use a password manager or VPS secret facility.
- Rotate credentials after staff access changes or suspected exposure.

## Pilot Go-Live Gate

- PostgreSQL migration tested from an empty database.
- Redis cache/queue tested.
- TLS and security headers verified.
- Remote backup configured.
- One restore drill completed.
- Monitoring destination and on-call owner assigned.
- No unresolved Critical/High security finding.
