<?php

namespace App\Filament\Resources\Organizations\Pages;

use App\Filament\Resources\Organizations\OrganizationResource;
use App\Services\AdminAssistService;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageOrganizations extends ManageRecords
{
    protected static string $resource = OrganizationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('stopAssist')->label('Stop assist mode')->color('danger')
                ->visible(fn () => session()->has('assist_organization_id'))
                ->action(function () {
                    app(AdminAssistService::class)->stop(auth()->user());

                    return redirect('/admin/organizations');
                }),
            CreateAction::make(),
        ];
    }
}
