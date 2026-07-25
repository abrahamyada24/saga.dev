<?php

namespace App\Filament\Widgets;

use App\Models\OrganizationMembership;
use App\Services\TenantContext;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class OnboardingProgress extends StatsOverviewWidget
{
    protected static ?int $sort = -4;

    public static function canView(): bool
    {
        return auth()->check() && ! auth()->user()->isSagaDevAdmin() && auth()->user()->currentOrganization() !== null;
    }

    protected function getStats(): array
    {
        $organization = auth()->user()->currentOrganization();
        $organizationId = app(TenantContext::class)->organizationId(auth()->user());
        $hasOwner = OrganizationMembership::query()
            ->where('organization_id', $organizationId)
            ->where('role', 'owner')->where('status', 'active')->whereNotNull('accepted_at')->exists();
        $hasCatalog = $organization->catalogs()->exists();
        $hasPublishedCatalog = $organization->catalogs()->whereNotNull('active_snapshot_id')->exists();
        $hasQr = $organization->catalogs()->whereHas('qrRoutes', fn ($query) => $query->where('status', 'active'))->exists();
        $completed = collect([$hasOwner, $hasCatalog, $hasPublishedCatalog, $hasQr])->filter()->count();

        return [
            Stat::make('Setup progress', "{$completed}/4")
                ->description($completed === 4 ? 'Catalog workspace siap digunakan' : 'Lengkapi team, catalog, publish, dan QR')
                ->color($completed === 4 ? 'success' : 'warning'),
            Stat::make('Onboarding', ucfirst(str_replace('_', ' ', $organization->onboarding_status)))->description('Status operasional tenant'),
            Stat::make('Pilot', ucfirst(str_replace('_', ' ', $organization->pilot_status)))->description('Status controlled pilot'),
            Stat::make('Attention', $organization->attention_status === 'open' ? 'Action needed' : 'Clear')
                ->description($organization->attention_reason ?: 'Tidak ada blocker aktif')
                ->color($organization->attention_status === 'open' ? 'danger' : 'success'),
        ];
    }
}
