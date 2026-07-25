# Saga Menu Staging Checklist

## Required Runtime

- Ubuntu LTS, Nginx, PHP 8.3+, PostgreSQL 16+, Redis 7+, Supervisor, systemd, Node 22, Composer 2.
- PHP extensions: bcmath, curl, fileinfo, gd, intl, mbstring, opcache, pdo_pgsql, redis, zip.
- ClamAV enabled for pilot uploads.
- Separate encrypted offsite backup disk.

## Environment Gate

- `APP_ENV=production`, `APP_DEBUG=false`, HTTPS `APP_URL`, generated `APP_KEY`.
- PostgreSQL credentials use a least-privilege application role.
- Redis is not exposed publicly and has authentication/network controls.
- `SESSION_ENCRYPT=true`, secure cookie domain, mail credentials, monitoring webhook.
- `SAGAMENU_BACKUP_DISK` points to tested offsite storage.
- `SAGAMENU_CLAMAV_ENABLED=true` and `SAGAMENU_CLAMAV_REQUIRED=true`.

## Deploy Gate

1. Run CI from a clean checkout.
2. Install Nginx, Supervisor, and systemd templates from `deploy/` after replacing domains/paths.
3. Run `deploy/scripts/deploy.sh` with repository/root/ref variables.
4. Verify `/up`, admin login, Mobile Catalog, Store Display, QR PNG, queue, and scheduler timer.
5. Run backup, copy offsite, and `sagamenu:restore-verify`.
6. Run `deploy/scripts/restore-drill.sh` against an isolated `_restore` database.
7. Trigger a harmless monitoring failure and confirm alert delivery.

## Human Evidence Required

- VPS hostname and provider.
- TLS certificate result.
- SMTP test recipient confirmation.
- Offsite backup object listing and restore-drill timestamp.
- Monitoring destination and on-call owner.
- Security auditor GO/NO-GO decision.

