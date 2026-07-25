<?php

namespace App\Filament\Resources\CatalogSnapshots;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\CatalogSnapshots\Pages\ManageCatalogSnapshots;
use App\Models\CatalogSnapshot;
use App\Services\Publishing\CatalogPublisher;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Gate;

class CatalogSnapshotResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = CatalogSnapshot::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClock;

    protected static ?string $navigationLabel = 'Publish History';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('catalog.name')->label('Catalog')->searchable(),
            TextColumn::make('version')->label('Version')->sortable(),
            TextColumn::make('published_at')->dateTime()->sortable(),
            TextColumn::make('publishedBy.name')->label('Published by')->placeholder('System'),
            TextColumn::make('checksum')->limit(12)->copyable(),
            IconColumn::make('is_active')->label('Live')->getStateUsing(fn (CatalogSnapshot $record) => $record->catalog->active_snapshot_id === $record->id)->boolean(),
        ])->recordActions([
            Action::make('restore')->icon(Heroicon::OutlinedArrowUturnLeft)->requiresConfirmation()
                ->action(function (CatalogSnapshot $record): void {
                    Gate::authorize('publish', $record->catalog);
                    app(CatalogPublisher::class)->restore($record->catalog, $record, auth()->user());
                    Notification::make()->title("Version {$record->version} restored as a new snapshot")->success()->send();
                }),
        ])->defaultSort('published_at', 'desc');
    }

    public static function getPages(): array
    {
        return ['index' => ManageCatalogSnapshots::route('/')];
    }
}
