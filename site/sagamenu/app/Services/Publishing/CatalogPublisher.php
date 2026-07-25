<?php

namespace App\Services\Publishing;

use App\Models\Catalog;
use App\Models\CatalogSnapshot;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CatalogPublisher
{
    public function __construct(
        private readonly CatalogSnapshotBuilder $builder,
        private readonly AuditLogger $auditLogger,
    ) {}

    public function publish(Catalog $catalog, ?User $actor = null, ?string $reason = null): CatalogSnapshot
    {
        $this->validate($catalog);

        return DB::transaction(function () use ($catalog, $actor, $reason): CatalogSnapshot {
            $locked = Catalog::query()->lockForUpdate()->findOrFail($catalog->id);
            $payload = $this->builder->build($locked);
            $version = ((int) $locked->snapshots()->max('version')) + 1;

            $snapshot = $locked->snapshots()->create([
                'organization_id' => $locked->organization_id,
                'version' => $version,
                'status' => 'published',
                'payload' => $payload,
                'published_by_user_id' => $actor?->id,
                'published_at' => now(),
                'checksum' => hash('sha256', json_encode($payload, JSON_THROW_ON_ERROR)),
            ]);

            $before = ['active_snapshot_id' => $locked->active_snapshot_id, 'status' => $locked->status];
            $locked->update([
                'active_snapshot_id' => $snapshot->id,
                'status' => 'published',
                'last_published_at' => now(),
            ]);

            Cache::forget($this->cacheKey($locked));
            $this->auditLogger->log($locked, 'catalog.published', $actor, $reason, $before, [
                'active_snapshot_id' => $snapshot->id,
                'version' => $version,
            ]);

            return $snapshot;
        });
    }

    public function restore(Catalog $catalog, CatalogSnapshot $snapshot, User $actor): CatalogSnapshot
    {
        abort_unless($snapshot->catalog_id === $catalog->id, 404);

        return DB::transaction(function () use ($catalog, $snapshot, $actor): CatalogSnapshot {
            $version = ((int) $catalog->snapshots()->max('version')) + 1;
            $restored = $catalog->snapshots()->create([
                'organization_id' => $catalog->organization_id,
                'version' => $version,
                'status' => 'published',
                'payload' => $snapshot->payload,
                'published_by_user_id' => $actor->id,
                'published_at' => now(),
                'checksum' => hash('sha256', json_encode($snapshot->payload, JSON_THROW_ON_ERROR)),
            ]);

            $catalog->update(['active_snapshot_id' => $restored->id, 'status' => 'published', 'last_published_at' => now()]);
            Cache::forget($this->cacheKey($catalog));
            $this->auditLogger->log($catalog, 'catalog.restored', $actor, "Restored from version {$snapshot->version}");

            return $restored;
        });
    }

    public function unpublish(Catalog $catalog, User $actor): void
    {
        $before = ['active_snapshot_id' => $catalog->active_snapshot_id, 'status' => $catalog->status];
        $catalog->update(['active_snapshot_id' => null, 'status' => 'unpublished']);
        Cache::forget($this->cacheKey($catalog));
        $this->auditLogger->log($catalog, 'catalog.unpublished', $actor, null, $before, ['active_snapshot_id' => null]);
    }

    public function cacheKey(Catalog $catalog): string
    {
        return "catalog:live:{$catalog->id}:{$catalog->active_snapshot_id}";
    }

    private function validate(Catalog $catalog): void
    {
        $errors = [];

        if (! $catalog->name || ! $catalog->slug) {
            $errors['catalog'] = 'Nama dan slug catalog wajib diisi.';
        }

        if (! $catalog->collections()->where('is_visible', true)->exists()) {
            $errors['collections'] = 'Minimal satu collection aktif diperlukan.';
        }

        if (! $catalog->offerings()->where('visibility', '!=', 'hidden')->whereNull('archived_at')->exists()) {
            $errors['offerings'] = 'Minimal satu offering yang terlihat diperlukan.';
        }

        if ($errors) {
            throw ValidationException::withMessages($errors);
        }
    }
}
