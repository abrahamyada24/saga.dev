<?php

namespace App\Filament\Resources\AuditLogs;

use App\Filament\Concerns\ScopesTenantRecords;
use App\Filament\Resources\AuditLogs\Pages\ManageAuditLogs;
use App\Models\AuditLog;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AuditLogResource extends Resource
{
    use ScopesTenantRecords;

    protected static ?string $model = AuditLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    protected static ?string $navigationLabel = 'Audit Log';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('created_at')->label('Time')->dateTime()->sortable(),
            TextColumn::make('user.name')->label('Actor')->placeholder('System'),
            TextColumn::make('action')->badge()->searchable(),
            TextColumn::make('auditable_type')->label('Entity')->formatStateUsing(fn ($state) => class_basename($state)),
            TextColumn::make('auditable_id')->label('ID'),
            TextColumn::make('reason')->limit(60)->placeholder('-'),
            TextColumn::make('ip_address')->label('IP')->toggleable(isToggledHiddenByDefault: true),
        ])->filters([
            SelectFilter::make('action')->options(fn () => AuditLog::query()->distinct()->pluck('action', 'action')),
        ])->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return ['index' => ManageAuditLogs::route('/')];
    }
}
