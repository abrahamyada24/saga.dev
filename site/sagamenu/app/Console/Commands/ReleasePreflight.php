<?php

namespace App\Console\Commands;

use App\Services\Release\StagingReleasePreflight;
use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Throwable;

class ReleasePreflight extends Command
{
    protected $signature = 'sagamenu:release-preflight
        {--manifest=release/sagamenu-staging-manifest.json : Release manifest path}
        {--json : Emit machine-readable JSON}';

    protected $description = 'Fail-closed staging release validation without exposing secrets.';

    public function handle(StagingReleasePreflight $preflight): int
    {
        $path = $this->absolutePath((string) $this->option('manifest'));

        if (! is_file($path)) {
            return $this->failCommand("Release manifest not found: {$path}");
        }

        try {
            $manifest = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            return $this->failCommand('Release manifest is not valid JSON.');
        }

        if (! is_array($manifest)) {
            return $this->failCommand('Release manifest must contain a JSON object.');
        }

        $result = $preflight->evaluate($manifest, $this->runtimeState(), $this->sourceState());

        if ($this->option('json')) {
            $this->line((string) json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } else {
            foreach ($result['checks'] as $check) {
                $marker = $check['status'] === 'passed' ? 'PASS' : 'FAIL';
                $this->line("[{$marker}] {$check['id']}: {$check['detail']}");
            }

            $this->newLine();
            $this->line(sprintf(
                'Release preflight %s: %d passed, %d failed.',
                strtoupper($result['status']),
                $result['summary']['passed'],
                $result['summary']['failed'],
            ));
        }

        return $result['status'] === 'passed' ? self::SUCCESS : self::FAILURE;
    }

    private function runtimeState(): array
    {
        $filesystem = (string) config('filesystems.default');
        $mail = (string) config('mail.default');
        $backupDisk = config('sagamenu.backup.disk');

        return [
            'app_env' => app()->environment(),
            'app_debug' => (bool) config('app.debug'),
            'app_url' => (string) config('app.url'),
            'app_key_configured' => filled(config('app.key')),
            'database_connection' => (string) config('database.default'),
            'filesystem_driver' => config("filesystems.disks.{$filesystem}.driver"),
            'queue_connection' => (string) config('queue.default'),
            'cache_store' => (string) config('cache.default'),
            'session_driver' => (string) config('session.driver'),
            'session_encrypt' => config('session.encrypt') === true,
            'session_secure' => config('session.secure') === true,
            'mail_transport' => config("mail.mailers.{$mail}.transport"),
            'backup_disk_configured' => filled($backupDisk),
            'backup_disk_driver' => filled($backupDisk)
                ? config("filesystems.disks.{$backupDisk}.driver")
                : null,
            'monitoring_configured' => filled(config('sagamenu.monitoring.webhook_url')),
            'malware_enabled' => config('sagamenu.malware.enabled') === true,
            'malware_required' => config('sagamenu.malware.required') === true,
            'video_processing_required' => config('sagamenu.media.video_processing_required') === true,
            'saga_platform_enabled' => config('sagamenu.saga_platform.enabled') === true,
            'build_manifest_exists' => is_file(public_path('build/manifest.json')),
        ];
    }

    private function sourceState(): array
    {
        $verifiedCommit = env('SAGAMENU_RELEASE_VERIFIED_COMMIT');
        $verifiedClean = filter_var(
            env('SAGAMENU_RELEASE_VERIFIED_CLEAN', false),
            FILTER_VALIDATE_BOOLEAN,
        );

        if (is_string($verifiedCommit) && preg_match('/^[0-9a-f]{40}$/', $verifiedCommit) === 1 && $verifiedClean) {
            return [
                'commit' => $verifiedCommit,
                'branch' => env('SAGAMENU_RELEASE_VERIFIED_BRANCH', 'detached'),
                'clean' => true,
                'mode' => 'deploy-script-verified',
            ];
        }

        try {
            $commit = $this->git(['rev-parse', 'HEAD']);
            $branch = $this->git(['branch', '--show-current']);
            $status = $this->git(['status', '--porcelain', '--untracked-files=all']);

            return [
                'commit' => $commit,
                'branch' => $branch !== '' ? $branch : 'detached',
                'clean' => $status === '',
                'mode' => 'git-worktree',
            ];
        } catch (Throwable) {
            return [
                'commit' => null,
                'branch' => null,
                'clean' => false,
                'mode' => 'unavailable',
            ];
        }
    }

    private function git(array $arguments): string
    {
        $process = new Process(['git', ...$arguments], base_path());
        $process->setTimeout(10);
        $process->mustRun();

        return trim($process->getOutput());
    }

    private function absolutePath(string $path): string
    {
        if (preg_match('/^(?:[A-Za-z]:[\\\\\/]|\/)/', $path) === 1) {
            return $path;
        }

        return base_path($path);
    }

    private function failCommand(string $message): int
    {
        if ($this->option('json')) {
            $this->line((string) json_encode([
                'schemaVersion' => 1,
                'productCode' => 'sagamenu',
                'status' => 'failed',
                'error' => $message,
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } else {
            $this->error($message);
        }

        return self::FAILURE;
    }
}
