<?php

namespace App\Console\Commands;

use App\Services\OperationalReadiness;
use Illuminate\Console\Command;

class SagaMenuHealthCheck extends Command
{
    protected $signature = 'sagamenu:health-check {--json : Emit machine-readable JSON}';

    protected $description = 'Verify dependencies and operational readiness signals.';

    public function handle(OperationalReadiness $readiness): int
    {
        $checks = $readiness->checks();

        if ($this->option('json')) {
            $this->line(json_encode(['passed' => collect($checks)->every(fn ($check) => $check['passed']), 'checks' => $checks], JSON_THROW_ON_ERROR));
        } else {
            foreach ($checks as $name => $check) {
                $this->line(sprintf('[%s] %s: %s', $check['passed'] ? 'PASS' : 'FAIL', $name, $check['detail']));
            }
        }

        return collect($checks)->every(fn ($check) => $check['passed']) ? self::SUCCESS : self::FAILURE;
    }
}
