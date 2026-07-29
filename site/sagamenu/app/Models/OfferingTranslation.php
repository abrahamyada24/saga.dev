<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded([])]
class OfferingTranslation extends Model
{
    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public function offering(): BelongsTo
    {
        return $this->belongsTo(Offering::class);
    }
}
