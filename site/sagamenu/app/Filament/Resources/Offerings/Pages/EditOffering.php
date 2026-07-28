<?php

namespace App\Filament\Resources\Offerings\Pages;

use App\Filament\Resources\Offerings\OfferingResource;
use App\Services\OfferingMediaManager;
use Filament\Resources\Pages\Concerns\HasWizard;
use Filament\Resources\Pages\EditRecord;
use Filament\Schemas\Components\Wizard\Step;

class EditOffering extends EditRecord
{
    use HasWizard;

    protected static string $resource = OfferingResource::class;

    private ?string $primaryImageUpload = null;

    private ?int $primaryImageAssetId = null;

    private array $galleryMediaAssetIds = [];

    private ?string $videoUpload = null;

    private ?int $videoAssetId = null;

    public function getTitle(): string
    {
        return 'Edit menu';
    }

    /**
     * @return array<Step>
     */
    public function getSteps(): array
    {
        return OfferingResource::wizardSteps();
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $media = $this->getRecord()->media()->get();
        $data['primary_image_asset_id'] = $media->firstWhere('role', 'primary_image')?->media_asset_id;
        $data['gallery_media_asset_ids'] = $media
            ->where('role', 'gallery_image')
            ->pluck('media_asset_id')
            ->values()
            ->all();
        $data['video_asset_id'] = $media->firstWhere('role', 'menu_video')?->media_asset_id;

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $this->primaryImageUpload = filled($data['primary_image_upload'] ?? null)
            ? (string) $data['primary_image_upload']
            : null;
        $this->primaryImageAssetId = filled($data['primary_image_asset_id'] ?? null)
            ? (int) $data['primary_image_asset_id']
            : null;
        $this->galleryMediaAssetIds = array_map('intval', $data['gallery_media_asset_ids'] ?? []);
        $this->videoUpload = filled($data['video_upload'] ?? null)
            ? (string) $data['video_upload']
            : null;
        $this->videoAssetId = filled($data['video_asset_id'] ?? null)
            ? (int) $data['video_asset_id']
            : null;
        unset(
            $data['primary_image_upload'],
            $data['primary_image_asset_id'],
            $data['gallery_media_asset_ids'],
            $data['video_upload'],
            $data['video_asset_id'],
        );

        return $data;
    }

    protected function afterSave(): void
    {
        $this->syncPrimaryCollection();

        app(OfferingMediaManager::class)->syncFromEditor(
            $this->getRecord(),
            $this->primaryImageUpload,
            $this->primaryImageAssetId,
            $this->galleryMediaAssetIds,
            auth()->user(),
            $this->videoUpload,
            $this->videoAssetId,
        );
    }

    protected function getRedirectUrl(): string
    {
        return OfferingResource::getUrl('index');
    }

    private function syncPrimaryCollection(): void
    {
        $record = $this->getRecord();
        if (! $record->primary_collection_id) {
            return;
        }

        $record->collections()->syncWithoutDetaching([
            $record->primary_collection_id => ['sort_order' => $record->sort_order ?? 0],
        ]);
    }
}
