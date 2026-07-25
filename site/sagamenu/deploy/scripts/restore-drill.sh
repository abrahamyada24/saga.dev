#!/usr/bin/env bash
set -euo pipefail

: "${CONFIRM_RESTORE_DRILL:?Set CONFIRM_RESTORE_DRILL=YES}"
: "${RESTORE_DATABASE:?Set RESTORE_DATABASE to an isolated database ending in _restore}"
: "${BACKUP_DUMP:?Set BACKUP_DUMP to a PostgreSQL custom-format dump}"

[[ "$CONFIRM_RESTORE_DRILL" == "YES" ]] || { echo "Restore drill not confirmed" >&2; exit 1; }
[[ "$RESTORE_DATABASE" == *_restore ]] || { echo "Restore database must end in _restore" >&2; exit 1; }
[[ "$RESTORE_DATABASE" != "${DB_DATABASE:-}" ]] || { echo "Refusing to target configured application database" >&2; exit 1; }
test -f "$BACKUP_DUMP"

dropdb --if-exists "$RESTORE_DATABASE"
createdb "$RESTORE_DATABASE"
pg_restore --exit-on-error --no-owner --dbname="$RESTORE_DATABASE" "$BACKUP_DUMP"

for table in organizations organization_user catalogs catalog_snapshots; do
    count="$(psql --tuples-only --no-align --dbname="$RESTORE_DATABASE" --command="SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='$table'")"
    [[ "$count" == "1" ]] || { echo "Missing table $table" >&2; exit 1; }
done

echo "Restore drill passed for $RESTORE_DATABASE at $(date -u +%FT%TZ)"

