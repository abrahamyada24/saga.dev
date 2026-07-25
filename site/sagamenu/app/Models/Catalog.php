<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Guarded([])]
class Catalog extends Model
{
    protected function casts(): array
    {
        return [
            'store_display_enabled' => 'boolean',
            'mobile_catalog_enabled' => 'boolean',
            'last_published_at' => 'datetime',
            'archived_at' => 'datetime',
            'appearance' => 'array',
            'business_info' => 'array',
            'settings' => 'array',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function customFont(): BelongsTo
    {
        return $this->belongsTo(CustomFont::class);
    }

    public function collections(): HasMany
    {
        return $this->hasMany(Collection::class)->orderBy('sort_order');
    }

    public function offerings(): HasMany
    {
        return $this->hasMany(Offering::class)->orderBy('sort_order');
    }

    public function snapshots(): HasMany
    {
        return $this->hasMany(CatalogSnapshot::class)->latest('version');
    }

    public function activeSnapshot(): BelongsTo
    {
        return $this->belongsTo(CatalogSnapshot::class, 'active_snapshot_id');
    }

    public function qrRoutes(): HasMany
    {
        return $this->hasMany(QrRoute::class);
    }
}
