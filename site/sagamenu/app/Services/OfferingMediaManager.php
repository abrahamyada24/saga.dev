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
        ?string $videoUploadPath = null,
        ?int $videoAssetId = null,
    ): void {
        if (filled($uploadPath)) {
            $primaryAssetId = $this->createUploadedAsset($offering, $uploadPath, $actor, 'image')->id;
        }

        if (filled($videoUploadPath)) {
            $videoAssetId = $this->createUploadedAsset($offering, $videoUploadPath, $actor, 'video')->id;
        }

        $primary = $this->validatedAsset($offering, $primaryAssetId, 'image', 'primary_image_asset_id');
        $gallery = collect($galleryAssetIds)
            ->filter()
            ->map(fn ($id) => $this->validatedAsset($offering, (int) $id, 'image', 'gallery_media_asset_ids'))
            ->filter()
            ->reject(fn (MediaAsset $asset) => $asset->id === $primary?->id)
            ->unique('id')
            ->take(7)
            ->values();
        $video = $this->validatedAsset($offering, $videoAssetId, 'video', 'video_asset_id');

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

        if ($video) {
            OfferingMedia::query()->create([
                'organization_id' => $offering->organization_id,
                'offering_id' => $offering->id,
                'media_asset_id' => $video->id,
                'role' => 'menu_video',
                'sort_order' => 0,
                'is_active' => true,
            ]);
        }
    }

    private function createUploadedAsset(Offering $offering, string $path, User $actor, string $type): MediaAsset
    {
        $validated = app(MediaUploadValidator::class)->validateStored('public', $path, $type);
        [$width, $height] = $type === 'image'
            ? $this->imageDimensions('public', $path)
            : [null, null];

        return MediaAsset::query()->create([
            'organization_id' => $offering->organization_id,
            'uploaded_by_user_id' => $actor->id,
            'type' => $type,
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
                ...($type === 'image'
                    ? ['focal_point' => ['x' => 0.5, 'y' => 0.5]]
                    : [
                        'processing_status' => config('sagamenu.media.video_processing_required', true)
                            ? 'pending_processing'
                            : 'ready',
                    ]),
            ],
        ]);
    }

    private function validatedAsset(Offering $offering, ?int $assetId, string $type, string $field): ?MediaAsset
    {
        if (! $assetId) {
            return null;
        }

        $asset = MediaAsset::query()->find($assetId);

        if (! $asset || $asset->organization_id !== $offering->organization_id || $asset->type !== $type) {
            throw ValidationException::withMessages([
                $field => $type === 'video'
                    ? 'Video tidak tersedia untuk organization ini.'
                    : 'Foto tidak tersedia untuk organization ini.',
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
