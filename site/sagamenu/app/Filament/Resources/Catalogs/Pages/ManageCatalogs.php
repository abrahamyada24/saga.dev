<?php

namespace App\Filament\Resources\Catalogs\Pages;

use App\Filament\Resources\Catalogs\CatalogResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageCatalogs extends ManageRecords
{
    protected static string $resource = CatalogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->mutateDataUsing(function (array $data): array {
                if (! auth()->user()->isSagaDevAdmin()) {
                    $data['organization_id'] = auth()->user()->currentOrganization()?->id;
                }

                return $data;
            }),
        ];
    }
}
