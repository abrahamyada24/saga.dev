<?php

namespace App\Console\Commands;

use App\Services\OperationalReadiness;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class MonitorSagaMenu extends Command
{
    protected $signature = 'sagamenu:monitor {--dry-run : Print the payload without sending it}';

    protected $description = 'Evaluate readiness and send failures to the configured monitoring webhook.';

    public function handle(OperationalReadiness $readiness): int
    {
        $checks = $readiness->checks();
        $failed = collect($checks)->filter(fn (array $check) => ! $check['passed']);
        $payload = [
            'application' => config('app.name'),
            'environment' => app()->environment(),
            'healthy' => $failed->isEmpty(),
            'checked_at' => now()->toIso8601String(),
            'failed_checks' => $failed->all(),
        ];

        if ($this->option('dry-run')) {
            $this->line(json_encode($payload, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
        } elseif ($failed->isNotEmpty() && config('sagamenu.monitoring.webhook_url')) {
            Http::timeout(10)->retry(2, 250)->post(config('sagamenu.monitoring.webhook_url'), $payload)->throw();
        }

        return $failed->isEmpty() ? self::SUCCESS : self::FAILURE;
    }
}
