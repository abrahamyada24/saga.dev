<?php

namespace App\Filament\Resources\Catalogs;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\Catalogs\Pages\ManageCatalogs;
use App\Models\Catalog;
use App\Models\CustomFont;
use App\Models\Location;
use App\Models\Organization;
use App\Services\AppearancePreset;
use App\Services\CatalogDuplicator;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\PreviewTokenService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class CatalogResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = Catalog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBookOpen;

    protected static ?string $navigationLabel = 'Catalogs';

    protected static ?string $modelLabel = 'catalog';

    protected static ?string $pluralModelLabel = 'catalogs';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Catalog identity')->schema([
                Select::make('organization_id')
                    ->label('Organization')
                    ->options(fn () => auth()->user()->isSagaDevAdmin()
                        ? Organization::query()->pluck('name', 'id')
                        : auth()->user()->organizations()->pluck('organizations.name', 'organizations.id'))
                    ->default(fn () => auth()->user()->currentOrganization()?->id)
                    ->disabled(fn () => ! auth()->user()->isSagaDevAdmin())
                    ->dehydrated()
                    ->required(),
                Select::make('location_id')
                    ->label('Location')
                    ->options(fn () => Location::query()
                        ->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))
                        ->pluck('name', 'id')),
                TextInput::make('name')->required()->maxLength(120)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('slug')->required()->alphaDash()->maxLength(120),
                Select::make('vertical')->options(['fnb' => 'F&B', 'service' => 'Service', 'product' => 'Product'])->default('fnb')->required(),
                Select::make('status')->options(['draft' => 'Draft', 'published' => 'Published', 'unpublished' => 'Unpublished'])->default('draft')->disabled()->dehydrated(),
                Toggle::make('store_display_enabled')->label('Store Display')->default(true),
                Toggle::make('mobile_catalog_enabled')->label('Mobile Catalog')->default(true),
            ])->columns(2),
            Section::make('Public presentation')->schema([
                TextInput::make('hero_title')->maxLength(120),
                Textarea::make('hero_subtitle')->rows(3)->maxLength(320),
                TextInput::make('seo_title')->maxLength(70),
                Textarea::make('seo_description')->rows(3)->maxLength(180),
            ])->columns(2),
            Section::make('Appearance')->schema([
                Select::make('appearance.preset')->options([
                    'editorial_kv' => 'Editorial KV',
                    'warm_minimal' => 'Warm Minimal',
                    'bold_street' => 'Bold Street',
                    'clean_premium' => 'Clean Premium',
                    'modern_cafe' => 'Modern Cafe',
                    'playful_pop' => 'Playful Pop',
                ])->default('editorial_kv')->required(),
                ColorPicker::make('appearance.primary_color')->default('#236354'),
                ColorPicker::make('appearance.accent_color')->default('#cbf45a'),
                ColorPicker::make('appearance.paper_color')->default('#f3f5f1'),
                Select::make('appearance.heading_font')->label('Font judul')->options(['Plus Jakarta Sans' => 'Plus Jakarta Sans', 'Georgia' => 'Georgia'])->default('Plus Jakarta Sans'),
                Select::make('appearance.body_font')->label('Font isi')->options(['Plus Jakarta Sans' => 'Plus Jakarta Sans', 'Georgia' => 'Georgia'])->default('Plus Jakarta Sans'),
                Select::make('custom_font_id')->label('Uploaded brand font')
                    ->options(fn () => CustomFont::query()->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))->where('is_active', true)->pluck('family_name', 'id')),
                Select::make('appearance.density')->options(['comfortable' => 'Comfortable', 'compact' => 'Compact'])->default('comfortable'),
                Select::make('appearance.mobile_layout')->label('Layout Bio Menu')->options(['editorial_list' => 'Editorial list', 'photo_grid' => 'Photo grid'])->default('editorial_list'),
                Select::make('appearance.store_layout')->label('Layout Store Display')->options(['editorial_grid' => 'Editorial grid', 'photo_grid' => 'Photo grid'])->default('editorial_grid'),
            ])->columns(3),
            Section::make('Business information')->schema([
                TextInput::make('business_info.hours')->label('Opening hours')->maxLength(160),
                TextInput::make('business_info.phone')->label('Phone')->tel()->maxLength(40),
                TextInput::make('business_info.instagram')->label('Instagram')->maxLength(80),
                TextInput::make('business_info.maps_url')->label('Maps URL')->url()->maxLength(500),
                Textarea::make('business_info.address')->label('Address')->rows(3)->maxLength(500),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('organization.name')->label('Organization')->visible(fn () => auth()->user()->isSagaDevAdmin()),
                TextColumn::make('status')->badge()->color(fn (string $state) => match ($state) {
                    'published' => 'success', 'draft' => 'warning', default => 'gray',
                }),
                IconColumn::make('store_display_enabled')->label('Store')->boolean(),
                IconColumn::make('mobile_catalog_enabled')->label('Mobile')->boolean(),
                TextColumn::make('last_published_at')->label('Last publish')->since()->placeholder('Belum pernah'),
                TextColumn::make('updated_at')->since()->sortable(),
            ])
            ->filters([SelectFilter::make('status')->options(['draft' => 'Draft', 'published' => 'Published', 'unpublished' => 'Unpublished'])])
            ->recordActions([
                Action::make('previewMobile')->label('Preview mobile')->icon(Heroicon::OutlinedDevicePhoneMobile)
                    ->action(function (Catalog $record) {
                        $token = app(PreviewTokenService::class)->create($record, 'mobile', auth()->user());

                        return redirect()->to(route('public.preview', $token));
                    }),
                Action::make('previewStore')->label('Preview store')->icon(Heroicon::OutlinedComputerDesktop)
                    ->action(function (Catalog $record) {
                        $token = app(PreviewTokenService::class)->create($record, 'store', auth()->user());

                        return redirect()->to(route('public.preview', $token));
                    }),
                Action::make('publish')->label('Publish')->icon(Heroicon::OutlinedCloudArrowUp)->color('success')->requiresConfirmation()
                    ->action(function (Catalog $record): void {
                        Gate::authorize('publish', $record);
                        app(CatalogPublisher::class)->publish($record, auth()->user());
                        Notification::make()->title('Catalog published')->success()->send();
                    }),
                Action::make('unpublish')->label('Unpublish')->icon(Heroicon::OutlinedEyeSlash)->color('danger')->requiresConfirmation()
                    ->visible(fn (Catalog $record) => $record->active_snapshot_id !== null)
                    ->action(function (Catalog $record): void {
                        Gate::authorize('publish', $record);
                        app(CatalogPublisher::class)->unpublish($record, auth()->user());
                        Notification::make()->title('Catalog unpublished')->success()->send();
                    }),
                Action::make('applyPreset')->label('Apply preset')->icon(Heroicon::OutlinedSwatch)
                    ->schema([
                        Select::make('preset')->options([
                            'editorial_kv' => 'Editorial KV',
                            'warm_minimal' => 'Warm Minimal',
                            'bold_street' => 'Bold Street',
                            'clean_premium' => 'Clean Premium',
                            'modern_cafe' => 'Modern Cafe',
                            'playful_pop' => 'Playful Pop',
                        ])->required(),
                    ])
                    ->action(function (Catalog $record, array $data): void {
                        Gate::authorize('update', $record);
                        app(AppearancePreset::class)->apply($record, $data['preset'], auth()->user());
                        Notification::make()->title('Appearance preset applied')->success()->send();
                    }),
                Action::make('duplicate')->label('Duplicate')->icon(Heroicon::OutlinedSquare2Stack)->requiresConfirmation()
                    ->action(function (Catalog $record): void {
                        Gate::authorize('create', Catalog::class);
                        app(CatalogDuplicator::class)->duplicate($record, auth()->user());
                        Notification::make()->title('Catalog duplicated as draft')->success()->send();
                    }),
                EditAction::make(),
            ])
            ->defaultSort('updated_at', 'desc');
    }

    public static function getPages(): array
    {
        return ['index' => ManageCatalogs::route('/')];
    }
}
