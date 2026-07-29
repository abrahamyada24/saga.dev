<?php

namespace Tests\Feature;

use App\Services\Release\StagingBootstrapContract;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class StagingBootstrapContractTest extends TestCase
{
    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_complete_target_evidence_passes_without_exposing_probe_secrets(): void
    {
        Carbon::setTestNow('2026-07-29T22:00:00+07:00');

        $manifest = $this->validManifest();
        $probe = $this->validProbe($manifest);
        $probe['database']['password'] = 'database-secret-value';
        $probe['monitoring']['webhookUrl'] = 'https://monitor.invalid/secret-token';

        $result = $this->evaluate($manifest, $probe);

        $this->assertSame('passed', $result['status']);
        $this->assertSame(0, $result['summary']['failed']);
        $this->assertGreaterThan(40, $result['summary']['passed']);

        $encoded = json_encode($result, JSON_THROW_ON_ERROR);
        $this->assertStringNotContainsString('database-secret-value', $encoded);
        $this->assertStringNotContainsString('secret-token', $encoded);
    }

    public function test_missing_runtime_and_provider_capabilities_fail_closed(): void
    {
        Carbon::setTestNow('2026-07-29T22:00:00+07:00');

        $manifest = $this->validManifest();
        $probe = $this->validProbe($manifest);
        $probe['php']['extensions'] = ['ctype'];
        $probe['binaries']['ffmpeg'] = false;
        $probe['database']['connected'] = false;
        $probe['redis']['queuePing'] = false;
        $probe['storage']['application']['writeReadDelete'] = false;
        $probe['queue']['roundTrip'] = false;
        $probe['https']['tlsValid'] = false;
        $probe['backupRestore']['disposableRestore'] = false;

        $result = $this->evaluate($manifest, $probe);
        $failed = collect($result['checks'])->where('status', 'failed')->pluck('id');

        $this->assertSame('failed', $result['status']);
        $this->assertContains('runtime.php_extensions', $failed);
        $this->assertContains('runtime.binaries', $failed);
        $this->assertContains('database.connectivity', $failed);
        $this->assertContains('redis.queue', $failed);
        $this->assertContains('storage.application_round_trip', $failed);
        $this->assertContains('queue.round_trip', $failed);
        $this->assertContains('https.tls', $failed);
        $this->assertContains('restore.disposable', $failed);
    }

    public function test_stale_or_unbound_probe_and_source_mismatch_fail_closed(): void
    {
        Carbon::setTestNow('2026-07-29T22:00:00+07:00');

        $manifest = $this->validManifest();
        $probe = $this->validProbe($manifest);
        $probe['generatedAt'] = '2026-07-29T20:00:00+07:00';
        $probe['releaseManifestSha256'] = str_repeat('f', 64);
        $probe['source']['commit'] = str_repeat('b', 40);

        $result = $this->evaluate($manifest, $probe);
        $failed = collect($result['checks'])->where('status', 'failed')->pluck('id');

        $this->assertSame('failed', $result['status']);
        $this->assertContains('probe.fresh', $failed);
        $this->assertContains('probe.manifest_digest', $failed);
        $this->assertContains('probe.source_commit', $failed);
    }

    public function test_sandbox_and_rollback_require_live_non_secret_evidence(): void
    {
        Carbon::setTestNow('2026-07-29T22:00:00+07:00');

        $manifest = $this->validManifest();
        $probe = $this->validProbe($manifest);
        $probe['sagaPlatform'] = [
            'mode' => 'sandbox',
            'nonProductionEndpoint' => true,
            'signedRoundTrip' => false,
            'evidenceRef' => 'evidence/saga-platform-sandbox.json',
        ];
        $probe['runtime']['sagaPlatformEnabled'] = true;
        $probe['rollback']['rehearsalCompleted'] = false;
        $probe['rollback']['evidenceRef'] = 'https://provider.invalid/private-token';

        $result = $this->evaluate($manifest, $probe);
        $failed = collect($result['checks'])->where('status', 'failed')->pluck('id');

        $this->assertSame('failed', $result['status']);
        $this->assertContains('saga_platform.mode', $failed);
        $this->assertContains('rollback.rehearsal', $failed);
        $this->assertContains('rollback.evidence', $failed);
    }

    public function test_example_files_are_rejected_by_the_artisan_command(): void
    {
        $this->artisan('sagamenu:staging-bootstrap-preflight', [
            '--manifest' => 'release/sagamenu-staging-manifest.example.json',
            '--probe' => 'release/sagamenu-staging-probe.example.json',
            '--json' => true,
        ])
            ->expectsOutputToContain('"status": "failed"')
            ->assertFailed();
    }

    public function test_malformed_probe_is_rejected_without_echoing_its_contents(): void
    {
        $path = storage_path('framework/testing/staging-bootstrap-invalid.json');
        file_put_contents($path, '{"token":"do-not-echo"');

        try {
            $exitCode = Artisan::call('sagamenu:staging-bootstrap-preflight', [
                '--manifest' => 'release/sagamenu-staging-manifest.example.json',
                '--probe' => $path,
                '--json' => true,
            ]);
            $output = Artisan::output();

            $this->assertSame(1, $exitCode);
            $this->assertStringContainsString('"status": "failed"', $output);
            $this->assertStringNotContainsString('do-not-echo', $output);
        } finally {
            @unlink($path);
        }
    }

    public function test_deploy_flow_blocks_before_migration_and_wrapper_checks_host_tools(): void
    {
        $deploy = (string) file_get_contents(base_path('deploy/scripts/deploy.sh'));
        $wrapper = (string) file_get_contents(base_path('deploy/scripts/staging-bootstrap-preflight.sh'));

        $basePreflight = strpos($deploy, 'php artisan sagamenu:release-preflight');
        $bootstrapPreflight = strpos($deploy, 'php artisan sagamenu:staging-bootstrap-preflight');
        $migration = strpos($deploy, 'php artisan migrate --force');
        $switch = strpos($deploy, 'ln -sfn "$app" "$SAGAMENU_ROOT/current.next"');

        $this->assertStringContainsString('SAGAMENU_STAGING_PROBE', $deploy);
        $this->assertIsInt($basePreflight);
        $this->assertIsInt($bootstrapPreflight);
        $this->assertIsInt($migration);
        $this->assertIsInt($switch);
        $this->assertLessThan($bootstrapPreflight, $basePreflight);
        $this->assertLessThan($migration, $bootstrapPreflight);
        $this->assertLessThan($switch, $migration);

        $this->assertStringContainsString('git status --porcelain --untracked-files=all', $wrapper);
        $this->assertStringContainsString('pg_dump pg_restore ffmpeg clamscan', $wrapper);
        $this->assertStringContainsString('extension_loaded($extension)', $wrapper);
        $this->assertStringContainsString('PHP 8.3 or newer is required', $wrapper);
    }

    private function evaluate(array $manifest, array $probe): array
    {
        return app(StagingBootstrapContract::class)->evaluate(
            $manifest,
            $probe,
            hash('sha256', json_encode($manifest, JSON_THROW_ON_ERROR)),
            [
                'commit' => str_repeat('a', 40),
                'branch' => 'codex/sagamenu-wave2-sprint22',
                'clean' => true,
                'mode' => 'test',
            ],
            [
                'status' => 'passed',
                'summary' => ['passed' => 44, 'failed' => 0, 'total' => 44],
            ],
            30,
        );
    }

    private function validManifest(): array
    {
        return [
            'schemaVersion' => 1,
            'productCode' => 'sagamenu',
            'releaseId' => '20260729-aaaaaaaa',
            'source' => [
                'commit' => str_repeat('a', 40),
                'branch' => 'codex/sagamenu-wave2-sprint22',
                'clean' => true,
            ],
            'target' => [
                'environment' => 'staging',
                'url' => 'https://staging-menu.sagagroup.test',
            ],
        ];
    }

    private function validProbe(array $manifest): array
    {
        $evidence = fn (string $name): string => "evidence/{$name}.json";

        return [
            'schemaVersion' => 1,
            'productCode' => 'sagamenu',
            'releaseId' => $manifest['releaseId'],
            'generatedAt' => now()->toIso8601String(),
            'releaseManifestSha256' => hash('sha256', json_encode($manifest, JSON_THROW_ON_ERROR)),
            'source' => [
                'commit' => str_repeat('a', 40),
                'clean' => true,
            ],
            'target' => [
                'environment' => 'staging',
                'url' => $manifest['target']['url'],
            ],
            'php' => [
                'version' => '8.4.0',
                'extensions' => [
                    'ctype', 'curl', 'dom', 'fileinfo', 'filter', 'hash', 'mbstring',
                    'openssl', 'pcre', 'pdo', 'pdo_pgsql', 'redis', 'session',
                    'tokenizer', 'xml', 'zip',
                ],
            ],
            'binaries' => [
                'composer' => true,
                'git' => true,
                'node' => true,
                'npm' => true,
                'pg_dump' => true,
                'pg_restore' => true,
                'ffmpeg' => true,
                'clamscan' => true,
            ],
            'runtime' => [
                'appDebug' => false,
                'appKeyConfigured' => true,
                'cacheStore' => 'redis',
                'sessionDriver' => 'database',
                'sessionEncrypt' => true,
                'sessionSecure' => true,
                'malwareEnabled' => true,
                'malwareRequired' => true,
                'videoProcessingRequired' => true,
                'sagaPlatformEnabled' => false,
                'buildManifestExists' => true,
            ],
            'database' => [
                'driver' => 'pgsql',
                'connected' => true,
                'migrationsCurrent' => true,
            ],
            'redis' => [
                'cachePing' => true,
                'queuePing' => true,
            ],
            'storage' => [
                'application' => [
                    'driver' => 's3',
                    'writeReadDelete' => true,
                ],
                'backup' => [
                    'configured' => true,
                    'driver' => 's3',
                    'writeReadDelete' => true,
                ],
            ],
            'queue' => [
                'connection' => 'redis',
                'roundTrip' => true,
                'failedJobsClear' => true,
                'workerEvidenceRef' => $evidence('queue-worker'),
            ],
            'scheduler' => [
                'heartbeatFresh' => true,
                'scheduleRegistered' => true,
            ],
            'mail' => [
                'transport' => 'smtp',
                'providerHandshake' => true,
                'evidenceRef' => $evidence('mail'),
            ],
            'monitoring' => [
                'configured' => true,
                'testAlertAcknowledged' => true,
                'evidenceRef' => $evidence('monitoring'),
            ],
            'videoWorker' => [
                'roundTrip' => true,
                'ffmpeg' => true,
                'malwareScan' => true,
                'evidenceRef' => $evidence('video-worker'),
            ],
            'https' => [
                'reachable' => true,
                'tlsValid' => true,
                'status' => 200,
            ],
            'backupRestore' => [
                'offsiteBackupVerified' => true,
                'checksumVerified' => true,
                'disposableRestore' => true,
                'schemaVerified' => true,
                'cleanupConfirmed' => true,
                'completedAt' => now()->subHour()->toIso8601String(),
                'evidenceRef' => $evidence('backup-restore'),
            ],
            'sagaPlatform' => [
                'mode' => 'disabled',
                'nonProductionEndpoint' => false,
                'signedRoundTrip' => false,
                'evidenceRef' => '',
            ],
            'rollback' => [
                'previousReleaseCommit' => str_repeat('b', 40),
                'previousReleasePath' => '/var/www/sagamenu/releases/20260728/app',
                'databaseCompatibility' => true,
                'rehearsalCompleted' => true,
                'healthPassed' => true,
                'evidenceRef' => $evidence('rollback'),
            ],
        ];
    }
}
