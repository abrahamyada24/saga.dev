<?php

namespace App\Filament\Resources\OptionGroups;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\OptionGroups\Pages\ManageOptionGroups;
use App\Models\OptionGroup;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
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

class OptionGroupResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = OptionGroup::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAdjustmentsHorizontal;

    protected static ?string $navigationLabel = 'Add-ons';

    protected static ?string $modelLabel = 'add-on group';

    protected static ?string $pluralModelLabel = 'add-on groups';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Aturan add-on')
                ->description('Add-on hanya ditampilkan sebagai informasi dan tidak membuat pesanan.')
                ->schema([
                    TextInput::make('name')->label('Nama grup')->placeholder('Contoh: Pilihan susu')->required()->maxLength(120),
                    Textarea::make('description')->label('Keterangan')->rows(3)->maxLength(320),
                    Select::make('selection_type')
                        ->label('Cara memilih')
                        ->options(['single' => 'Pilih satu', 'multiple' => 'Boleh lebih dari satu'])
                        ->default('multiple')
                        ->required(),
                    TextInput::make('min_selections')->label('Minimum pilihan')->numeric()->minValue(0)->default(0)->required(),
                    TextInput::make('max_selections')->label('Maksimum pilihan')->numeric()->minValue(1)->gte('min_selections'),
                    Toggle::make('is_active')->label('Tampilkan grup ini')->default(true),
                    Repeater::make('values')->relationship()->schema([
                        TextInput::make('name')->label('Nama opsi')->required()->maxLength(120),
                        TextInput::make('price_delta_minor')->label('Tambahan harga')->numeric()->minValue(0)->prefix('Rp'),
                    ])->label('Daftar opsi')->addActionLabel('Tambah opsi')->columns(2)->reorderable()->orderColumn('sort_order')->columnSpanFull(),
                ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->searchable(),
            TextColumn::make('selection_type')->label('Aturan')->formatStateUsing(fn (string $state) => $state === 'single' ? 'Pilih satu' : 'Multi'),
            TextColumn::make('values_count')->counts('values')->label('Opsi'),
            TextColumn::make('offerings_count')->counts('offerings')->label('Dipakai menu'),
            IconColumn::make('is_active')->label('Aktif')->boolean(),
            TextColumn::make('updated_at')->label('Diperbarui')->since(),
        ])->recordActions([EditAction::make()->slideOver()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageOptionGroups::route('/')];
    }
}
