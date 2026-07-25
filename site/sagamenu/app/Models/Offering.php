<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Guarded([])]
class Offering extends Model
{
    protected function casts(): array
    {
        return [
            'badges' => 'array',
            'tags' => 'array',
            'dietary' => 'array',
            'allergens' => 'array',
            'is_featured' => 'boolean',
            'promo_starts_at' => 'datetime',
            'promo_ends_at' => 'datetime',
            'available_from' => 'datetime',
            'available_until' => 'datetime',
            'archived_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function catalog(): BelongsTo
    {
        return $this->belongsTo(Catalog::class);
    }

    public function primaryCollection(): BelongsTo
    {
        return $this->belongsTo(Collection::class, 'primary_collection_id');
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class)->withPivot('sort_order')->withTimestamps();
    }

    public function media(): HasMany
    {
        return $this->hasMany(OfferingMedia::class)->orderBy('sort_order');
    }

    public function variantGroups(): HasMany
    {
        return $this->hasMany(VariantGroup::class)->orderBy('sort_order');
    }

    public function optionGroups(): BelongsToMany
    {
        return $this->belongsToMany(OptionGroup::class)
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function inclusions(): HasMany
    {
        return $this->hasMany(Inclusion::class)->orderBy('sort_order');
    }
}
