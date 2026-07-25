<?php

namespace App\Filament\Resources\OptionGroups;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\OptionGroups\Pages\ManageOptionGroups;
use App\Models\OptionGroup;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OptionGroupResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = OptionGroup::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAdjustmentsHorizontal;

    protected static ?string $navigationLabel = 'Options';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informational option group')->schema([
                TextInput::make('name')->required()->maxLength(120),
                Textarea::make('description')->rows(3)->maxLength(320),
                TextInput::make('sort_order')->numeric()->default(0),
                Repeater::make('values')->relationship()->schema([
                    TextInput::make('name')->required()->maxLength(120),
                    TextInput::make('price_delta_minor')->numeric()->minValue(0)->prefix('Rp'),
                    TextInput::make('sort_order')->numeric()->default(0),
                ])->columns(3)->columnSpanFull(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->searchable(),
            TextColumn::make('values_count')->counts('values')->label('Options'),
            TextColumn::make('offerings_count')->counts('offerings')->label('Used by'),
            TextColumn::make('updated_at')->since(),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageOptionGroups::route('/')];
    }
}
