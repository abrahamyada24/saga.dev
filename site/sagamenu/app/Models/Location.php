<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Guarded([])]
class Location extends Model
{
    protected function casts(): array
    {
        return ['opening_hours' => 'array', 'is_default' => 'boolean', 'is_active' => 'boolean'];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function catalogs(): HasMany
    {
        return $this->hasMany(Catalog::class);
    }
}
