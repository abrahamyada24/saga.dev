<?php

namespace App\Filament\Resources\Offerings\Pages;

use App\Filament\Resources\Offerings\OfferingResource;
use App\Models\Catalog;
use App\Models\Offering;
use App\Services\OfferingMediaManager;
use Filament\Resources\Pages\Concerns\HasWizard;
use Filament\Resources\Pages\CreateRecord;
use Filament\Schemas\Components\Wizard\Step;
use Illuminate\Support\Str;

class CreateOffering extends CreateRecord
{
    use HasWizard;

    protected static string $resource = OfferingResource::class;

    private ?string $primaryImageUpload = null;

    private ?int $primaryImageAssetId = null;

    private array $galleryMediaAssetIds = [];

    public function getTitle(): string
    {
        return 'Tambah menu';
    }

    /**
     * @return array<Step>
     */
    public function getSteps(): array
    {
        return OfferingResource::wizardSteps();
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $this->captureMediaState($data);
        unset($data['primary_image_upload'], $data['primary_image_asset_id'], $data['gallery_media_asset_ids']);

        $catalog = Catalog::query()->with('organization')->findOrFail($data['catalog_id']);
        abort_unless(
            auth()->user()->isSagaDevAdmin()
                || $catalog->organization_id === auth()->user()->currentOrganization()?->id,
            403,
        );

        $data['organization_id'] = $catalog->organization_id;
        $data['currency'] = $catalog->organization->currency;
        $data['slug'] = $this->uniqueSlug($catalog->id, (string) $data['name']);

        return $data;
    }

    protected function afterCreate(): void
    {
        $this->syncPrimaryCollection();

        app(OfferingMediaManager::class)->syncFromEditor(
            $this->getRecord(),
            $this->primaryImageUpload,
            $this->primaryImageAssetId,
            $this->galleryMediaAssetIds,
            auth()->user(),
        );
    }

    protected function getRedirectUrl(): string
    {
        return OfferingResource::getUrl('index');
    }

    private function captureMediaState(array $data): void
    {
        $this->primaryImageUpload = filled($data['primary_image_upload'] ?? null)
            ? (string) $data['primary_image_upload']
            : null;
        $this->primaryImageAssetId = filled($data['primary_image_asset_id'] ?? null)
            ? (int) $data['primary_image_asset_id']
            : null;
        $this->galleryMediaAssetIds = array_map('intval', $data['gallery_media_asset_ids'] ?? []);
    }

    private function uniqueSlug(int $catalogId, string $name): string
    {
        $base = Str::slug($name) ?: 'menu';
        $slug = $base;
        $counter = 2;

        while (Offering::query()->where('catalog_id', $catalogId)->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
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
