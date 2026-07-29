<?php

namespace App\Services\Publishing;

use App\Models\Catalog;
use App\Models\Offering;
use Illuminate\Support\Carbon;

class CatalogSnapshotBuilder
{
    public function build(Catalog $catalog): array
    {
        $catalog->load([
            'organization',
            'location',
            'customFont.mediaAsset',
            'collections.offerings.media.mediaAsset',
            'collections.offerings.variantGroups.values',
            'collections.offerings.optionGroups.values',
            'collections.offerings.inclusions',
            'collections.offerings.translations',
        ]);

        $collections = $catalog->collections
            ->filter(fn ($collection) => $collection->is_visible && ! $collection->archived_at)
            ->map(function ($collection): array {
                $offerings = $collection->offerings
                    ->filter(fn (Offering $offering) => $this->isPublicCandidate($offering))
                    ->map(fn (Offering $offering) => $this->offeringPayload($offering))
                    ->values();

                return [
                    'name' => $collection->name,
                    'slug' => $collection->slug,
                    'description' => $collection->description,
                    'offerings' => $offerings->all(),
                ];
            })
            ->filter(fn (array $collection) => count($collection['offerings']) > 0)
            ->values();

        $allOfferings = $collections
            ->flatMap(fn (array $collection) => $collection['offerings'])
            ->unique('slug')
            ->values();

        return [
            'schema_version' => 1,
            'generated_at' => Carbon::now()->toIso8601String(),
            'organization' => [
                'name' => $catalog->organization->name,
                'slug' => $catalog->organization->slug,
                'business_type' => $catalog->organization->business_type,
                'locale' => $catalog->organization->locale,
                'currency' => $catalog->organization->currency,
                'address' => $catalog->organization->address,
            ],
            'catalog' => [
                'name' => $catalog->name,
                'slug' => $catalog->slug,
                'vertical' => $catalog->vertical,
                'status' => $catalog->status,
                'store_display_enabled' => $catalog->store_display_enabled,
                'mobile_catalog_enabled' => $catalog->mobile_catalog_enabled,
                'default_view_mode' => $catalog->default_view_mode,
                'hero_title' => $catalog->hero_title,
                'hero_subtitle' => $catalog->hero_subtitle,
                'last_published_at' => optional($catalog->last_published_at)->toIso8601String(),
                'appearance' => array_merge($catalog->appearance ?? [], [
                    'custom_font_enabled' => (bool) ($catalog->customFont?->is_active),
                    'custom_font_url' => $catalog->customFont?->mediaAsset?->publicUrl(),
                    'custom_font_format' => strtolower(pathinfo((string) $catalog->customFont?->mediaAsset?->path, PATHINFO_EXTENSION)),
                ]),
                'business_info' => $catalog->business_info ?? [],
                'settings' => $catalog->settings ?? [],
            ],
            'collections' => $collections->all(),
            'featured_offerings' => $allOfferings->where('is_featured', true)->take(6)->values()->all(),
            'seo' => [
                'title' => $catalog->seo_title ?: $catalog->name,
                'description' => $catalog->seo_description,
            ],
        ];
    }

    private function isPublicCandidate(Offering $offering): bool
    {
        return ! $offering->archived_at
            && $offering->availability !== 'archived'
            && $offering->visibility !== 'hidden';
    }

    private function offeringPayload(Offering $offering): array
    {
        return [
            'name' => $offering->name,
            'slug' => $offering->slug,
            'short_description' => $offering->short_description,
            'full_description' => $offering->full_description,
            'price' => [
                'type' => $offering->price_type,
                'min_minor' => $offering->price_min_minor,
                'max_minor' => $offering->price_max_minor,
                'label' => $this->priceLabel($offering),
                'currency' => $offering->currency,
                'original_minor' => $offering->original_price_minor,
                'promo_minor' => $offering->promo_price_minor,
                'promo_label' => $offering->promo_label,
                'promo_terms' => $offering->promo_terms,
            ],
            'availability' => $offering->availability,
            'visibility' => $offering->visibility,
            'available_from' => optional($offering->available_from)->toIso8601String(),
            'available_until' => optional($offering->available_until)->toIso8601String(),
            'badges' => array_slice($offering->badges ?? [], 0, 2),
            'tags' => $offering->tags ?? [],
            'ingredients' => $offering->ingredients,
            'dietary' => $offering->dietary ?? [],
            'allergens' => $offering->allergens ?? [],
            'spice_level' => $offering->spice_level,
            'caffeine_level' => $offering->caffeine_level,
            'serving_note' => $offering->serving_note,
            'external_action' => $offering->external_action_label && $offering->external_action_url ? [
                'label' => $offering->external_action_label,
                'url' => $offering->external_action_url,
            ] : null,
            'is_featured' => $offering->is_featured,
            'media' => $offering->media
                ->where('is_active', true)
                ->filter(function ($media): bool {
                    if ($media->mediaAsset->type !== 'video' || ! config('sagamenu.media.video_processing_required', true)) {
                        return true;
                    }

                    return data_get($media->mediaAsset->metadata, 'processing_status') === 'ready';
                })
                ->map(fn ($media) => [
                    'role' => $media->role,
                    'type' => $media->mediaAsset->type,
                    'mime_type' => $media->mediaAsset->mime_type,
                    'url' => $media->mediaAsset->publicUrl(),
                    'thumbnail_url' => $media->mediaAsset->thumbnail_path
                        ? \Storage::disk($media->mediaAsset->disk)->url($media->mediaAsset->thumbnail_path)
                        : null,
                    'width' => $media->mediaAsset->width,
                    'height' => $media->mediaAsset->height,
                    'duration_seconds' => $media->mediaAsset->duration_seconds,
                    'alt_text' => $media->mediaAsset->alt_text ?: $offering->name,
                    'metadata' => $media->mediaAsset->metadata ?? [],
                ])->values()->all(),
            'variants' => $offering->variantGroups->map(fn ($group) => [
                'name' => $group->name,
                'values' => $group->values->map(fn ($value) => [
                    'name' => $value->name,
                    'price_minor' => $value->price_minor,
                ])->values()->all(),
            ])->values()->all(),
            'option_groups' => $offering->optionGroups->where('is_active', true)->map(fn ($group) => [
                'name' => $group->name,
                'description' => $group->description,
                'selection_type' => $group->selection_type,
                'min_selections' => $group->min_selections,
                'max_selections' => $group->max_selections,
                'values' => $group->values->map(fn ($value) => [
                    'name' => $value->name,
                    'price_delta_minor' => $value->price_delta_minor,
                ])->values()->all(),
            ])->values()->all(),
            'inclusions' => $offering->inclusions->pluck('name')->values()->all(),
            'translations' => $offering->translations->mapWithKeys(fn ($translation) => [
                $translation->locale => [
                    'name' => $translation->name,
                    'short_description' => $translation->short_description,
                    'full_description' => $translation->full_description,
                    'video_transcript' => $translation->video_transcript,
                ],
            ])->all(),
        ];
    }

    private function priceLabel(Offering $offering): string
    {
        if ($offering->price_label) {
            return $offering->price_label;
        }

        return match ($offering->price_type) {
            'free' => 'Gratis',
            'contact' => 'Hubungi bisnis',
            'hidden' => '',
            'range' => $this->formatMoney($offering->price_min_minor, $offering->currency).' - '.$this->formatMoney($offering->price_max_minor, $offering->currency),
            'starting_from' => 'Mulai '.$this->formatMoney($offering->price_min_minor, $offering->currency),
            default => $this->formatMoney($offering->promo_price_minor ?? $offering->price_min_minor, $offering->currency),
        };
    }

    private function formatMoney(?int $minor, string $currency): string
    {
        if ($minor === null) {
            return '';
        }

        return $currency === 'IDR'
            ? 'Rp '.number_format($minor, 0, ',', '.')
            : $currency.' '.number_format($minor / 100, 2, ',', '.');
    }
}
