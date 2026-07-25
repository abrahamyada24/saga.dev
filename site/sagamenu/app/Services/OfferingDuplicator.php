<?php

namespace App\Services;

use App\Models\Catalog;
use App\Models\Offering;
use App\Models\OfferingMedia;
use App\Models\VariantGroup;
use Illuminate\Support\Facades\DB;

class OfferingDuplicator
{
    public function duplicate(Offering $source): Offering
    {
        return DB::transaction(function () use ($source): Offering {
            $collectionMap = $source->collections()->pluck('collections.id', 'collections.id')->all();

            return $this->duplicateInto($source, $source->catalog, $collectionMap, true);
        });
    }

    public function duplicateInto(Offering $source, Catalog $catalog, array $collectionMap, bool $markAsCopy = false): Offering
    {
        $source->loadMissing(['collections', 'media', 'variantGroups.values', 'optionGroups', 'inclusions']);
        $copy = $source->replicate(['catalog_id', 'primary_collection_id', 'slug', 'name', 'archived_at']);
        $copy->organization_id = $catalog->organization_id;
        $copy->catalog_id = $catalog->id;
        $copy->primary_collection_id = $collectionMap[$source->primary_collection_id] ?? null;
        $copy->name = $markAsCopy ? $source->name.' Copy' : $source->name;
        $copy->slug = $this->uniqueSlug($catalog, $markAsCopy ? $source->slug.'-copy' : $source->slug);
        $copy->archived_at = null;
        $copy->save();

        $attachments = [];
        foreach ($source->collections as $collection) {
            $targetCollectionId = $collectionMap[$collection->id] ?? null;
            if ($targetCollectionId) {
                $attachments[$targetCollectionId] = ['sort_order' => $collection->pivot->sort_order];
            }
        }
        $copy->collections()->sync($attachments);

        foreach ($source->media as $media) {
            OfferingMedia::query()->create([
                ...$media->only(['media_asset_id', 'role', 'sort_order', 'is_active']),
                'organization_id' => $catalog->organization_id,
                'offering_id' => $copy->id,
            ]);
        }

        foreach ($source->variantGroups as $group) {
            $newGroup = VariantGroup::query()->create([
                ...$group->only(['name', 'sort_order']),
                'offering_id' => $copy->id,
            ]);
            foreach ($group->values as $value) {
                $newGroup->values()->create($value->only(['name', 'price_minor', 'sort_order']));
            }
        }

        $copy->optionGroups()->sync($source->optionGroups->mapWithKeys(
            fn ($group) => [$group->id => ['sort_order' => $group->pivot->sort_order]],
        )->all());

        foreach ($source->inclusions as $inclusion) {
            $copy->inclusions()->create($inclusion->only(['name', 'sort_order']));
        }

        return $copy->fresh();
    }

    private function uniqueSlug(Catalog $catalog, string $base): string
    {
        $slug = $base;
        $suffix = 2;

        while ($catalog->offerings()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }
}
