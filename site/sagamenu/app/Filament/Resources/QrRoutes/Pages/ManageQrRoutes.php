<?php

namespace App\Filament\Resources\QrRoutes\Pages;

use App\Filament\Resources\QrRoutes\QrRouteResource;
use App\Models\Catalog;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;
use Illuminate\Support\Str;

class ManageQrRoutes extends ManageRecords
{
    protected static string $resource = QrRouteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->mutateDataUsing(function (array $data): array {
                $catalog = Catalog::query()->findOrFail($data['catalog_id']);
                abort_unless(auth()->user()->isSagaDevAdmin() || $catalog->organization_id === auth()->user()->currentOrganization()?->id, 403);
                $data['organization_id'] = $catalog->organization_id;
                $data['code'] = Str::lower(Str::random(10));

                return $data;
            }),
        ];
    }
}
