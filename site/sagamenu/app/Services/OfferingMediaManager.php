<?php

namespace App\Services;

use App\Models\MediaAsset;
use App\Models\Offering;
use App\Models\OfferingMedia;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class OfferingMediaManager
{
    public function syncFromEditor(
        Offering $offering,
        ?string $uploadPath,
        ?int $primaryAssetId,
        array $galleryAssetIds,
        User $actor,
    ): void {
        if (filled($uploadPath)) {
            $primaryAssetId = $this->createUploadedAsset($offering, $uploadPath, $actor)->id;
        }

        $primary = $this->validatedAsset($offering, $primaryAssetId);
        $gallery = collect($galleryAssetIds)
            ->filter()
            ->map(fn ($id) => $this->validatedAsset($offering, (int) $id))
            ->filter()
            ->reject(fn (MediaAsset $asset) => $asset->id === $primary?->id)
            ->unique('id')
            ->take(7)
            ->values();

        $offering->media()->delete();

        if ($primary) {
            OfferingMedia::query()->create([
                'organization_id' => $offering->organization_id,
                'offering_id' => $offering->id,
                'media_asset_id' => $primary->id,
                'role' => 'primary_image',
                'sort_order' => 0,
                'is_active' => true,
            ]);
        }

        $gallery->each(function (MediaAsset $asset, int $index) use ($offering): void {
            OfferingMedia::query()->create([
                'organization_id' => $offering->organization_id,
                'offering_id' => $offering->id,
                'media_asset_id' => $asset->id,
                'role' => 'gallery_image',
                'sort_order' => $index + 1,
                'is_active' => true,
            ]);
        });
    }

    private function createUploadedAsset(Offering $offering, string $path, User $actor): MediaAsset
    {
        $validated = app(MediaUploadValidator::class)->validateStored('public', $path, 'image');
        [$width, $height] = $this->imageDimensions('public', $path);

        return MediaAsset::query()->create([
            'organization_id' => $offering->organization_id,
            'uploaded_by_user_id' => $actor->id,
            'type' => 'image',
            'disk' => 'public',
            'path' => $path,
            'original_name' => basename($path),
            'extension' => $validated['extension'],
            'mime_type' => $validated['mime_type'],
            'file_size' => $validated['file_size'],
            'width' => $width,
            'height' => $height,
            'alt_text' => $offering->name,
            'metadata' => [
                'source' => 'offering_editor',
                'focal_point' => ['x' => 0.5, 'y' => 0.5],
            ],
        ]);
    }

    private function validatedAsset(Offering $offering, ?int $assetId): ?MediaAsset
    {
        if (! $assetId) {
            return null;
        }

        $asset = MediaAsset::query()->find($assetId);

        if (! $asset || $asset->organization_id !== $offering->organization_id || $asset->type !== 'image') {
            throw ValidationException::withMessages([
                'primary_image_asset_id' => 'Foto tidak tersedia untuk organization ini.',
            ]);
        }

        return $asset;
    }

    private function imageDimensions(string $disk, string $path): array
    {
        $stream = Storage::disk($disk)->readStream($path);
        if (! is_resource($stream)) {
            return [null, null];
        }

        $contents = stream_get_contents($stream);
        fclose($stream);
        $size = is_string($contents) ? @getimagesizefromstring($contents) : false;

        return $size ? [(int) $size[0], (int) $size[1]] : [null, null];
    }
}
