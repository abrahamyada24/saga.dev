<?php

namespace App\Services\Publishing;

use App\Models\Catalog;
use App\Models\PreviewToken;
use App\Models\User;
use Illuminate\Support\Str;

class PreviewTokenService
{
    public function __construct(private readonly CatalogSnapshotBuilder $builder) {}

    public function create(Catalog $catalog, string $surface, ?User $actor = null): string
    {
        $plainToken = Str::random(64);

        PreviewToken::query()->create([
            'organization_id' => $catalog->organization_id,
            'catalog_id' => $catalog->id,
            'token_hash' => hash('sha256', $plainToken),
            'surface' => in_array($surface, ['mobile', 'store'], true) ? $surface : 'mobile',
            'payload' => $this->builder->build($catalog),
            'expires_at' => now()->addHours(2),
            'created_by_user_id' => $actor?->id,
        ]);

        return $plainToken;
    }

    public function resolve(string $plainToken): PreviewToken
    {
        return PreviewToken::query()
            ->where('token_hash', hash('sha256', $plainToken))
            ->where('expires_at', '>', now())
            ->firstOrFail();
    }
}
