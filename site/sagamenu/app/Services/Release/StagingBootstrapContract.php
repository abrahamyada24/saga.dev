<?php

namespace App\Services\Release;

use Illuminate\Support\Carbon;

final class StagingBootstrapContract
{
    private const REQUIRED_EXTENSIONS = [
        'ctype', 'curl', 'dom', 'fileinfo', 'filter', 'hash', 'mbstring',
        'openssl', 'pcre', 'pdo', 'pdo_pgsql', 'redis', 'session',
        'tokenizer', 'xml', 'zip',
    ];

    private const REQUIRED_BINARIES = [
        'composer', 'git', 'node', 'npm', 'pg_dump', 'pg_restore', 'ffmpeg', 'clamscan',
    ];

    public function evaluate(
        array $manifest,
        array $probe,
        string $manifestDigest,
        array $actualSource,
        array $releaseResult,
        int $maxAgeMinutes,
    ): array {
        $checks = [];
        $add = static function (string $id, bool $passed, string $detail) use (&$checks): void {
            $checks[] = [
                'id' => $id,
                'status' => $passed ? 'passed' : 'failed',
                'detail' => $detail,
            ];
        };

        $add('release.preflight', ($releaseResult['status'] ?? null) === 'passed', 'The base release preflight must pass.');
        $add('probe.schema', data_get($probe, 'schemaVersion') === 1, 'Probe schema version must be 1.');
        $add('probe.product', data_get($probe, 'productCode') === 'sagamenu', 'Probe product code must be sagamenu.');
        $add(
            'probe.release_id',
            $this->concrete(data_get($probe, 'releaseId'))
                && data_get($probe, 'releaseId') === data_get($manifest, 'releaseId'),
            'Probe and manifest must use the same concrete release ID.',
        );
        $add(
            'probe.fresh',
            $this->fresh(data_get($probe, 'generatedAt'), $maxAgeMinutes),
            'Probe must be recent and must not be future-dated.',
        );
        $add(
            'probe.manifest_digest',
            $this->sha256(data_get($probe, 'releaseManifestSha256'))
                && hash_equals($manifestDigest, (string) data_get($probe, 'releaseManifestSha256')),
            'Probe must bind to the exact release manifest SHA-256.',
        );
        $add(
            'probe.source_commit',
            $this->sha(data_get($probe, 'source.commit'))
                && data_get($probe, 'source.commit') === data_get($manifest, 'source.commit')
                && data_get($probe, 'source.commit') === ($actualSource['commit'] ?? null),
            'Probe, manifest, and checked-out source commits must match.',
        );
        $add(
            'probe.source_clean',
            data_get($probe, 'source.clean') === true && ($actualSource['clean'] ?? false) === true,
            'Probe and checked-out source must both be clean.',
        );
        $add(
            'probe.target',
            data_get($probe, 'target.environment') === 'staging'
                && data_get($probe, 'target.url') === data_get($manifest, 'target.url'),
            'Probe must target the same staging URL as the manifest.',
        );

        $extensions = array_map('strtolower', (array) data_get($probe, 'php.extensions', []));
        $add(
            'runtime.php_version',
            is_string(data_get($probe, 'php.version'))
                && version_compare(data_get($probe, 'php.version'), '8.3.0', '>='),
            'PHP must be version 8.3 or newer.',
        );
        $add(
            'runtime.php_extensions',
            array_diff(self::REQUIRED_EXTENSIONS, $extensions) === [],
            'All Laravel, PostgreSQL, Redis, and archive extensions must be loaded.',
        );

        $binaries = data_get($probe, 'binaries', []);
        $add(
            'runtime.binaries',
            collect(self::REQUIRED_BINARIES)->every(fn (string $binary): bool => data_get($binaries, $binary) === true),
            'Composer, Git, Node, npm, PostgreSQL tools, ffmpeg, and ClamAV must be executable.',
        );

        $add('database.driver', data_get($probe, 'database.driver') === 'pgsql', 'Database probe must use PostgreSQL.');
        $add('database.connectivity', data_get($probe, 'database.connected') === true, 'PostgreSQL query probe must pass.');
        $add('database.migrations', data_get($probe, 'database.migrationsCurrent') === true, 'Database migrations must match the release.');

        $add('redis.cache', data_get($probe, 'redis.cachePing') === true, 'Redis cache PING and read/write probe must pass.');
        $add('redis.queue', data_get($probe, 'redis.queuePing') === true, 'Redis queue connection probe must pass.');

        $add(
            'storage.application_driver',
            data_get($probe, 'storage.application.driver') === 's3',
            'Application storage must use an S3-compatible driver.',
        );
        $add(
            'storage.application_round_trip',
            data_get($probe, 'storage.application.writeReadDelete') === true,
            'Application storage write/read/delete probe must pass.',
        );
        $add(
            'storage.backup_driver',
            data_get($probe, 'storage.backup.driver') === 's3',
            'Backup storage must use a separate S3-compatible disk.',
        );
        $add(
            'storage.backup_round_trip',
            data_get($probe, 'storage.backup.writeReadDelete') === true,
            'Backup storage write/read/delete probe must pass.',
        );

        $add('queue.connection', data_get($probe, 'queue.connection') === 'redis', 'Queue connection must be Redis.');
        $add('queue.round_trip', data_get($probe, 'queue.roundTrip') === true, 'A worker must consume the disposable queue probe.');
        $add('queue.failed_jobs', data_get($probe, 'queue.failedJobsClear') === true, 'No unresolved failed jobs may remain.');
        $add('queue.worker_evidence', $this->evidence(data_get($probe, 'queue.workerEvidenceRef')), 'Queue worker evidence is required.');

        $add('scheduler.heartbeat', data_get($probe, 'scheduler.heartbeatFresh') === true, 'Scheduler heartbeat must be fresh.');
        $add('scheduler.registration', data_get($probe, 'scheduler.scheduleRegistered') === true, 'The SagaMenu schedule must be registered.');

        $add(
            'mail.transport',
            is_string(data_get($probe, 'mail.transport'))
                && ! in_array(data_get($probe, 'mail.transport'), ['', 'array', 'log'], true),
            'Mail must use a real staging transport.',
        );
        $add('mail.handshake', data_get($probe, 'mail.providerHandshake') === true, 'Mail provider handshake must pass.');
        $add('mail.evidence', $this->evidence(data_get($probe, 'mail.evidenceRef')), 'Mail probe evidence is required.');

        $add('monitoring.configured', data_get($probe, 'monitoring.configured') === true, 'Monitoring must be configured.');
        $add(
            'monitoring.alert',
            data_get($probe, 'monitoring.testAlertAcknowledged') === true,
            'A harmless monitoring alert must be acknowledged.',
        );
        $add('monitoring.evidence', $this->evidence(data_get($probe, 'monitoring.evidenceRef')), 'Monitoring evidence is required.');

        $add('video.worker', data_get($probe, 'videoWorker.roundTrip') === true, 'The video worker round-trip must pass.');
        $add('video.ffmpeg', data_get($probe, 'videoWorker.ffmpeg') === true, 'The video worker must execute ffmpeg.');
        $add('video.malware', data_get($probe, 'videoWorker.malwareScan') === true, 'The video worker must execute malware scanning.');
        $add('video.evidence', $this->evidence(data_get($probe, 'videoWorker.evidenceRef')), 'Video worker evidence is required.');

        $targetUrl = data_get($probe, 'target.url');
        $add(
            'https.url',
            is_string($targetUrl) && str_starts_with($targetUrl, 'https://'),
            'Staging URL must use HTTPS.',
        );
        $add('https.reachable', data_get($probe, 'https.reachable') === true, 'The public health endpoint must be reachable.');
        $add('https.tls', data_get($probe, 'https.tlsValid') === true, 'TLS validation must pass.');
        $add('https.health', data_get($probe, 'https.status') === 200, 'The health endpoint must return HTTP 200.');

        $add(
            'restore.offsite_backup',
            data_get($probe, 'backupRestore.offsiteBackupVerified') === true,
            'A recent offsite backup must be verified.',
        );
        $add('restore.checksum', data_get($probe, 'backupRestore.checksumVerified') === true, 'Backup checksums must pass.');
        $add('restore.disposable', data_get($probe, 'backupRestore.disposableRestore') === true, 'A disposable PostgreSQL restore must complete.');
        $add('restore.schema', data_get($probe, 'backupRestore.schemaVerified') === true, 'Restored schema checks must pass.');
        $add('restore.cleanup', data_get($probe, 'backupRestore.cleanupConfirmed') === true, 'Disposable restore resources must be cleaned up.');
        $add(
            'restore.fresh',
            $this->fresh(data_get($probe, 'backupRestore.completedAt'), 24 * 60),
            'Restore rehearsal evidence must be less than 24 hours old.',
        );
        $add('restore.evidence', $this->evidence(data_get($probe, 'backupRestore.evidenceRef')), 'Restore evidence is required.');

        $sagaMode = data_get($probe, 'sagaPlatform.mode');
        $sagaPassed = $sagaMode === 'disabled'
            ? data_get($probe, 'runtime.sagaPlatformEnabled') === false
            : $sagaMode === 'sandbox'
                && data_get($probe, 'runtime.sagaPlatformEnabled') === true
                && data_get($probe, 'sagaPlatform.nonProductionEndpoint') === true
                && data_get($probe, 'sagaPlatform.signedRoundTrip') === true
                && $this->evidence(data_get($probe, 'sagaPlatform.evidenceRef'));
        $add(
            'saga_platform.mode',
            $sagaPassed,
            'Saga Platform must be disabled or verified against a signed non-production sandbox.',
        );

        $add(
            'rollback.previous_commit',
            $this->sha(data_get($probe, 'rollback.previousReleaseCommit'))
                && data_get($probe, 'rollback.previousReleaseCommit') !== data_get($probe, 'source.commit'),
            'Rollback must name a different previous immutable commit.',
        );
        $add(
            'rollback.previous_path',
            is_string(data_get($probe, 'rollback.previousReleasePath'))
                && str_starts_with(data_get($probe, 'rollback.previousReleasePath'), '/var/www/sagamenu/releases/'),
            'Rollback target must be inside the immutable release directory.',
        );
        $add(
            'rollback.database_compatibility',
            data_get($probe, 'rollback.databaseCompatibility') === true,
            'Database compatibility with the previous release must be verified.',
        );
        $add(
            'rollback.rehearsal',
            data_get($probe, 'rollback.rehearsalCompleted') === true,
            'Rollback rehearsal must complete.',
        );
        $add('rollback.health', data_get($probe, 'rollback.healthPassed') === true, 'Rollback target health checks must pass.');
        $add('rollback.evidence', $this->evidence(data_get($probe, 'rollback.evidenceRef')), 'Rollback evidence is required.');

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
            'releasePreflight' => [
                'status' => $releaseResult['status'] ?? 'failed',
                'summary' => $releaseResult['summary'] ?? null,
            ],
            'checks' => $checks,
        ];
    }

    private function fresh(mixed $value, int $maxAgeMinutes): bool
    {
        if (! is_string($value)) {
            return false;
        }

        try {
            $timestamp = Carbon::parse($value);

            return $timestamp->between(
                now()->subMinutes(max(1, $maxAgeMinutes)),
                now()->addMinutes(5),
            );
        } catch (\Throwable) {
            return false;
        }
    }

    private function sha(mixed $value): bool
    {
        return is_string($value) && preg_match('/^[0-9a-f]{40}$/', $value) === 1;
    }

    private function sha256(mixed $value): bool
    {
        return is_string($value) && preg_match('/^[0-9a-f]{64}$/', $value) === 1;
    }

    private function evidence(mixed $value): bool
    {
        return $this->concrete($value)
            && ! str_contains((string) $value, '..')
            && preg_match('#^evidence/[A-Za-z0-9][A-Za-z0-9._/-]*$#', (string) $value) === 1;
    }

    private function concrete(mixed $value): bool
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
