<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded([])]
class SagaPlatformCheckoutAttempt extends Model
{
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'attempted_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(SagaPlatformAccount::class, 'saga_platform_account_id');
    }
}
