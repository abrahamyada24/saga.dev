#!/usr/bin/env bash
set -euo pipefail

: "${SAGAMENU_REPOSITORY:?Set SAGAMENU_REPOSITORY}"
: "${SAGAMENU_ROOT:=/var/www/sagamenu}"
: "${SAGAMENU_COMMIT:?Set SAGAMENU_COMMIT to an immutable 40-character Git SHA}"
: "${SAGAMENU_RELEASE_MANIFEST:=release/sagamenu-staging-manifest.json}"

[[ "$SAGAMENU_COMMIT" =~ ^[0-9a-f]{40}$ ]] || {
    echo "SAGAMENU_COMMIT must be a full lowercase Git SHA" >&2
    exit 1
}

timestamp="$(date -u +%Y%m%d%H%M%S)"
release="$SAGAMENU_ROOT/releases/$timestamp"
shared="$SAGAMENU_ROOT/shared"

mkdir -p "$SAGAMENU_ROOT/releases" "$shared/storage"
git clone --filter=blob:none --no-checkout "$SAGAMENU_REPOSITORY" "$release"
git -C "$release" fetch --depth 1 origin "$SAGAMENU_COMMIT"
git -C "$release" checkout --detach "$SAGAMENU_COMMIT"

actual_commit="$(git -C "$release" rev-parse HEAD)"
[[ "$actual_commit" == "$SAGAMENU_COMMIT" ]] || {
    echo "Checked-out commit does not match SAGAMENU_COMMIT" >&2
    exit 1
}
[[ -z "$(git -C "$release" status --porcelain --untracked-files=all)" ]] || {
    echo "Refusing deployment from a dirty checkout" >&2
    exit 1
}

if [[ -d "$release/site/sagamenu" ]]; then
    app="$release/site/sagamenu"
else
    app="$release"
fi

test -f "$shared/.env"
ln -s "$shared/.env" "$app/.env"

cd "$app"
composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
npm ci
npm run build

SAGAMENU_RELEASE_VERIFIED_COMMIT="$actual_commit" \
SAGAMENU_RELEASE_VERIFIED_CLEAN=true \
php artisan sagamenu:release-preflight --manifest="$SAGAMENU_RELEASE_MANIFEST"

rm -rf "$app/storage"
ln -s "$shared/storage" "$app/storage"
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
