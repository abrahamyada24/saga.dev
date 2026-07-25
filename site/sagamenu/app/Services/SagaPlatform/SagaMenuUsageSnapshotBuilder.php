<?php

namespace App\Services\SagaPlatform;

use App\Models\SagaPlatformAccount;
use InvalidArgumentException;

class SagaMenuUsageSnapshotBuilder
{
    public const ALLOWED_KEYS = [
        'activeBusinesses',
        'trialBusinesses',
        'activeSubscriptions',
        'outletsCount',
        'catalogsPublished',
        'qrCodesCount',
        'serviceHealth',
    ];

    public function build(SagaPlatformAccount $account): array
    {
        $organization = $account->organization;
        $subscription = $organization->subscription;

        return [
            'activeBusinesses' => $organization->status === 'active' ? 1 : 0,
            'trialBusinesses' => $account->status === 'trialing' ? 1 : 0,
            'activeSubscriptions' => $subscription?->status === 'active' ? 1 : 0,
            'outletsCount' => $organization->locations()->where('is_active', true)->count(),
            'catalogsPublished' => $organization->catalogs()->whereNotNull('active_snapshot_id')->count(),
            'qrCodesCount' => $organization->catalogs()->whereHas('qrRoutes', fn ($query) => $query->where('status', 'active'))->withCount([
                'qrRoutes as active_qr_count' => fn ($query) => $query->where('status', 'active'),
            ])->get()->sum('active_qr_count'),
            'serviceHealth' => 'healthy',
        ];
    }

    public function assertSafe(array $metrics): void
    {
        if (array_diff(array_keys($metrics), self::ALLOWED_KEYS) !== []) {
            throw new InvalidArgumentException('Usage snapshot contains forbidden metrics.');
        }

        foreach ($metrics as $value) {
            if (! is_int($value) && ! is_float($value) && ! is_bool($value) && ! is_string($value)) {
                throw new InvalidArgumentException('Usage snapshot metrics must be aggregate scalars.');
            }
        }
    }
}
