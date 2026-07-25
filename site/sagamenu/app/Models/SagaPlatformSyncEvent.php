<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded([])]
class SagaPlatformSyncEvent extends Model
{
    protected function casts(): array
    {
        return ['applied_at' => 'datetime'];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(SagaPlatformAccount::class, 'saga_platform_account_id');
    }
}
