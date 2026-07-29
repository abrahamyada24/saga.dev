<?php

namespace App\Filament\Resources\QrRoutes;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\QrRoutes\Pages\ManageQrRoutes;
use App\Models\Catalog;
use App\Models\QrRoute;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class QrRouteResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = QrRoute::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQrCode;

    protected static ?string $navigationLabel = 'QR & Share';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('QR destination')->schema([
                Select::make('catalog_id')->options(fn () => Catalog::query()->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))->pluck('name', 'id'))->required(),
                TextInput::make('label')->required()->maxLength(120),
                TextInput::make('source_key')->maxLength(120),
                Select::make('destination_surface')->options(['mobile' => 'Mobile Catalog', 'store' => 'Store Display'])->default('mobile')->required(),
                Select::make('status')->options(['active' => 'Active', 'paused' => 'Paused', 'archived' => 'Archived'])->default('active')->required(),
                DateTimePicker::make('starts_at')->label('Aktif mulai')->timezone('Asia/Jakarta'),
                DateTimePicker::make('ends_at')->label('Aktif sampai')->timezone('Asia/Jakarta')->after('starts_at'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('label')->searchable(),
            TextColumn::make('catalog.name')->label('Catalog'),
            TextColumn::make('code')->copyable(),
            TextColumn::make('destination_surface')->badge(),
            TextColumn::make('status')->badge()->color(fn ($state) => $state === 'active' ? 'success' : 'warning'),
            TextColumn::make('starts_at')->label('Mulai')->dateTime('d M Y H:i')->placeholder('Sekarang'),
            TextColumn::make('ends_at')->label('Selesai')->dateTime('d M Y H:i')->placeholder('Tanpa batas'),
            TextColumn::make('updated_at')->since(),
        ])->recordActions([
            Action::make('open')->icon(Heroicon::OutlinedArrowTopRightOnSquare)->url(fn (QrRoute $record) => route('qr.redirect', $record->code))->openUrlInNewTab(),
            Action::make('download')->icon(Heroicon::OutlinedArrowDownTray)->url(fn (QrRoute $record) => route('qr.download', $record->code)),
            EditAction::make(),
            Action::make('pause')->label(fn (QrRoute $record) => $record->status === 'active' ? 'Pause' : 'Activate')
                ->action(fn (QrRoute $record) => $record->update(['status' => $record->status === 'active' ? 'paused' : 'active'])),
        ]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageQrRoutes::route('/')];
    }
}
