<?php

namespace App\Filament\Resources\OrganizationMemberships\Pages;

use App\Filament\Resources\OrganizationMemberships\OrganizationMembershipResource;
use App\Models\Organization;
use App\Services\OrganizationInvitationService;
use App\Services\TenantContext;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ManageRecords;

class ManageOrganizationMemberships extends ManageRecords
{
    protected static string $resource = OrganizationMembershipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('invite')
                ->label('Invite member')
                ->schema([
                    Select::make('organization_id')
                        ->options(fn () => auth()->user()->isSagaDevAdmin()
                            ? Organization::query()->pluck('name', 'id')
                            : auth()->user()->organizations()->pluck('organizations.name', 'organizations.id'))
                        ->default(fn () => app(TenantContext::class)->organizationId(auth()->user()))
                        ->visible(fn () => auth()->user()->isSagaDevAdmin())
                        ->required(fn () => auth()->user()->isSagaDevAdmin()),
                    TextInput::make('email')->email()->required()->maxLength(255),
                    Select::make('role')->options(['owner' => 'Owner', 'manager' => 'Manager', 'editor' => 'Editor'])->default('editor')->required(),
                ])
                ->action(function (array $data): void {
                    $organizationId = auth()->user()->isSagaDevAdmin()
                        ? $data['organization_id']
                        : auth()->user()->currentOrganization()?->id;
                    $organization = Organization::query()->findOrFail($organizationId);
                    app(OrganizationInvitationService::class)->create($organization, $data['email'], $data['role'], auth()->user());
                    Notification::make()->title('Invitation sent')->success()->send();
                }),
        ];
    }
}
