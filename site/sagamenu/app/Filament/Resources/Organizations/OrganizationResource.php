<?php

namespace App\Filament\Resources\Organizations;

use App\Filament\Resources\Organizations\Pages\ManageOrganizations;
use App\Models\Organization;
use App\Services\AdminAssistService;
use App\Services\OrganizationInvitationService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class OrganizationResource extends Resource
{
    protected static ?string $model = Organization::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingStorefront;

    protected static ?string $navigationLabel = 'Organizations';

    public static function canAccess(): bool
    {
        return auth()->user()?->isSagaDevAdmin() ?? false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Client organization')->schema([
                TextInput::make('name')->required()->live(onBlur: true)->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('slug')->required()->alphaDash(),
                Select::make('business_type')->options(['fnb' => 'F&B', 'service' => 'Service', 'product' => 'Product'])->default('fnb'),
                Select::make('status')->options(['active' => 'Active', 'paused' => 'Paused', 'archived' => 'Archived'])->default('active'),
                Select::make('onboarding_status')->options(['setup' => 'Setup', 'content_ready' => 'Content ready', 'complete' => 'Complete'])->default('setup'),
                Select::make('pilot_status')->options(['not_ready' => 'Not ready', 'review' => 'In review', 'approved' => 'Approved', 'paused' => 'Paused'])->default('not_ready'),
                Select::make('attention_status')->options(['clear' => 'Clear', 'open' => 'Needs attention'])->default('clear'),
                Textarea::make('attention_reason')->rows(2)->maxLength(1000),
                Select::make('plan_key')->options(['starter' => 'Starter', 'pro' => 'Pro', 'managed' => 'Managed'])->default('starter'),
                TextInput::make('contact_name'),
                TextInput::make('contact_email')->email(),
                TextInput::make('contact_phone')->tel(),
                Textarea::make('address')->rows(3),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->searchable()->sortable(),
            TextColumn::make('business_type')->badge(),
            TextColumn::make('status')->badge(),
            TextColumn::make('onboarding_status')->label('Onboarding')->badge(),
            TextColumn::make('pilot_status')->label('Pilot')->badge(),
            TextColumn::make('attention_status')->label('Attention')->badge()->color(fn (string $state) => $state === 'open' ? 'danger' : 'success'),
            TextColumn::make('plan_key')->label('Plan')->badge(),
            TextColumn::make('users_count')->counts('users')->label('Team'),
            TextColumn::make('catalogs_count')->counts('catalogs')->label('Catalogs'),
        ])->recordActions([
            Action::make('assist')->label('Start assist')->icon(Heroicon::OutlinedLifebuoy)->color('warning')
                ->schema([Textarea::make('reason')->required()->minLength(10)->maxLength(500)])
                ->action(function (Organization $record, array $data) {
                    app(AdminAssistService::class)->start(auth()->user(), $record, $data['reason']);
                    Notification::make()->title("Assist mode: {$record->name}")->warning()->send();

                    return redirect('/admin');
                }),
            Action::make('invite')->label('Invite member')->icon(Heroicon::OutlinedUserPlus)
                ->schema([
                    TextInput::make('email')->email()->required(),
                    Select::make('role')->options(['owner' => 'Owner', 'manager' => 'Manager', 'editor' => 'Editor'])->default('editor')->required(),
                ])
                ->action(function (Organization $record, array $data): void {
                    app(OrganizationInvitationService::class)->create($record, $data['email'], $data['role'], auth()->user());
                    Notification::make()->title('Invitation sent')->success()->send();
                }),
            Action::make('pilotReview')->label('Pilot status')->icon(Heroicon::OutlinedClipboardDocumentCheck)
                ->schema([
                    Select::make('pilot_status')->options(['not_ready' => 'Not ready', 'review' => 'In review', 'approved' => 'Approved', 'paused' => 'Paused'])->required(),
                    Select::make('onboarding_status')->options(['setup' => 'Setup', 'content_ready' => 'Content ready', 'complete' => 'Complete'])->required(),
                    Select::make('attention_status')->options(['clear' => 'Clear', 'open' => 'Needs attention'])->required(),
                    Textarea::make('attention_reason')->rows(3)->maxLength(1000),
                ])
                ->fillForm(fn (Organization $record): array => $record->only(['pilot_status', 'onboarding_status', 'attention_status', 'attention_reason']))
                ->action(function (Organization $record, array $data): void {
                    $data['pilot_started_at'] = $data['pilot_status'] === 'review' && ! $record->pilot_started_at ? now() : $record->pilot_started_at;
                    $data['pilot_approved_at'] = $data['pilot_status'] === 'approved' ? now() : null;
                    $record->update($data);
                    Notification::make()->title('Pilot status updated')->success()->send();
                }),
            EditAction::make(),
        ]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageOrganizations::route('/')];
    }
}
