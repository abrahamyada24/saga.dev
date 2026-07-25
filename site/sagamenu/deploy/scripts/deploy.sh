#!/usr/bin/env bash
set -euo pipefail

: "${SAGAMENU_REPOSITORY:?Set SAGAMENU_REPOSITORY}"
: "${SAGAMENU_ROOT:=/var/www/sagamenu}"
: "${SAGAMENU_REF:=main}"

timestamp="$(date -u +%Y%m%d%H%M%S)"
release="$SAGAMENU_ROOT/releases/$timestamp"
shared="$SAGAMENU_ROOT/shared"

mkdir -p "$SAGAMENU_ROOT/releases" "$shared/storage"
git clone --depth 1 --branch "$SAGAMENU_REF" "$SAGAMENU_REPOSITORY" "$release"

if [[ -d "$release/site/sagamenu" ]]; then
    app="$release/site/sagamenu"
else
    app="$release"
fi

test -f "$shared/.env"
rm -rf "$app/storage"
ln -s "$shared/storage" "$app/storage"
ln -s "$shared/.env" "$app/.env"

cd "$app"
composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
php artisan storage:link --force
php artisan optimize
php artisan filament:optimize

ln -sfn "$app" "$SAGAMENU_ROOT/current.next"
mv -Tf "$SAGAMENU_ROOT/current.next" "$SAGAMENU_ROOT/current"

php artisan queue:restart
php artisan sagamenu:heartbeat
php artisan sagamenu:health-check

find "$SAGAMENU_ROOT/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -nr \
    | tail -n +6 \
    | cut -d' ' -f2- \
    | xargs -r rm -rf --

echo "Deployed release $timestamp"

