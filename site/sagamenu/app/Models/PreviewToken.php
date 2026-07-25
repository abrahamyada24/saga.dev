<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded([])]
class PreviewToken extends Model
{
    use MassPrunable;

    protected function casts(): array
    {
        return ['payload' => 'array', 'expires_at' => 'datetime'];
    }

    public function catalog(): BelongsTo
    {
        return $this->belongsTo(Catalog::class);
    }

    public function prunable()
    {
        return static::query()->where('expires_at', '<', now()->subDay());
    }
}
