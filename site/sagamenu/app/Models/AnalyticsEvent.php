<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;

#[Guarded([])]
class AnalyticsEvent extends Model
{
    use MassPrunable;

    protected function casts(): array
    {
        return ['metadata' => 'array', 'occurred_at' => 'datetime'];
    }

    public function prunable()
    {
        return static::query()->where('occurred_at', '<', now()->subDays(180));
    }
}
