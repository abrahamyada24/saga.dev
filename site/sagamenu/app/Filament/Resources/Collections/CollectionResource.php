<?php

namespace App\Filament\Resources\Collections;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\Collections\Pages\ManageCollections;
use App\Models\Catalog;
use App\Models\Collection;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class CollectionResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = Collection::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    protected static ?string $navigationLabel = 'Collections';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Collection')->schema([
                Select::make('catalog_id')
                    ->options(fn () => Catalog::query()
                        ->when(! auth()->user()->isSagaDevAdmin(), fn ($query) => $query->where('organization_id', auth()->user()->currentOrganization()?->id))
                        ->pluck('name', 'id'))
                    ->required(),
                TextInput::make('name')->required()->maxLength(120)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('slug')->required()->alphaDash()->maxLength(120),
                Textarea::make('description')->rows(3)->maxLength(320),
                Toggle::make('is_visible')->default(true),
                TextInput::make('sort_order')->numeric()->minValue(0)->default(0),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('catalog.name')->label('Catalog')->sortable(),
                IconColumn::make('is_visible')->label('Visible')->boolean(),
                TextColumn::make('offerings_count')->counts('offerings')->label('Offerings'),
                TextColumn::make('sort_order')->label('Order')->sortable(),
                TextColumn::make('updated_at')->since(),
            ])
            ->recordActions([
                Action::make('toggleVisibility')->label(fn (Collection $record) => $record->is_visible ? 'Hide' : 'Show')
                    ->icon(Heroicon::OutlinedEye)
                    ->action(fn (Collection $record) => $record->update(['is_visible' => ! $record->is_visible])),
                EditAction::make(),
                Action::make('archive')->color('danger')->icon(Heroicon::OutlinedArchiveBox)->requiresConfirmation()
                    ->action(fn (Collection $record) => $record->update(['archived_at' => now(), 'is_visible' => false])),
            ])
            ->reorderable('sort_order')
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return ['index' => ManageCollections::route('/')];
    }
}
