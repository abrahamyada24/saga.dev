<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Guarded([])]
class VariantGroup extends Model
{
    public function offering(): BelongsTo
    {
        return $this->belongsTo(Offering::class);
    }

    public function values(): HasMany
    {
        return $this->hasMany(VariantValue::class)->orderBy('sort_order');
    }
}
