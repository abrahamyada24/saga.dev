<?php

namespace App\Console\Commands;

use App\Exceptions\SagaPlatformException;
use App\Models\SagaPlatformAccount;
use App\Services\SagaPlatform\SagaMenuUsageSnapshotBuilder;
use App\Services\SagaPlatform\SagaPlatformClient;
use Illuminate\Console\Command;

class ReportSagaMenuUsageSnapshot extends Command
{
    protected $signature = 'sagamenu:saga-platform-usage {--period=} {--dry-run}';

    protected $description = 'Report allowlisted SagaMenu aggregate usage to Saga Platform.';

    public function handle(SagaPlatformClient $platform, SagaMenuUsageSnapshotBuilder $builder): int
    {
        if (! config('sagamenu.saga_platform.enabled') && ! $this->option('dry-run')) {
            $this->error('Saga Platform integration is disabled.');

            return self::FAILURE;
        }

        $period = trim((string) ($this->option('period') ?: now()->toDateString()));
        $reported = 0;
        SagaPlatformAccount::query()->with(['organization.subscription'])->each(function (SagaPlatformAccount $account) use ($platform, $builder, $period, &$reported): void {
            $metrics = $builder->build($account);
            $builder->assertSafe($metrics);
            $payload = [
                'productAccountId' => $account->central_product_account_id,
                'periodKey' => $period,
                'schemaVersion' => 1,
                'observedAt' => now()->utc()->toIso8601ZuluString(),
                'metrics' => $metrics,
            ];

            if ($this->option('dry-run')) {
                $this->line(json_encode($payload, JSON_THROW_ON_ERROR));
                $reported++;

                return;
            }

            try {
                $platform->putUsageSnapshot($payload);
                $reported++;
            } catch (SagaPlatformException $exception) {
                $this->error("Usage report failed: {$exception->safeCode}");
            }
        });

        $this->info("SagaMenu usage snapshots processed: {$reported}");

        return self::SUCCESS;
    }
}
