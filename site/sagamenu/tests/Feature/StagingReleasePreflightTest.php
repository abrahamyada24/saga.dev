<?php

namespace Tests\Feature;

use App\Services\Release\StagingReleasePreflight;
use Tests\TestCase;

class StagingReleasePreflightTest extends TestCase
{
    public function test_verified_staging_contract_passes_without_exposing_provider_values(): void
    {
        $runtime = $this->validRuntime();
        $runtime['monitoring_url'] = 'secret-provider-token';
        $runtime['database_password'] = 'postgres-password';

        $result = app(StagingReleasePreflight::class)->evaluate(
            $this->validManifest(),
            $runtime,
            [
                'commit' => str_repeat('a', 40),
                'branch' => 'codex/sagamenu-release',
                'clean' => true,
                'mode' => 'test',
            ],
        );

        $this->assertSame('passed', $result['status']);
        $this->assertSame(0, $result['summary']['failed']);

        $encoded = json_encode($result, JSON_THROW_ON_ERROR);
        $this->assertStringNotContainsString('secret-provider-token', $encoded);
        $this->assertStringNotContainsString('postgres-password', $encoded);
    }

    public function test_placeholder_manifest_and_unsafe_runtime_fail_closed(): void
    {
        $manifest = json_decode(
            (string) file_get_contents(base_path('release/sagamenu-staging-manifest.example.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $runtime = $this->validRuntime();
        $runtime['app_debug'] = true;
        $runtime['filesystem_driver'] = 'local';
        $runtime['mail_transport'] = 'log';

        $result = app(StagingReleasePreflight::class)->evaluate(
            $manifest,
            $runtime,
            [
                'commit' => str_repeat('b', 40),
                'branch' => 'codex/sagamenu-wave2-sprint22',
                'clean' => false,
                'mode' => 'test',
            ],
        );

        $failed = collect($result['checks'])
            ->where('status', 'failed')
            ->pluck('id');

        $this->assertSame('failed', $result['status']);
        $this->assertContains('manifest.release_id', $failed);
        $this->assertContains('source.commit_format', $failed);
        $this->assertContains('source.clean', $failed);
        $this->assertContains('target.https', $failed);
        $this->assertContains('runtime.debug', $failed);
        $this->assertContains('runtime.object_storage', $failed);
        $this->assertContains('runtime.mail', $failed);
    }

    public function test_artisan_command_rejects_the_example_manifest(): void
    {
        $this->artisan('sagamenu:release-preflight', [
            '--manifest' => 'release/sagamenu-staging-manifest.example.json',
            '--json' => true,
        ])
            ->expectsOutputToContain('"status": "failed"')
            ->assertFailed();
    }

    public function test_deploy_script_requires_immutable_commit_and_preflight_before_migration(): void
    {
        $script = (string) file_get_contents(base_path('deploy/scripts/deploy.sh'));

        $this->assertStringContainsString(
            'SAGAMENU_COMMIT:?Set SAGAMENU_COMMIT to an immutable 40-character Git SHA',
            $script,
        );
        $this->assertStringNotContainsString('SAGAMENU_REF:=main', $script);
        $this->assertStringContainsString('checkout --detach "$SAGAMENU_COMMIT"', $script);
        $this->assertStringContainsString('Refusing deployment from a dirty checkout', $script);

        $preflightPosition = strpos($script, 'php artisan sagamenu:release-preflight');
        $migrationPosition = strpos($script, 'php artisan migrate --force');
        $switchPosition = strpos($script, 'ln -sfn "$app" "$SAGAMENU_ROOT/current.next"');

        $this->assertIsInt($preflightPosition);
        $this->assertIsInt($migrationPosition);
        $this->assertIsInt($switchPosition);
        $this->assertLessThan($migrationPosition, $preflightPosition);
        $this->assertLessThan($switchPosition, $preflightPosition);
    }

    private function validManifest(): array
    {
        $verified = fn (string $name): array => [
            'status' => 'verified',
            'evidenceRef' => "evidence/{$name}.json",
        ];

        return [
            'schemaVersion' => 1,
            'productCode' => 'sagamenu',
            'releaseId' => '20260729-aaaaaaaa',
            'source' => [
                'commit' => str_repeat('a', 40),
                'branch' => 'codex/sagamenu-release',
                'clean' => true,
            ],
            'target' => [
                'environment' => 'staging',
                'url' => 'https://staging-menu.sagagroup.test',
            ],
            'providers' => [
                'database' => $verified('database'),
                'objectStorage' => $verified('object-storage'),
                'queue' => $verified('queue'),
                'scheduler' => $verified('scheduler'),
                'mail' => $verified('mail'),
                'monitoring' => $verified('monitoring'),
                'backup' => $verified('backup'),
            ],
            'acceptance' => [
                'automatedTests' => $verified('automated-tests'),
                'artifactBuild' => $verified('artifact-build'),
                'securityReview' => $verified('security-review'),
                'ownerReview' => $verified('owner-review'),
                'humanUat' => $verified('human-uat'),
                'backupRestore' => $verified('backup-restore'),
                'rollbackRehearsal' => $verified('rollback-rehearsal'),
                'centralSandbox' => [
                    'status' => 'pending',
                    'evidenceRef' => '',
                ],
            ],
            'rollback' => [
                'previousReleaseId' => '20260728-previous',
                'strategy' => 'symlink',
                'databaseCompatibility' => 'verified',
            ],
        ];
    }

    private function validRuntime(): array
    {
        return [
            'app_env' => 'staging',
            'app_debug' => false,
            'app_url' => 'https://staging-menu.sagagroup.test',
            'app_key_configured' => true,
            'database_connection' => 'pgsql',
            'filesystem_driver' => 's3',
            'queue_connection' => 'redis',
            'cache_store' => 'redis',
            'session_driver' => 'database',
            'session_encrypt' => true,
            'session_secure' => true,
            'mail_transport' => 'smtp',
            'backup_disk_configured' => true,
            'backup_disk_driver' => 's3',
            'monitoring_configured' => true,
            'malware_enabled' => true,
            'malware_required' => true,
            'video_processing_required' => true,
            'saga_platform_enabled' => false,
            'build_manifest_exists' => true,
        ];
    }
}
