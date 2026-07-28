# Saga Menu Staging Checklist

## Required Runtime

- Ubuntu LTS, Nginx, PHP 8.3+, PostgreSQL 16+, Redis 7+, Supervisor, systemd, Node 22, Composer 2.
- PHP extensions: bcmath, curl, fileinfo, gd, intl, mbstring, opcache, pdo_pgsql, redis, zip.
- ClamAV enabled for pilot uploads.
- Object storage CORS, signed access, lifecycle, and upload limits verified for MP4/WebM.
- Video processor verifies duration, generates a poster thumbnail, and records ready/failed status before public exposure.
- Separate encrypted offsite backup disk.

## Environment Gate

- `APP_ENV=production`, `APP_DEBUG=false`, HTTPS `APP_URL`, generated `APP_KEY`.
- PostgreSQL credentials use a least-privilege application role.
- Redis is not exposed publicly and has authentication/network controls.
- `SESSION_ENCRYPT=true`, secure cookie domain, mail credentials, monitoring webhook.
- `SAGAMENU_BACKUP_DISK` points to tested offsite storage.
- `SAGAMENU_CLAMAV_ENABLED=true` and `SAGAMENU_CLAMAV_REQUIRED=true`.
- `SAGAMENU_VIDEO_PROCESSING_REQUIRED=true` with a monitored worker and dead-letter/retry path.

## Deploy Gate

1. Run CI from a clean checkout.
2. Install Nginx, Supervisor, and systemd templates from `deploy/` after replacing domains/paths.
3. Run `deploy/scripts/deploy.sh` with repository/root/ref variables.
4. Verify `/up`, admin login, Mobile Catalog, Store Display, QR PNG, queue, and scheduler timer.
5. Run backup, copy offsite, and `sagamenu:restore-verify`.
6. Run `deploy/scripts/restore-drill.sh` against an isolated `_restore` database.
7. Trigger a harmless monitoring failure and confirm alert delivery.
8. Upload valid MP4/WebM and disguised/oversized files; verify safe rejection, processing status, poster, duration, public controls, and no autoplay.

## Human Evidence Required

- VPS hostname and provider.
- TLS certificate result.
- SMTP test recipient confirmation.
- Offsite backup object listing and restore-drill timestamp.
- Monitoring destination and on-call owner.
- Security auditor GO/NO-GO decision.
- Video processing worker, retry, failure alert, and cleanup evidence.
