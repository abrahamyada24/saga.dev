<?php

namespace App\Filament\Resources\CustomFonts\Pages;

use App\Filament\Resources\CustomFonts\CustomFontResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageCustomFonts extends ManageRecords
{
    protected static string $resource = CustomFontResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->mutateDataUsing(function (array $data): array {
                $data['organization_id'] = auth()->user()->currentOrganization()?->id;

                return $data;
            }),
        ];
    }
}
