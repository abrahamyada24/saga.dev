<?php

namespace App\Filament\Resources\CatalogSnapshots\Pages;

use App\Filament\Resources\CatalogSnapshots\CatalogSnapshotResource;
use Filament\Resources\Pages\ManageRecords;

class ManageCatalogSnapshots extends ManageRecords
{
    protected static string $resource = CatalogSnapshotResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
