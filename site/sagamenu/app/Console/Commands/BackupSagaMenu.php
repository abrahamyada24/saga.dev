<?php

namespace App\Console\Commands;

use App\Models\BackupRun;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Throwable;
use ZipArchive;

class BackupSagaMenu extends Command
{
    protected $signature = 'sagamenu:backup
        {--prune=14 : Number of days to keep local backups}
        {--disk= : Optional configured offsite filesystem disk}';

    protected $description = 'Create a database backup, media archive, manifest, checksums, and optional offsite copy.';

    public function handle(): int
    {
        $connection = config('database.default');
        $timestamp = now()->format('Ymd-His');
        $backupDirectory = storage_path('app/backups');
        $remoteDisk = $this->option('disk') ?: config('sagamenu.backup.disk');
        $run = BackupRun::query()->create([
            'status' => 'running',
            'connection' => $connection,
            'storage_disk' => $remoteDisk ?: 'local',
        ]);

        try {
            if (! is_dir($backupDirectory)) {
                mkdir($backupDirectory, 0750, true);
            }

            $databasePath = $this->backupDatabase($connection, $backupDirectory, $timestamp);
            $manifestPath = "{$backupDirectory}/media-manifest-{$timestamp}.json";
            $mediaPath = "{$backupDirectory}/media-{$timestamp}.zip";
            $checksumPath = "{$backupDirectory}/checksums-{$timestamp}.json";

            $this->createMediaBackup($manifestPath, $mediaPath);
            $files = [$databasePath, $manifestPath, $mediaPath];
            file_put_contents($checksumPath, json_encode(collect($files)->mapWithKeys(
                fn (string $file) => [basename($file) => hash_file('sha256', $file)],
            )->all(), JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
            $files[] = $checksumPath;

            if ($remoteDisk && $remoteDisk !== 'local') {
                $this->copyOffsite($remoteDisk, $timestamp, $files);
            }

            $run->update([
                'status' => 'completed',
                'database_path' => $databasePath,
                'media_path' => $mediaPath,
                'manifest_path' => $manifestPath,
                'checksum_path' => $checksumPath,
                'completed_at' => now(),
            ]);

            $this->prune($backupDirectory);
            $this->info("Backup #{$run->id} created in {$backupDirectory}");

            return self::SUCCESS;
        } catch (Throwable $exception) {
            report($exception);
            $run->update(['status' => 'failed', 'error' => $exception->getMessage(), 'completed_at' => now()]);
            $this->error('Backup failed: '.$exception->getMessage());

            return self::FAILURE;
        }
    }

    private function backupDatabase(string $connection, string $backupDirectory, string $timestamp): string
    {
        if ($connection === 'sqlite') {
            $source = DB::connection()->getDatabaseName();
            DB::disconnect();
            $target = "{$backupDirectory}/database-{$timestamp}.sqlite";

            if (! copy($source, $target)) {
                throw new \RuntimeException('SQLite backup copy failed.');
            }

            return $target;
        }

        if ($connection === 'pgsql') {
            $config = config('database.connections.pgsql');
            $target = "{$backupDirectory}/database-{$timestamp}.dump";
            $process = new Process([
                'pg_dump',
                '--host='.$config['host'],
                '--port='.$config['port'],
                '--username='.$config['username'],
                '--format=custom',
                '--file='.$target,
                $config['database'],
            ], env: ['PGPASSWORD' => (string) $config['password']]);
            $process->setTimeout(600)->mustRun();

            return $target;
        }

        throw new \RuntimeException("Unsupported database connection: {$connection}");
    }

    private function createMediaBackup(string $manifestPath, string $mediaPath): void
    {
        $files = Storage::disk('public')->allFiles();
        $manifest = collect($files)->map(fn (string $path) => [
            'path' => $path,
            'size' => Storage::disk('public')->size($path),
            'checksum' => hash('sha256', Storage::disk('public')->get($path)),
        ])->all();
        file_put_contents($manifestPath, json_encode($manifest, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));

        $zip = new ZipArchive;
        if ($zip->open($mediaPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException('Unable to create media archive.');
        }

        foreach ($files as $path) {
            $zip->addFromString($path, Storage::disk('public')->get($path));
        }
        $zip->close();
    }

    private function copyOffsite(string $disk, string $timestamp, array $files): void
    {
        foreach ($files as $file) {
            $stream = fopen($file, 'rb');
            $stored = $stream && Storage::disk($disk)->put("sagamenu-backups/{$timestamp}/".basename($file), $stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
            if (! $stored) {
                throw new \RuntimeException("Offsite copy failed for {$file}.");
            }
        }
    }

    private function prune(string $backupDirectory): void
    {
        $cutoff = now()->subDays(max(1, (int) $this->option('prune')))->getTimestamp();
        foreach (glob("{$backupDirectory}/*") ?: [] as $file) {
            if (is_file($file) && filemtime($file) < $cutoff) {
                unlink($file);
            }
        }
    }
}
