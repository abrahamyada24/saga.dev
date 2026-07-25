<?php

namespace App\Filament\Resources\BackupRuns\Pages;

use App\Filament\Resources\BackupRuns\BackupRunResource;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ManageRecords;
use Illuminate\Support\Facades\Artisan;

class ManageBackupRuns extends ManageRecords
{
    protected static string $resource = BackupRunResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('backup')->label('Run backup')->requiresConfirmation()->action(function (): void {
                $exit = Artisan::call('sagamenu:backup');
                Notification::make()
                    ->title($exit === 0 ? 'Backup completed' : 'Backup failed')
                    ->color($exit === 0 ? 'success' : 'danger')
                    ->send();
            }),
        ];
    }
}
