#!/usr/bin/env bash
set -euo pipefail

: "${SAGAMENU_URL:?Set SAGAMENU_URL, for example https://menu.example.com}"
: "${SAGAMENU_ROOT:=/var/www/sagamenu}"

curl --fail --silent --show-error --max-time 10 "$SAGAMENU_URL/up" >/dev/null
cd "$SAGAMENU_ROOT/current"
php artisan sagamenu:monitor

