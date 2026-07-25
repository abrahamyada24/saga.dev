<?php

namespace App\Filament\Resources\Collections\Pages;

use App\Filament\Resources\Collections\CollectionResource;
use App\Models\Catalog;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageCollections extends ManageRecords
{
    protected static string $resource = CollectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->mutateDataUsing(function (array $data): array {
                $catalog = Catalog::query()->findOrFail($data['catalog_id']);
                abort_unless(auth()->user()->isSagaDevAdmin() || $catalog->organization_id === auth()->user()->currentOrganization()?->id, 403);
                $data['organization_id'] = $catalog->organization_id;

                return $data;
            }),
        ];
    }
}
