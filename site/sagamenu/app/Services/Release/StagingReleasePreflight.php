<?php

namespace App\Services\Release;

final class StagingReleasePreflight
{
    private const REQUIRED_PROVIDERS = [
        'database',
        'objectStorage',
        'queue',
        'scheduler',
        'mail',
        'monitoring',
        'backup',
    ];

    private const REQUIRED_ACCEPTANCE = [
        'automatedTests',
        'artifactBuild',
        'securityReview',
        'ownerReview',
        'humanUat',
        'backupRestore',
        'rollbackRehearsal',
    ];

    public function evaluate(array $manifest, array $runtime, array $source): array
    {
        $checks = [];
        $add = static function (string $id, bool $passed, string $detail) use (&$checks): void {
            $checks[] = [
                'id' => $id,
                'status' => $passed ? 'passed' : 'failed',
                'detail' => $detail,
            ];
        };

        $add('manifest.schema', data_get($manifest, 'schemaVersion') === 1, 'Schema version must be 1.');
        $add('manifest.product', data_get($manifest, 'productCode') === 'sagamenu', 'Product code must be sagamenu.');
        $add(
            'manifest.release_id',
            $this->isConcreteIdentifier(data_get($manifest, 'releaseId')),
            'Release ID must be concrete and immutable.',
        );

        $expectedCommit = data_get($manifest, 'source.commit');
        $actualCommit = $source['commit'] ?? null;
        $add(
            'source.commit_format',
            is_string($expectedCommit) && preg_match('/^[0-9a-f]{40}$/', $expectedCommit) === 1,
            'Manifest source commit must be a full lowercase Git SHA.',
        );
        $add(
            'source.commit_match',
            is_string($expectedCommit) && hash_equals($expectedCommit, (string) $actualCommit),
            'Checked-out source must match the manifest commit.',
        );
        $add(
            'source.clean',
            data_get($manifest, 'source.clean') === true && ($source['clean'] ?? false) === true,
            'Manifest and checked-out source must both be clean.',
        );
        $add(
            'source.branch',
            $this->isConcreteIdentifier(data_get($manifest, 'source.branch')),
            'Source branch provenance must be recorded.',
        );

        $targetUrl = data_get($manifest, 'target.url');
        $add(
            'target.environment',
            data_get($manifest, 'target.environment') === 'staging',
            'This preflight only accepts a staging target.',
        );
        $add(
            'target.https',
            is_string($targetUrl)
                && filter_var($targetUrl, FILTER_VALIDATE_URL)
                && str_starts_with($targetUrl, 'https://')
                && ! str_ends_with(parse_url($targetUrl, PHP_URL_HOST) ?: '', '.invalid'),
            'Staging URL must be a real HTTPS endpoint.',
        );

        foreach (self::REQUIRED_PROVIDERS as $provider) {
            $record = data_get($manifest, "providers.{$provider}", []);
            $add(
                "provider.{$provider}",
                $this->isVerifiedRecord($record),
                "{$provider} requires verified status and an evidence reference.",
            );
        }

        foreach (self::REQUIRED_ACCEPTANCE as $gate) {
            $record = data_get($manifest, "acceptance.{$gate}", []);
            $add(
                "acceptance.{$gate}",
                $this->isVerifiedRecord($record),
                "{$gate} requires verified status and an evidence reference.",
            );
        }

        $centralEnabled = ($runtime['saga_platform_enabled'] ?? false) === true;
        $centralVerified = $this->isVerifiedRecord(data_get($manifest, 'acceptance.centralSandbox', []));
        $add(
            'acceptance.central_sandbox',
            ! $centralEnabled || $centralVerified,
            'Central integration must stay disabled until sandbox evidence is verified.',
        );

        $add(
            'rollback.previous_release',
            $this->isConcreteIdentifier(data_get($manifest, 'rollback.previousReleaseId')),
            'A previous immutable release must be named.',
        );
        $add(
            'rollback.strategy',
            in_array(data_get($manifest, 'rollback.strategy'), ['symlink', 'immutable_release'], true),
            'Rollback strategy must use an immutable release target.',
        );
        $add(
            'rollback.database_compatibility',
            data_get($manifest, 'rollback.databaseCompatibility') === 'verified',
            'Database compatibility must be verified before release.',
        );

        $add('runtime.environment', ($runtime['app_env'] ?? null) === 'staging', 'APP_ENV must be staging.');
        $add('runtime.debug', ($runtime['app_debug'] ?? true) === false, 'APP_DEBUG must be false.');
        $add(
            'runtime.url',
            is_string($runtime['app_url'] ?? null) && str_starts_with($runtime['app_url'], 'https://'),
            'APP_URL must use HTTPS.',
        );
        $add('runtime.app_key', ($runtime['app_key_configured'] ?? false) === true, 'APP_KEY must be configured.');
        $add('runtime.database', ($runtime['database_connection'] ?? null) === 'pgsql', 'Database must use PostgreSQL.');
        $add(
            'runtime.object_storage',
            ($runtime['filesystem_driver'] ?? null) === 's3',
            'Default filesystem must use an S3-compatible driver.',
        );
        $add('runtime.queue', ($runtime['queue_connection'] ?? null) === 'redis', 'Queue must use Redis.');
        $add('runtime.cache', ($runtime['cache_store'] ?? null) === 'redis', 'Cache must use Redis.');
        $add(
            'runtime.session',
            in_array($runtime['session_driver'] ?? null, ['database', 'redis'], true),
            'Sessions must use database or Redis.',
        );
        $add('runtime.session_encrypt', ($runtime['session_encrypt'] ?? false) === true, 'Session encryption must be enabled.');
        $add('runtime.session_secure', ($runtime['session_secure'] ?? false) === true, 'Secure cookies must be enabled.');
        $add(
            'runtime.mail',
            ! in_array($runtime['mail_transport'] ?? null, [null, 'array', 'log'], true),
            'Mail must use a real staging transport.',
        );
        $add(
            'runtime.backup',
            ($runtime['backup_disk_configured'] ?? false) === true
                && ($runtime['backup_disk_driver'] ?? null) === 's3',
            'Backup must use configured offsite S3-compatible storage.',
        );
        $add(
            'runtime.monitoring',
            ($runtime['monitoring_configured'] ?? false) === true,
            'Monitoring destination must be configured.',
        );
        $add(
            'runtime.malware_scan',
            ($runtime['malware_enabled'] ?? false) === true
                && ($runtime['malware_required'] ?? false) === true,
            'Malware scanning must be enabled and required.',
        );
        $add(
            'runtime.video_processing',
            ($runtime['video_processing_required'] ?? false) === true,
            'Authoritative video processing must be required.',
        );
        $add(
            'runtime.build_manifest',
            ($runtime['build_manifest_exists'] ?? false) === true,
            'Production frontend build manifest must exist.',
        );

        $failed = count(array_filter($checks, fn (array $check): bool => $check['status'] === 'failed'));

        return [
            'schemaVersion' => 1,
            'productCode' => 'sagamenu',
            'status' => $failed === 0 ? 'passed' : 'failed',
            'summary' => [
                'passed' => count($checks) - $failed,
                'failed' => $failed,
                'total' => count($checks),
            ],
            'sourceMode' => $source['mode'] ?? 'unknown',
            'checks' => $checks,
        ];
    }

    private function isVerifiedRecord(mixed $record): bool
    {
        return is_array($record)
            && ($record['status'] ?? null) === 'verified'
            && $this->isConcreteIdentifier($record['evidenceRef'] ?? null);
    }

    private function isConcreteIdentifier(mixed $value): bool
    {
        if (! is_string($value) || trim($value) === '') {
            return false;
        }

        $normalized = strtolower($value);

        return ! str_contains($normalized, 'placeholder')
            && ! str_contains($normalized, 'todo')
            && ! str_contains($normalized, 'example')
            && ! str_contains($normalized, 'unavailable')
            && ! str_contains($normalized, 'pending');
    }
}
