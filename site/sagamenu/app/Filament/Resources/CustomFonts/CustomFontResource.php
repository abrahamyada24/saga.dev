<?php

namespace App\Filament\Resources\CustomFonts;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\CustomFonts\Pages\ManageCustomFonts;
use App\Models\CustomFont;
use App\Models\MediaAsset;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CustomFontResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = CustomFont::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedLanguage;

    protected static ?string $navigationLabel = 'Custom Fonts';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Font settings')->description('Upload file WOFF/WOFF2 melalui Media Library, lalu daftarkan di sini.')->schema([
                Select::make('media_asset_id')->label('Font file')
                    ->options(fn () => MediaAsset::query()->where('organization_id', auth()->user()->currentOrganization()?->id)->where('type', 'font')->pluck('original_name', 'id'))
                    ->required(),
                TextInput::make('family_name')->required()->maxLength(120),
                Select::make('weight')->options([300 => 'Light', 400 => 'Regular', 500 => 'Medium', 600 => 'Semibold', 700 => 'Bold'])->default(400),
                Select::make('style')->options(['normal' => 'Normal', 'italic' => 'Italic'])->default('normal'),
                Toggle::make('is_active')->default(true),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('family_name')->searchable(),
            TextColumn::make('mediaAsset.original_name')->label('File'),
            TextColumn::make('weight'),
            TextColumn::make('style'),
            IconColumn::make('is_active')->boolean(),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageCustomFonts::route('/')];
    }
}
