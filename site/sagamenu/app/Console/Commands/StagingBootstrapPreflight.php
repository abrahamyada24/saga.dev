<?php

namespace App\Console\Commands;

use App\Services\Release\StagingBootstrapContract;
use App\Services\Release\StagingReleasePreflight;
use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Throwable;

class StagingBootstrapPreflight extends Command
{
    protected $signature = 'sagamenu:staging-bootstrap-preflight
        {--manifest=release/sagamenu-staging-manifest.json : Release manifest path}
        {--probe=release/sagamenu-staging-probe.json : Target-generated probe path}
        {--json : Emit machine-readable JSON}';

    protected $description = 'Fail closed unless the VPS staging bootstrap evidence matches the exact release.';

    public function handle(
        StagingReleasePreflight $releasePreflight,
        StagingBootstrapContract $bootstrap,
    ): int {
        try {
            $manifestPath = $this->absolutePath((string) $this->option('manifest'));
            $probePath = $this->absolutePath((string) $this->option('probe'));
            $manifest = $this->readJson($manifestPath, 'Release manifest');
            $probe = $this->readJson($probePath, 'Staging probe');
            $source = $this->sourceState();
            $releaseResult = $releasePreflight->evaluate(
                $manifest,
                $this->runtimeFromProbe($probe),
                $source,
            );
            $result = $bootstrap->evaluate(
                $manifest,
                $probe,
                hash_file('sha256', $manifestPath),
                $source,
                $releaseResult,
                (int) config('sagamenu.release.staging_probe_max_age_minutes', 30),
            );
        } catch (Throwable $exception) {
            return $this->failCommand($exception->getMessage());
        }

        if ($this->option('json')) {
            $this->line((string) json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } else {
            foreach ($result['checks'] as $check) {
                $marker = $check['status'] === 'passed' ? 'PASS' : 'FAIL';
                $this->line("[{$marker}] {$check['id']}: {$check['detail']}");
            }

            $this->newLine();
            $this->line(sprintf(
                'Staging bootstrap preflight %s: %d passed, %d failed.',
                strtoupper($result['status']),
                $result['summary']['passed'],
                $result['summary']['failed'],
            ));
        }

        return $result['status'] === 'passed' ? self::SUCCESS : self::FAILURE;
    }

    /**
     * @return array<string, mixed>
     */
    private function readJson(string $path, string $label): array
    {
        if (! is_file($path)) {
            throw new \RuntimeException("{$label} not found.");
        }

        $decoded = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        if (! is_array($decoded)) {
            throw new \RuntimeException("{$label} must contain a JSON object.");
        }

        return $decoded;
    }

    /**
     * @return array<string, mixed>
     */
    private function runtimeFromProbe(array $probe): array
    {
        return [
            'app_env' => data_get($probe, 'target.environment'),
            'app_debug' => data_get($probe, 'runtime.appDebug'),
            'app_url' => data_get($probe, 'target.url'),
            'app_key_configured' => data_get($probe, 'runtime.appKeyConfigured'),
            'database_connection' => data_get($probe, 'database.driver'),
            'filesystem_driver' => data_get($probe, 'storage.application.driver'),
            'queue_connection' => data_get($probe, 'queue.connection'),
            'cache_store' => data_get($probe, 'runtime.cacheStore'),
            'session_driver' => data_get($probe, 'runtime.sessionDriver'),
            'session_encrypt' => data_get($probe, 'runtime.sessionEncrypt'),
            'session_secure' => data_get($probe, 'runtime.sessionSecure'),
            'mail_transport' => data_get($probe, 'mail.transport'),
            'backup_disk_configured' => data_get($probe, 'storage.backup.configured'),
            'backup_disk_driver' => data_get($probe, 'storage.backup.driver'),
            'monitoring_configured' => data_get($probe, 'monitoring.configured'),
            'malware_enabled' => data_get($probe, 'runtime.malwareEnabled'),
            'malware_required' => data_get($probe, 'runtime.malwareRequired'),
            'video_processing_required' => data_get($probe, 'runtime.videoProcessingRequired'),
            'saga_platform_enabled' => data_get($probe, 'runtime.sagaPlatformEnabled'),
            'build_manifest_exists' => data_get($probe, 'runtime.buildManifestExists'),
        ];
    }

    /**
     * @return array{commit: ?string, branch: ?string, clean: bool, mode: string}
     */
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

        $commit = $this->git(['rev-parse', 'HEAD']);
        $branch = $this->git(['branch', '--show-current']);
        $status = $this->git(['status', '--porcelain', '--untracked-files=all']);

        return [
            'commit' => $commit,
            'branch' => $branch !== '' ? $branch : 'detached',
            'clean' => $status === '',
            'mode' => 'git-worktree',
        ];
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
        $result = [
            'schemaVersion' => 1,
            'productCode' => 'sagamenu',
            'status' => 'failed',
            'error' => $message,
        ];

        if ($this->option('json')) {
            $this->line((string) json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } else {
            $this->error($message);
        }

        return self::FAILURE;
    }
}
