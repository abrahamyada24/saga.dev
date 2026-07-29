<?php

namespace App\Filament\Resources\Offerings;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\Offerings\Pages\CreateOffering;
use App\Filament\Resources\Offerings\Pages\EditOffering;
use App\Filament\Resources\Offerings\Pages\ManageOfferings;
use App\Models\Catalog;
use App\Models\Collection;
use App\Models\MediaAsset;
use App\Models\Offering;
use App\Services\Catalog\BulkOfferingUpdater;
use App\Services\OfferingDuplicator;
use App\Services\Publishing\CatalogAvailabilityPublisher;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\View;
use Filament\Schemas\Components\Wizard;
use Filament\Schemas\Components\Wizard\Step;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
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
            Wizard::make(static::wizardSteps())
                ->contained(false),
        ]);
    }

    /**
     * @return array<Step>
     */
    public static function wizardSteps(): array
    {
        return [
            Step::make('Informasi dasar')
                ->description('Nama, kategori, harga, dan status')
                ->icon(Heroicon::OutlinedDocumentText)
                ->schema(static::withPreview([
                    Section::make('Informasi yang dicari customer')
                        ->description('Isi bagian utama terlebih dahulu. Slug, currency, dan urutan dikelola otomatis.')
                        ->schema([
                            Select::make('catalog_id')
                                ->label('Katalog')
                                ->options(fn () => Catalog::query()
                                    ->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))
                                    ->pluck('name', 'id'))
                                ->default(fn () => Catalog::query()
                                    ->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))
                                    ->value('id'))
                                ->required()
                                ->live(),
                            Select::make('primary_collection_id')
                                ->label('Kategori')
                                ->options(fn (Get $get) => Collection::query()
                                    ->where('catalog_id', $get('catalog_id'))
                                    ->whereNull('archived_at')
                                    ->pluck('name', 'id'))
                                ->required()
                                ->searchable()
                                ->preload(),
                            TextInput::make('name')
                                ->label('Nama menu')
                                ->placeholder('Contoh: Iced Aren Latte')
                                ->required()
                                ->maxLength(140)
                                ->live(debounce: 350),
                            Select::make('price_type')
                                ->label('Jenis harga')
                                ->options([
                                    'fixed' => 'Harga tetap',
                                    'starting_from' => 'Mulai dari',
                                    'range' => 'Rentang harga',
                                    'free' => 'Gratis',
                                    'contact' => 'Tanya staf',
                                    'hidden' => 'Sembunyikan harga',
                                ])
                                ->default('fixed')
                                ->required()
                                ->live(),
                            TextInput::make('price_min_minor')
                                ->label('Harga')
                                ->numeric()
                                ->minValue(0)
                                ->prefix('Rp')
                                ->required(fn (Get $get) => in_array($get('price_type'), ['fixed', 'starting_from', 'range'], true))
                                ->live(debounce: 350),
                            TextInput::make('price_max_minor')
                                ->label('Harga maksimum')
                                ->numeric()
                                ->minValue(0)
                                ->prefix('Rp')
                                ->visible(fn (Get $get) => $get('price_type') === 'range'),
                            Textarea::make('short_description')
                                ->label('Deskripsi singkat')
                                ->placeholder('Rasa, bahan utama, atau hal yang membuat menu ini menarik.')
                                ->rows(4)
                                ->maxLength(240)
                                ->live(debounce: 350)
                                ->columnSpanFull(),
                            Select::make('availability')
                                ->label('Status ketersediaan')
                                ->options([
                                    'available' => 'Tersedia',
                                    'sold_out' => 'Sold out',
                                    'temporary' => 'Sementara tidak tersedia',
                                    'coming_soon' => 'Segera hadir',
                                    'seasonal' => 'Musiman',
                                ])
                                ->default('available')
                                ->required()
                                ->live(),
                            Toggle::make('is_featured')
                                ->label('Tampilkan sebagai menu unggulan'),
                        ])
                        ->columns(2),
                ])),
            Step::make('Foto & media')
                ->description('Upload atau pilih dari Media Library')
                ->icon(Heroicon::OutlinedPhoto)
                ->schema(static::withPreview([
                    Section::make('Foto utama')
                        ->description('Tidak perlu menempel URL. Upload baru akan tervalidasi sebelum menjadi media organisasi.')
                        ->schema([
                            FileUpload::make('primary_image_upload')
                                ->label('Upload dari perangkat')
                                ->disk('public')
                                ->directory(fn () => 'organizations/'.(auth()->user()->currentOrganization()?->id ?? 'admin').'/media')
                                ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                                ->maxSize(5120)
                                ->image()
                                ->imageEditor()
                                ->imageEditorAspectRatioOptions(['1:1', '4:3', '16:10'])
                                ->imagePreviewHeight('260')
                                ->helperText('JPG, PNG, atau WebP maksimal 5 MB. Upload baru menggantikan pilihan foto utama.')
                                ->columnSpanFull(),
                            Select::make('primary_image_asset_id')
                                ->label('Atau pilih dari Media Library')
                                ->options(fn () => static::mediaOptions())
                                ->searchable()
                                ->preload(),
                            Select::make('gallery_media_asset_ids')
                                ->label('Galeri tambahan')
                                ->options(fn () => static::mediaOptions())
                                ->multiple()
                                ->maxItems(7)
                                ->searchable()
                                ->preload(),
                        ])
                        ->columns(2),
                    Section::make('Video menu')
                        ->description('Opsional. Video tampil di detail menu dengan kontrol manual dan tanpa autoplay.')
                        ->schema([
                            FileUpload::make('video_upload')
                                ->label('Upload video dari perangkat')
                                ->disk('public')
                                ->directory(fn () => 'organizations/'.(auth()->user()->currentOrganization()?->id ?? 'admin').'/media')
                                ->acceptedFileTypes(['video/mp4', 'video/webm'])
                                ->maxSize((int) config('sagamenu.media.video_max_kb', 51200))
                                ->helperText('MP4 atau WebM maksimal 50 MB. Rekomendasi durasi maksimal 60 detik.')
                                ->columnSpanFull(),
                            Select::make('video_asset_id')
                                ->label('Atau pilih video dari Media Library')
                                ->options(fn () => static::videoOptions())
                                ->searchable()
                                ->preload(),
                        ])
                        ->columns(2),
                ])),
            Step::make('Pilihan & detail')
                ->description('Variants, add-on, dan informasi menu')
                ->icon(Heroicon::OutlinedAdjustmentsHorizontal)
                ->schema(static::withPreview([
                    Section::make('Variants dan pilihan informasi')
                        ->description('Kosongkan jika menu tidak mempunyai pilihan tambahan.')
                        ->schema([
                            Repeater::make('variantGroups')
                                ->relationship()
                                ->label('Variant, misalnya penyajian atau ukuran')
                                ->schema([
                                    TextInput::make('name')->label('Nama grup')->required()->maxLength(80),
                                    Repeater::make('values')
                                        ->relationship()
                                        ->label('Pilihan')
                                        ->defaultItems(0)
                                        ->schema([
                                            TextInput::make('name')->label('Nama')->required()->maxLength(80),
                                            TextInput::make('price_minor')->label('Harga')->numeric()->minValue(0)->prefix('Rp'),
                                            TextInput::make('sort_order')->label('Urutan')->numeric()->default(0),
                                        ])
                                        ->columns(3),
                                    TextInput::make('sort_order')->label('Urutan grup')->numeric()->default(0),
                                ])
                                ->defaultItems(0)
                                ->maxItems(2)
                                ->reorderable()
                                ->columnSpanFull(),
                            Select::make('optionGroups')
                                ->relationship(
                                    'optionGroups',
                                    'name',
                                    fn ($query) => $query->when(! auth()->user()->isSagaDevAdmin(), fn ($tenantQuery) => $tenantQuery->where('organization_id', auth()->user()->currentOrganization()?->id)),
                                )
                                ->label('Grup add-on')
                                ->multiple()
                                ->preload()
                                ->searchable(),
                            Select::make('collections')
                                ->relationship(
                                    'collections',
                                    'name',
                                    fn ($query) => $query->when(! auth()->user()->isSagaDevAdmin(), fn ($tenantQuery) => $tenantQuery->where('organization_id', auth()->user()->currentOrganization()?->id)),
                                )
                                ->multiple()
                                ->preload()
                                ->label('Kategori tambahan'),
                        ])
                        ->columns(2),
                    Section::make('Informasi lanjutan')
                        ->collapsed()
                        ->schema([
                            TagsInput::make('badges')->label('Badge')->rules(['array', 'max:2']),
                            TagsInput::make('allergens')->label('Alergen'),
                            TagsInput::make('dietary')->label('Dietary'),
                            Textarea::make('ingredients')->label('Bahan utama')->rows(3),
                            Select::make('spice_level')->label('Level pedas')->options(['none' => 'Tidak pedas', 'mild' => 'Ringan', 'medium' => 'Sedang', 'hot' => 'Pedas']),
                            Select::make('caffeine_level')->label('Kafein')->options(['none' => 'Tanpa kafein', 'low' => 'Rendah', 'medium' => 'Sedang', 'high' => 'Tinggi']),
                            Textarea::make('serving_note')->label('Catatan penyajian')->rows(3),
                            Textarea::make('full_description')->label('Deskripsi lengkap')->rows(5)->maxLength(2000)->columnSpanFull(),
                        ])
                        ->columns(2),
                    Section::make('Promo dan visibilitas')
                        ->collapsed()
                        ->schema([
                            Select::make('visibility')->label('Tampil di')->options(['both' => 'Bio dan Store', 'mobile' => 'Bio saja', 'store' => 'Store saja', 'hidden' => 'Disembunyikan'])->default('both')->required(),
                            TextInput::make('original_price_minor')->label('Harga asli')->numeric()->minValue(0)->prefix('Rp'),
                            TextInput::make('promo_price_minor')->label('Harga promo')->numeric()->minValue(0)->prefix('Rp'),
                            TextInput::make('promo_label')->label('Label promo')->maxLength(80),
                            DateTimePicker::make('promo_starts_at')->label('Promo mulai'),
                            DateTimePicker::make('promo_ends_at')->label('Promo selesai'),
                            Textarea::make('promo_terms')->label('Syarat promo')->rows(2)->maxLength(500)->columnSpanFull(),
                        ])
                        ->columns(2),
                ])),
            Step::make('Review')
                ->description('Periksa dan simpan sebagai draft')
                ->icon(Heroicon::OutlinedCheckCircle)
                ->schema(static::withPreview([
                    Section::make('Checklist draft')
                        ->description('Perubahan tidak tampil ke customer sampai catalog dipublish.')
                        ->schema([
                            View::make('filament.forms.offering-review'),
                        ]),
                    Section::make('Informasi eksternal')
                        ->description('Opsional dan bukan order atau checkout.')
                        ->collapsed()
                        ->schema([
                            Select::make('external_action_label')->label('Label informasi')->options([
                                'Info Toko' => 'Info Toko',
                                'Hubungi Bisnis' => 'Hubungi Bisnis',
                                'Lihat Lokasi' => 'Lihat Lokasi',
                                'Tanya Staf' => 'Tanya Staf',
                                'Informasi Selengkapnya' => 'Informasi Selengkapnya',
                            ]),
                            TextInput::make('external_action_url')->label('URL informasi')->url()->maxLength(500),
                        ])
                        ->columns(2),
                ])),
        ];
    }

    private static function withPreview(array $components): array
    {
        return [
            Grid::make(['default' => 1, 'xl' => 3])
                ->schema([
                    Group::make($components)
                        ->columnSpan(['default' => 1, 'xl' => 2]),
                    View::make('filament.forms.offering-live-preview')
                        ->viewData(fn (Get $get): array => [
                            'name' => $get('name') ?: 'Item baru',
                            'description' => $get('short_description') ?: 'Deskripsi menu akan tampil di sini.',
                            'price' => (int) ($get('price_min_minor') ?: 0),
                            'availability' => $get('availability') ?: 'available',
                        ])
                        ->columnSpan(1),
                ]),
        ];
    }

    private static function mediaOptions()
    {
        return MediaAsset::query()
            ->where('type', 'image')
            ->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))
            ->latest()
            ->pluck('original_name', 'id');
    }

    private static function videoOptions()
    {
        return MediaAsset::query()
            ->where('type', 'video')
            ->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))
            ->latest()
            ->pluck('original_name', 'id');
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
                EditAction::make()
                    ->url(fn (Offering $record) => static::getUrl('edit', ['record' => $record])),
                Action::make('archive')->color('danger')->icon(Heroicon::OutlinedArchiveBox)->requiresConfirmation()
                    ->action(fn (Offering $record) => $record->update(['archived_at' => now(), 'visibility' => 'hidden'])),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('mark_available')
                        ->label('Tandai tersedia')
                        ->icon(Heroicon::OutlinedEye)
                        ->action(fn (EloquentCollection $records) => static::runBulkUpdate($records, ['availability' => 'available'])),
                    BulkAction::make('mark_sold_out')
                        ->label('Tandai sold out')
                        ->icon(Heroicon::OutlinedEyeSlash)
                        ->color('danger')
                        ->action(fn (EloquentCollection $records) => static::runBulkUpdate($records, ['availability' => 'sold_out'])),
                    BulkAction::make('show_both')
                        ->label('Tampilkan di kedua surface')
                        ->icon(Heroicon::OutlinedRectangleGroup)
                        ->action(fn (EloquentCollection $records) => static::runBulkUpdate($records, ['visibility' => 'both'])),
                    BulkAction::make('hide')
                        ->label('Sembunyikan')
                        ->icon(Heroicon::OutlinedEyeSlash)
                        ->requiresConfirmation()
                        ->action(fn (EloquentCollection $records) => static::runBulkUpdate($records, ['visibility' => 'hidden'])),
                ]),
            ])
            ->reorderable('sort_order')
            ->defaultSort('updated_at', 'desc');
    }

    /**
     * @param  array<string, mixed>  $changes
     */
    private static function runBulkUpdate(EloquentCollection $records, array $changes): void
    {
        foreach ($records->groupBy('catalog_id') as $catalogId => $catalogRecords) {
            $catalog = Catalog::query()->findOrFail($catalogId);
            Gate::authorize('update', $catalog);
            app(BulkOfferingUpdater::class)->update(
                $catalog,
                $catalogRecords->modelKeys(),
                $changes,
                auth()->user(),
                (string) Str::uuid(),
            );
        }
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageOfferings::route('/'),
            'create' => CreateOffering::route('/create'),
            'edit' => EditOffering::route('/{record}/edit'),
        ];
    }
}
