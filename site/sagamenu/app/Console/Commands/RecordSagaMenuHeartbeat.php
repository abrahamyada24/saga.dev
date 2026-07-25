<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class RecordSagaMenuHeartbeat extends Command
{
    protected $signature = 'sagamenu:heartbeat';

    protected $description = 'Record scheduler liveness for readiness monitoring.';

    public function handle(): int
    {
        Cache::put('sagamenu:scheduler-heartbeat', now()->toIso8601String(), now()->addMinutes(15));
        $this->info('Scheduler heartbeat recorded.');

        return self::SUCCESS;
    }
}
