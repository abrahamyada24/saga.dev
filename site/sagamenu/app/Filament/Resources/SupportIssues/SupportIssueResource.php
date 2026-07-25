<?php

namespace App\Filament\Resources\SupportIssues;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\SupportIssues\Pages\ManageSupportIssues;
use App\Models\SupportIssue;
use App\Models\User;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SupportIssueResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = SupportIssue::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedLifebuoy;

    protected static ?string $navigationLabel = 'Support';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->required()->maxLength(180),
            Textarea::make('description')->rows(5)->maxLength(3000),
            Select::make('priority')->options(['low' => 'Low', 'normal' => 'Normal', 'high' => 'High', 'urgent' => 'Urgent'])->default('normal')->required(),
            Select::make('status')->options(['open' => 'Open', 'in_progress' => 'In progress', 'resolved' => 'Resolved'])->default('open')->required(),
            Select::make('assigned_to_user_id')->label('Assigned to')->options(fn () => User::query()->where('global_role', 'sagadev_admin')->pluck('name', 'id'))->visible(fn () => auth()->user()->isSagaDevAdmin()),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('title')->searchable(),
            TextColumn::make('priority')->badge(),
            TextColumn::make('status')->badge(),
            TextColumn::make('assignedTo.name')->label('Assigned')->placeholder('Unassigned'),
            TextColumn::make('updated_at')->since(),
        ])->filters([
            SelectFilter::make('status')->options(['open' => 'Open', 'in_progress' => 'In progress', 'resolved' => 'Resolved']),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageSupportIssues::route('/')];
    }
}
