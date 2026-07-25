<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded([])]
class OrganizationMembership extends Model
{
    protected $table = 'organization_user';

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'invited_at' => 'datetime',
            'accepted_at' => 'datetime',
            'deactivated_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isActiveOwner(): bool
    {
        return $this->role === 'owner' && $this->status === 'active' && $this->accepted_at !== null;
    }
}
