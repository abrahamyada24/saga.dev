<?php

namespace App\Services;

use App\Models\Catalog;
use App\Models\Collection;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CatalogDuplicator
{
    public function duplicate(Catalog $source, User $actor): Catalog
    {
        return DB::transaction(function () use ($source, $actor): Catalog {
            $source->loadMissing(['collections', 'offerings']);
            $copy = $source->replicate([
                'name',
                'slug',
                'status',
                'active_snapshot_id',
                'last_published_at',
                'archived_at',
            ]);
            $copy->name = $source->name.' Copy';
            $copy->slug = $this->uniqueSlug($source, $source->slug.'-copy');
            $copy->status = 'draft';
            $copy->active_snapshot_id = null;
            $copy->last_published_at = null;
            $copy->archived_at = null;
            $copy->save();

            $collectionMap = [];
            foreach ($source->collections as $collection) {
                $newCollection = Collection::query()->create([
                    ...$collection->only(['name', 'slug', 'description', 'is_visible', 'sort_order']),
                    'organization_id' => $copy->organization_id,
                    'catalog_id' => $copy->id,
                    'archived_at' => null,
                ]);
                $collectionMap[$collection->id] = $newCollection->id;
            }

            foreach ($source->offerings as $offering) {
                app(OfferingDuplicator::class)->duplicateInto($offering, $copy, $collectionMap);
            }

            app(AuditLogger::class)->log($copy, 'catalog.duplicated', $actor, "Duplicated from catalog {$source->id}");

            return $copy->fresh();
        });
    }

    private function uniqueSlug(Catalog $source, string $base): string
    {
        $slug = $base;
        $suffix = 2;

        while (Catalog::query()->where('organization_id', $source->organization_id)->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }
}
