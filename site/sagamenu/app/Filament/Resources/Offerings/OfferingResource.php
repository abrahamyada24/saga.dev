<?php

namespace App\Filament\Resources\Offerings;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\Offerings\Pages\ManageOfferings;
use App\Models\Catalog;
use App\Models\Collection;
use App\Models\MediaAsset;
use App\Models\Offering;
use App\Services\OfferingDuplicator;
use App\Services\Publishing\CatalogAvailabilityPublisher;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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

class OfferingResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = Offering::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static ?string $navigationLabel = 'Offerings';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Offering')->schema([
                Select::make('catalog_id')
                    ->options(fn () => Catalog::query()->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))->pluck('name', 'id'))
                    ->required()->live(),
                Select::make('primary_collection_id')->label('Primary collection')
                    ->options(fn ($get) => Collection::query()->where('catalog_id', $get('catalog_id'))->pluck('name', 'id'))->required(),
                Select::make('collections')->relationship(
                    'collections',
                    'name',
                    fn ($query) => $query->when(! auth()->user()->isSagaDevAdmin(), fn ($tenantQuery) => $tenantQuery->where('organization_id', auth()->user()->currentOrganization()?->id)),
                )->multiple()->preload()->label('Additional collections'),
                TextInput::make('name')->required()->maxLength(140)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('slug')->required()->alphaDash()->maxLength(140),
                Textarea::make('short_description')->rows(2)->maxLength(240),
                Textarea::make('full_description')->rows(5)->maxLength(2000),
                TagsInput::make('badges')->maxItems(2),
                TagsInput::make('tags'),
                Toggle::make('is_featured')->label('Featured'),
                TextInput::make('sort_order')->numeric()->minValue(0)->default(0),
            ])->columns(2),
            Section::make('Price and promo')->schema([
                Select::make('price_type')->options([
                    'fixed' => 'Fixed', 'starting_from' => 'Starting from', 'range' => 'Range', 'free' => 'Free', 'contact' => 'Contact', 'hidden' => 'Hidden',
                ])->default('fixed')->required(),
                TextInput::make('price_min_minor')->label('Price / minimum')->numeric()->minValue(0)->prefix('Rp'),
                TextInput::make('price_max_minor')->label('Maximum price')->numeric()->minValue(0)->prefix('Rp'),
                TextInput::make('price_label')->label('Custom label')->maxLength(80),
                TextInput::make('original_price_minor')->numeric()->minValue(0)->prefix('Rp'),
                TextInput::make('promo_price_minor')->numeric()->minValue(0)->prefix('Rp'),
                TextInput::make('promo_label')->maxLength(80),
                DateTimePicker::make('promo_starts_at'),
                DateTimePicker::make('promo_ends_at'),
                Textarea::make('promo_terms')->rows(2)->maxLength(500),
            ])->columns(3),
            Section::make('Availability and visibility')->schema([
                Select::make('availability')->options([
                    'available' => 'Available', 'sold_out' => 'Sold out', 'temporary' => 'Temporary', 'coming_soon' => 'Coming soon', 'seasonal' => 'Seasonal',
                ])->default('available')->required(),
                Select::make('visibility')->options(['both' => 'Both', 'mobile' => 'Mobile only', 'store' => 'Store only', 'hidden' => 'Hidden'])->default('both')->required(),
                DateTimePicker::make('available_from'),
                DateTimePicker::make('available_until'),
            ])->columns(2),
            Section::make('F&B information')->schema([
                Textarea::make('ingredients')->rows(3),
                TagsInput::make('dietary'),
                TagsInput::make('allergens'),
                Select::make('spice_level')->options(['none' => 'None', 'mild' => 'Mild', 'medium' => 'Medium', 'hot' => 'Hot']),
                Select::make('caffeine_level')->options(['none' => 'None', 'low' => 'Low', 'medium' => 'Medium', 'high' => 'High']),
                Textarea::make('serving_note')->rows(3),
            ])->columns(2),
            Section::make('Variants and information options')->schema([
                Repeater::make('variantGroups')->relationship()->schema([
                    TextInput::make('name')->required()->maxLength(80),
                    TextInput::make('sort_order')->numeric()->default(0),
                    Repeater::make('values')->relationship()->schema([
                        TextInput::make('name')->required()->maxLength(80),
                        TextInput::make('price_minor')->numeric()->minValue(0)->prefix('Rp'),
                        TextInput::make('sort_order')->numeric()->default(0),
                    ])->columns(3),
                ])->maxItems(2)->columnSpanFull(),
                Select::make('optionGroups')->relationship(
                    'optionGroups',
                    'name',
                    fn ($query) => $query->when(! auth()->user()->isSagaDevAdmin(), fn ($tenantQuery) => $tenantQuery->where('organization_id', auth()->user()->currentOrganization()?->id)),
                )->multiple()->preload(),
                Repeater::make('inclusions')->relationship()->schema([
                    TextInput::make('name')->required()->maxLength(160),
                    TextInput::make('sort_order')->numeric()->default(0),
                ])->columns(2),
            ]),
            Section::make('Gallery')->description('Choose existing images from the organization media library.')->schema([
                Repeater::make('media')->relationship()->schema([
                    Select::make('media_asset_id')->label('Image')
                        ->options(fn () => MediaAsset::query()
                            ->where('type', 'image')
                            ->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))
                            ->pluck('original_name', 'id'))
                        ->searchable()->preload()->required(),
                    Select::make('role')->options(['primary_image' => 'Primary image', 'gallery_image' => 'Gallery image'])->default('gallery_image')->required(),
                    TextInput::make('sort_order')->numeric()->minValue(0)->default(0),
                    Toggle::make('is_active')->default(true),
                ])->maxItems(8)->columns(4),
            ]),
            Section::make('External information action')->description('Bukan order atau checkout action.')->schema([
                Select::make('external_action_label')->options([
                    'Info Toko' => 'Info Toko',
                    'Hubungi Bisnis' => 'Hubungi Bisnis',
                    'Lihat Lokasi' => 'Lihat Lokasi',
                    'Tanya Staf' => 'Tanya Staf',
                    'Informasi Selengkapnya' => 'Informasi Selengkapnya',
                ]),
                TextInput::make('external_action_url')->url()->maxLength(500),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('primaryCollection.name')->label('Collection')->sortable(),
                TextColumn::make('price_min_minor')->label('Price')->money('IDR', divideBy: 1)->sortable(),
                TextColumn::make('availability')->badge()->color(fn (string $state) => match ($state) {
                    'available' => 'success', 'sold_out' => 'danger', 'coming_soon' => 'info', default => 'warning',
                }),
                TextColumn::make('visibility')->badge(),
                IconColumn::make('is_featured')->label('Featured')->boolean(),
                TextColumn::make('updated_at')->since()->sortable(),
            ])
            ->filters([
                SelectFilter::make('availability')->options(['available' => 'Available', 'sold_out' => 'Sold out', 'coming_soon' => 'Coming soon']),
                SelectFilter::make('visibility')->options(['both' => 'Both', 'mobile' => 'Mobile', 'store' => 'Store', 'hidden' => 'Hidden']),
            ])
            ->recordActions([
                Action::make('availability')->label(fn (Offering $record) => $record->availability === 'sold_out' ? 'Mark available' : 'Mark sold out')
                    ->icon(Heroicon::OutlinedBolt)
                    ->color(fn (Offering $record) => $record->availability === 'sold_out' ? 'success' : 'danger')
                    ->visible(fn (Offering $record) => Gate::allows('publish', $record->catalog))
                    ->requiresConfirmation()
                    ->action(function (Offering $record): void {
                        $availability = $record->availability === 'sold_out' ? 'available' : 'sold_out';
                        app(CatalogAvailabilityPublisher::class)->updateAndPublish($record, $availability, auth()->user());
                    }),
                Action::make('duplicate')->label('Duplicate')->icon(Heroicon::OutlinedSquare2Stack)
                    ->action(fn (Offering $record) => app(OfferingDuplicator::class)->duplicate($record)),
                EditAction::make(),
                Action::make('archive')->color('danger')->icon(Heroicon::OutlinedArchiveBox)->requiresConfirmation()
                    ->action(fn (Offering $record) => $record->update(['archived_at' => now(), 'visibility' => 'hidden'])),
            ])
            ->reorderable('sort_order')
            ->defaultSort('updated_at', 'desc');
    }

    public static function getPages(): array
    {
        return ['index' => ManageOfferings::route('/')];
    }
}
