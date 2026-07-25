#!/usr/bin/env bash
set -euo pipefail

: "${SAGAMENU_ROOT:=/var/www/sagamenu}"
target="${1:?Usage: rollback.sh /absolute/path/to/release/app}"

target="$(realpath "$target")"
case "$target" in
    "$SAGAMENU_ROOT"/releases/*) ;;
    *) echo "Refusing rollback outside $SAGAMENU_ROOT/releases" >&2; exit 1 ;;
esac

test -f "$target/artisan"
ln -sfn "$target" "$SAGAMENU_ROOT/current.next"
mv -Tf "$SAGAMENU_ROOT/current.next" "$SAGAMENU_ROOT/current"

cd "$SAGAMENU_ROOT/current"
php artisan optimize
php artisan queue:restart
php artisan sagamenu:health-check

echo "Rolled back to $target"

