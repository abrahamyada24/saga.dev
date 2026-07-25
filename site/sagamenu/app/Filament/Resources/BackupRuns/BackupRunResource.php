<?php

namespace App\Filament\Resources\BackupRuns;

use App\Filament\Resources\BackupRuns\Pages\ManageBackupRuns;
use App\Models\BackupRun;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Artisan;

class BackupRunResource extends Resource
{
    protected static ?string $model = BackupRun::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCircleStack;

    protected static ?string $navigationLabel = 'Backups';

    public static function canAccess(): bool
    {
        return auth()->user()?->isSagaDevAdmin() ?? false;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('Run'),
                TextColumn::make('status')->badge()->color(fn (string $state) => $state === 'completed' ? 'success' : ($state === 'failed' ? 'danger' : 'warning')),
                TextColumn::make('connection')->badge(),
                TextColumn::make('storage_disk')->label('Disk'),
                TextColumn::make('completed_at')->dateTime('d M Y H:i')->placeholder('Running'),
                TextColumn::make('verified_at')->dateTime('d M Y H:i')->placeholder('Not verified'),
                TextColumn::make('error')->limit(60)->placeholder('-'),
            ])
            ->recordActions([
                Action::make('verify')->icon(Heroicon::OutlinedShieldCheck)
                    ->visible(fn (BackupRun $record) => $record->status === 'completed')
                    ->action(function (BackupRun $record): void {
                        $exit = Artisan::call('sagamenu:restore-verify', ['backup' => $record->id]);
                        Notification::make()
                            ->title($exit === 0 ? 'Backup verified' : 'Backup verification failed')
                            ->color($exit === 0 ? 'success' : 'danger')
                            ->send();
                    }),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return ['index' => ManageBackupRuns::route('/')];
    }
}
