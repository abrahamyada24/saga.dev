<?php

namespace App\Services;

use App\Models\BackupRun;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class OperationalReadiness
{
    public function checks(): array
    {
        return [
            'database' => $this->run(fn () => DB::select('select 1'), 'query ok'),
            'cache' => $this->run(function (): bool {
                Cache::put('sagamenu:health', 'ok', 10);

                return Cache::get('sagamenu:health') === 'ok';
            }, 'read/write ok'),
            'public_storage' => $this->run(function (): bool {
                $path = '.health-'.bin2hex(random_bytes(6));
                $stored = Storage::disk('public')->put($path, 'ok');
                $readable = $stored && Storage::disk('public')->get($path) === 'ok';
                Storage::disk('public')->delete($path);

                return $readable;
            }, 'read/write/delete ok'),
            'failed_jobs' => $this->run(fn () => DB::table('failed_jobs')->count() === 0, 'no failed jobs'),
            'scheduler' => $this->schedulerCheck(),
            'backup' => $this->backupCheck(),
            'malware_scanner' => [
                'passed' => ! config('sagamenu.malware.required') || config('sagamenu.malware.enabled'),
                'detail' => config('sagamenu.malware.enabled') ? 'enabled' : (config('sagamenu.malware.required') ? 'required but disabled' : 'optional and disabled'),
            ],
        ];
    }

    public function passed(): bool
    {
        return collect($this->checks())->every(fn (array $check) => $check['passed']);
    }

    private function schedulerCheck(): array
    {
        $heartbeat = Cache::get('sagamenu:scheduler-heartbeat');
        $maxAge = config('sagamenu.monitoring.scheduler_max_age_minutes');
        $passed = $heartbeat && Carbon::parse($heartbeat)->greaterThan(now()->subMinutes($maxAge));

        return ['passed' => (bool) $passed, 'detail' => $heartbeat ? "last heartbeat {$heartbeat}" : 'heartbeat missing'];
    }

    private function backupCheck(): array
    {
        $backup = BackupRun::query()->where('status', 'completed')->latest('completed_at')->first();
        $maxAge = config('sagamenu.backup.max_age_hours');
        $passed = $backup?->completed_at?->greaterThan(now()->subHours($maxAge)) && $backup->verified_at !== null;

        return [
            'passed' => (bool) $passed,
            'detail' => $backup ? "backup #{$backup->id}, completed {$backup->completed_at}, verified ".($backup->verified_at ?: 'no') : 'completed backup missing',
        ];
    }

    private function run(callable $check, string $success): array
    {
        try {
            return ['passed' => $check() !== false, 'detail' => $success];
        } catch (Throwable $exception) {
            report($exception);

            return ['passed' => false, 'detail' => $exception->getMessage()];
        }
    }
}
