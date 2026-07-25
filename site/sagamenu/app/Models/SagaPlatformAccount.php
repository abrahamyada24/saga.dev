<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded([])]
class SagaPlatformAccount extends Model
{
    protected function casts(): array
    {
        return [
            'trial_ends_at' => 'datetime',
            'last_synced_at' => 'datetime',
            'access_synced_at' => 'datetime',
            'entitlements' => 'array',
            'quota_policy' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }
}
