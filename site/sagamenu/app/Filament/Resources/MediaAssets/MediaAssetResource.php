<?php

namespace App\Filament\Resources\MediaAssets;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\MediaAssets\Pages\ManageMediaAssets;
use App\Models\MediaAsset;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class MediaAssetResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = MediaAsset::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static ?string $navigationLabel = 'Media Library';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Upload')->schema([
                Select::make('type')->options(['image' => 'Image', 'font' => 'Custom font'])->default('image')->required()->live(),
                FileUpload::make('path')->label('File')->disk('public')
                    ->directory(fn () => 'organizations/'.(auth()->user()->currentOrganization()?->id ?? 'admin').'/media')
                    ->acceptedFileTypes(fn ($get) => $get('type') === 'font'
                        ? ['font/woff', 'font/woff2', 'application/font-woff', 'application/octet-stream']
                        : ['image/jpeg', 'image/png', 'image/webp'])
                    ->maxSize(fn ($get) => $get('type') === 'font' ? 1024 : 5120)
                    ->visibility('public')
                    ->required(),
                TextInput::make('alt_text')->label('Alternative text')->maxLength(180),
                Textarea::make('caption')->rows(2)->maxLength(320),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('original_name')->label('File')->searchable(),
                TextColumn::make('type')->badge(),
                TextColumn::make('mime_type')->label('MIME'),
                TextColumn::make('file_size')->formatStateUsing(fn ($state) => $state ? number_format($state / 1024, 0).' KB' : '-'),
                TextColumn::make('alt_text')->limit(40),
                TextColumn::make('created_at')->since(),
            ])
            ->filters([SelectFilter::make('type')->options(['image' => 'Image', 'font' => 'Font'])])
            ->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageMediaAssets::route('/')];
    }
}
