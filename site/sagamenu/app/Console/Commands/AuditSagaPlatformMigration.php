<?php

namespace App\Console\Commands;

use App\Services\SagaPlatform\SagaPlatformMigrationAuditor;
use Illuminate\Console\Command;

class AuditSagaPlatformMigration extends Command
{
    protected $signature = 'sagamenu:saga-platform-migration-audit {--write}';

    protected $description = 'Inventory legacy identity migration readiness without exposing account PII.';

    public function handle(SagaPlatformMigrationAuditor $auditor): int
    {
        $summary = $auditor->inventory((bool) $this->option('write'));
        $summary['mode'] = $this->option('write') ? 'write_local_candidates' : 'dry_run';
        $this->line(json_encode($summary, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));

        return self::SUCCESS;
    }
}
