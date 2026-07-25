<?php

namespace App\Filament\Widgets;

use App\Models\AdminAssistSession;
use App\Models\Organization;
use App\Services\TenantContext;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AssistContext extends StatsOverviewWidget
{
    protected static ?int $sort = -10;

    public static function canView(): bool
    {
        $user = auth()->user();

        return $user?->isSagaDevAdmin()
            && app(TenantContext::class)->organizationId($user) !== null;
    }

    protected function getStats(): array
    {
        $organizationId = app(TenantContext::class)->organizationId(auth()->user());
        $assist = AdminAssistSession::query()->find(session('assist_session_id'));

        return [
            Stat::make('Admin assist mode', Organization::query()->find($organizationId)?->name ?? 'Unknown organization')
                ->description('Read and write actions are scoped until '.$assist?->expires_at?->format('H:i').' WIB')
                ->color('warning'),
        ];
    }
}
