#!/usr/bin/env bash
set -euo pipefail

: "${SAGAMENU_COMMIT:?Set SAGAMENU_COMMIT to an immutable 40-character Git SHA}"
: "${SAGAMENU_RELEASE_MANIFEST:=release/sagamenu-staging-manifest.json}"
: "${SAGAMENU_STAGING_PROBE:=release/sagamenu-staging-probe.json}"

[[ "$SAGAMENU_COMMIT" =~ ^[0-9a-f]{40}$ ]] || {
    echo "SAGAMENU_COMMIT must be a full lowercase Git SHA" >&2
    exit 1
}

actual_commit="$(git rev-parse HEAD)"
[[ "$actual_commit" == "$SAGAMENU_COMMIT" ]] || {
    echo "Checked-out commit does not match SAGAMENU_COMMIT" >&2
    exit 1
}

[[ -z "$(git status --porcelain --untracked-files=all)" ]] || {
    echo "Refusing staging preflight from a dirty checkout" >&2
    exit 1
}

for binary in php composer git node npm pg_dump pg_restore ffmpeg clamscan; do
    command -v "$binary" >/dev/null || {
        echo "Required executable is missing: $binary" >&2
        exit 1
    }
done

php -r '
$required = [
    "ctype", "curl", "dom", "fileinfo", "filter", "hash", "mbstring",
    "openssl", "pcre", "pdo", "pdo_pgsql", "redis", "session",
    "tokenizer", "xml", "zip",
];
if (version_compare(PHP_VERSION, "8.3.0", "<")) {
    fwrite(STDERR, "PHP 8.3 or newer is required\n");
    exit(1);
}
foreach ($required as $extension) {
    if (! extension_loaded($extension)) {
        fwrite(STDERR, "Required PHP extension is missing: {$extension}\n");
        exit(1);
    }
}
'

test -f "$SAGAMENU_RELEASE_MANIFEST"
test -f "$SAGAMENU_STAGING_PROBE"

SAGAMENU_RELEASE_VERIFIED_COMMIT="$actual_commit" \
SAGAMENU_RELEASE_VERIFIED_CLEAN=true \
SAGAMENU_RELEASE_VERIFIED_BRANCH=detached \
php artisan sagamenu:staging-bootstrap-preflight \
    --manifest="$SAGAMENU_RELEASE_MANIFEST" \
    --probe="$SAGAMENU_STAGING_PROBE"
