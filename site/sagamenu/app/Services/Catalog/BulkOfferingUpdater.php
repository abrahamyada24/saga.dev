<?php

namespace App\Services\Catalog;

use App\Models\Catalog;
use App\Models\CatalogOperationBatch;
use App\Models\Offering;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BulkOfferingUpdater
{
    private const ALLOWED_FIELDS = [
        'availability',
        'visibility',
        'price_min_minor',
        'primary_collection_id',
        'badges',
    ];

    public function __construct(private readonly AuditLogger $auditLogger) {}

    /**
     * @param  array<int>  $offeringIds
     * @param  array<string, mixed>  $changes
     */
    public function update(
        Catalog $catalog,
        array $offeringIds,
        array $changes,
        User $actor,
        string $idempotencyKey,
    ): CatalogOperationBatch {
        $changes = $this->validateChanges($catalog, $changes);
        $offeringIds = array_values(array_unique(array_map('intval', $offeringIds)));

        if ($offeringIds === []) {
            throw ValidationException::withMessages(['offerings' => 'Pilih minimal satu menu.']);
        }

        return DB::transaction(function () use ($catalog, $offeringIds, $changes, $actor, $idempotencyKey): CatalogOperationBatch {
            $existing = CatalogOperationBatch::query()
                ->where('organization_id', $catalog->organization_id)
                ->where('idempotency_key', $idempotencyKey)
                ->first();

            if ($existing) {
                return $existing;
            }

            $offerings = Offering::query()
                ->where('organization_id', $catalog->organization_id)
                ->where('catalog_id', $catalog->id)
                ->whereIn('id', $offeringIds)
                ->lockForUpdate()
                ->get();

            if ($offerings->count() !== count($offeringIds)) {
                throw ValidationException::withMessages([
                    'offerings' => 'Satu atau lebih menu berada di luar catalog aktif.',
                ]);
            }

            $before = $offerings->mapWithKeys(fn (Offering $offering): array => [
                (string) $offering->id => $offering->only(array_keys($changes)),
            ])->all();

            foreach ($offerings as $offering) {
                $offering->update($changes);
            }

            $batch = CatalogOperationBatch::query()->create([
                'organization_id' => $catalog->organization_id,
                'catalog_id' => $catalog->id,
                'actor_user_id' => $actor->id,
                'idempotency_key' => $idempotencyKey,
                'operation' => 'offering.bulk_update',
                'payload' => ['offering_ids' => $offeringIds, 'changes' => $changes],
                'before' => $before,
                'status' => 'completed',
            ]);

            $this->auditLogger->log(
                $batch,
                'catalog.bulk_updated',
                $actor,
                "Updated {$offerings->count()} offerings.",
                ['offering_ids' => $offeringIds],
                ['fields' => array_keys($changes)],
            );

            return $batch;
        });
    }

    public function undo(CatalogOperationBatch $batch, User $actor): CatalogOperationBatch
    {
        if ($batch->undone_at) {
            return $batch;
        }

        return DB::transaction(function () use ($batch, $actor): CatalogOperationBatch {
            $locked = CatalogOperationBatch::query()->lockForUpdate()->findOrFail($batch->id);

            if ($locked->undone_at) {
                return $locked;
            }

            foreach ($locked->before as $offeringId => $values) {
                Offering::query()
                    ->where('organization_id', $locked->organization_id)
                    ->where('catalog_id', $locked->catalog_id)
                    ->whereKey($offeringId)
                    ->update($values);
            }

            $locked->update(['status' => 'undone', 'undone_at' => now()]);
            $this->auditLogger->log($locked, 'catalog.bulk_undone', $actor);

            return $locked->fresh();
        });
    }

    /**
     * @param  array<string, mixed>  $changes
     * @return array<string, mixed>
     */
    private function validateChanges(Catalog $catalog, array $changes): array
    {
        $unknown = array_diff(array_keys($changes), self::ALLOWED_FIELDS);
        if ($unknown !== []) {
            throw ValidationException::withMessages([
                'changes' => 'Field batch tidak diizinkan: '.implode(', ', $unknown),
            ]);
        }

        if ($changes === []) {
            throw ValidationException::withMessages(['changes' => 'Tidak ada perubahan batch.']);
        }

        if (isset($changes['availability']) && ! in_array($changes['availability'], ['available', 'sold_out', 'temporary', 'coming_soon', 'seasonal'], true)) {
            throw ValidationException::withMessages(['availability' => 'Status ketersediaan tidak valid.']);
        }

        if (isset($changes['visibility']) && ! in_array($changes['visibility'], ['both', 'mobile', 'store', 'hidden'], true)) {
            throw ValidationException::withMessages(['visibility' => 'Surface tidak valid.']);
        }

        if (isset($changes['price_min_minor'])) {
            $changes['price_min_minor'] = filter_var($changes['price_min_minor'], FILTER_VALIDATE_INT);
            if ($changes['price_min_minor'] === false || $changes['price_min_minor'] < 0) {
                throw ValidationException::withMessages(['price_min_minor' => 'Harga tidak valid.']);
            }
        }

        if (isset($changes['primary_collection_id'])) {
            $validCollection = $catalog->collections()->whereKey($changes['primary_collection_id'])->exists();
            if (! $validCollection) {
                throw ValidationException::withMessages(['primary_collection_id' => 'Kategori berada di luar catalog aktif.']);
            }
        }

        return $changes;
    }
}
