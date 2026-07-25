<?php

namespace App\Filament\Concerns;

use App\Services\TenantContext;
use Illuminate\Database\Eloquent\Builder;

trait ScopesTenantRecords
{
    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user = auth()->user();

        if (! $user) {
            return $query;
        }

        if ($user->isSagaDevAdmin()) {
            $assistedOrganizationId = app(TenantContext::class)->organizationId($user);

            return $assistedOrganizationId
                ? $query->where($query->getModel()->qualifyColumn('organization_id'), $assistedOrganizationId)
                : $query;
        }

        $organizationId = $user->currentOrganization()?->id;

        return $organizationId
            ? $query->where($query->getModel()->qualifyColumn('organization_id'), $organizationId)
            : $query->whereRaw('1 = 0');
    }
}
