<?php

namespace App\Filament\Resources\OrganizationMemberships;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\OrganizationMemberships\Pages\ManageOrganizationMemberships;
use App\Models\OrganizationMembership;
use App\Services\OrganizationMembershipService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrganizationMembershipResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = OrganizationMembership::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static ?string $navigationLabel = 'Team';

    protected static ?string $modelLabel = 'team member';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user?->isSagaDevAdmin() || $user?->roleFor($user->currentOrganization()?->id ?? 0) === 'owner';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->label('Member')->searchable(),
                TextColumn::make('user.email')->label('Email')->searchable(),
                TextColumn::make('organization.name')->label('Organization')->visible(fn () => auth()->user()->isSagaDevAdmin()),
                TextColumn::make('role')->badge()->color(fn (string $state) => match ($state) {
                    'owner' => 'success', 'manager' => 'info', default => 'gray',
                }),
                TextColumn::make('status')->badge()->color(fn (string $state) => $state === 'active' ? 'success' : 'danger'),
                TextColumn::make('accepted_at')->label('Joined')->dateTime('d M Y')->placeholder('Pending'),
            ])
            ->filters([
                SelectFilter::make('role')->options(['owner' => 'Owner', 'manager' => 'Manager', 'editor' => 'Editor']),
                SelectFilter::make('status')->options(['active' => 'Active', 'inactive' => 'Inactive']),
            ])
            ->recordActions([
                Action::make('changeRole')
                    ->label('Change role')
                    ->icon(Heroicon::OutlinedShieldCheck)
                    ->schema([
                        Select::make('role')->options(['owner' => 'Owner', 'manager' => 'Manager', 'editor' => 'Editor'])->required(),
                    ])
                    ->fillForm(fn (OrganizationMembership $record): array => ['role' => $record->role])
                    ->action(function (OrganizationMembership $record, array $data): void {
                        app(OrganizationMembershipService::class)->changeRole($record, $data['role'], auth()->user());
                        Notification::make()->title('Member role updated')->success()->send();
                    }),
                Action::make('toggleStatus')
                    ->label(fn (OrganizationMembership $record) => $record->status === 'active' ? 'Deactivate' : 'Reactivate')
                    ->icon(Heroicon::OutlinedUserMinus)
                    ->color(fn (OrganizationMembership $record) => $record->status === 'active' ? 'danger' : 'success')
                    ->requiresConfirmation()
                    ->action(function (OrganizationMembership $record): void {
                        $status = $record->status === 'active' ? 'inactive' : 'active';
                        app(OrganizationMembershipService::class)->changeStatus($record, $status, auth()->user());
                        Notification::make()->title("Member {$status}")->success()->send();
                    }),
                Action::make('remove')
                    ->label('Remove')
                    ->icon(Heroicon::OutlinedTrash)
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function (OrganizationMembership $record): void {
                        app(OrganizationMembershipService::class)->remove($record, auth()->user());
                        Notification::make()->title('Member removed')->success()->send();
                    }),
            ])
            ->defaultSort('created_at');
    }

    public static function getPages(): array
    {
        return ['index' => ManageOrganizationMemberships::route('/')];
    }
}
