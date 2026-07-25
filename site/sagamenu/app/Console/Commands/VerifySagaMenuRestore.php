<?php

namespace App\Console\Commands;

use App\Models\BackupRun;
use Illuminate\Console\Command;
use PDO;
use Symfony\Component\Process\Process;
use ZipArchive;

class VerifySagaMenuRestore extends Command
{
    protected $signature = 'sagamenu:restore-verify {backup? : Backup run ID, defaults to latest completed run}';

    protected $description = 'Verify database restore readability, media archive, and backup checksums.';

    public function handle(): int
    {
        $run = BackupRun::query()
            ->where('status', 'completed')
            ->when($this->argument('backup'), fn ($query, $id) => $query->whereKey($id))
            ->latest('completed_at')
            ->firstOrFail();

        $checksums = json_decode(file_get_contents($run->checksum_path), true, flags: JSON_THROW_ON_ERROR);
        foreach ([$run->database_path, $run->media_path, $run->manifest_path] as $file) {
            if (! is_file($file) || ! hash_equals($checksums[basename($file)] ?? '', hash_file('sha256', $file))) {
                $this->error('Checksum verification failed for '.basename((string) $file));

                return self::FAILURE;
            }
        }

        if ($run->connection === 'sqlite') {
            $pdo = new PDO('sqlite:'.$run->database_path);
            if ($pdo->query('PRAGMA integrity_check')->fetchColumn() !== 'ok') {
                $this->error('SQLite integrity check failed.');

                return self::FAILURE;
            }
            $required = ['organizations', 'organization_user', 'catalogs', 'catalog_snapshots'];
            foreach ($required as $table) {
                $statement = $pdo->prepare("SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = :table");
                $statement->execute(['table' => $table]);
                if ((int) $statement->fetchColumn() !== 1) {
                    $this->error("Restored database is missing {$table}.");

                    return self::FAILURE;
                }
            }
        } elseif ($run->connection === 'pgsql') {
            (new Process(['pg_restore', '--list', $run->database_path]))->setTimeout(120)->mustRun();
        }

        $zip = new ZipArchive;
        if ($zip->open($run->media_path) !== true) {
            $this->error('Media archive verification failed.');

            return self::FAILURE;
        }
        $manifest = json_decode(file_get_contents($run->manifest_path), true, flags: JSON_THROW_ON_ERROR);
        foreach ($manifest as $entry) {
            $contents = $zip->getFromName($entry['path']);
            if ($contents === false || ! hash_equals($entry['checksum'], hash('sha256', $contents))) {
                $zip->close();
                $this->error('Media archive entry failed verification: '.$entry['path']);

                return self::FAILURE;
            }
        }
        $zip->close();

        $run->update(['verified_at' => now()]);
        $this->info("Backup #{$run->id} verified successfully.");

        return self::SUCCESS;
    }
}
