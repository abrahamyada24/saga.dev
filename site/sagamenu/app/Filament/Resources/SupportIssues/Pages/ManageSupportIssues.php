<?php

namespace App\Filament\Resources\SupportIssues\Pages;

use App\Filament\Resources\SupportIssues\SupportIssueResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageSupportIssues extends ManageRecords
{
    protected static string $resource = SupportIssueResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->mutateDataUsing(function (array $data): array {
                $data['organization_id'] = auth()->user()->isSagaDevAdmin()
                    ? session('assist_organization_id')
                    : auth()->user()->currentOrganization()?->id;
                abort_unless($data['organization_id'], 422, 'Choose an assist organization before creating a support issue.');

                return $data;
            }),
        ];
    }
}
