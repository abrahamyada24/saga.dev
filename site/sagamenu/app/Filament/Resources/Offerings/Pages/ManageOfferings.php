<?php

namespace App\Filament\Resources\Offerings\Pages;

use App\Filament\Resources\Offerings\OfferingResource;
use App\Models\Catalog;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageOfferings extends ManageRecords
{
    protected static string $resource = OfferingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->mutateDataUsing(function (array $data): array {
                $catalog = Catalog::query()->findOrFail($data['catalog_id']);
                abort_unless(auth()->user()->isSagaDevAdmin() || $catalog->organization_id === auth()->user()->currentOrganization()?->id, 403);
                $data['organization_id'] = $catalog->organization_id;
                $data['currency'] = $catalog->organization->currency;

                return $data;
            }),
        ];
    }
}
