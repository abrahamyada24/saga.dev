<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['central_user_id', 'name', 'email', 'email_verified_at', 'password', 'global_role', 'is_active', 'last_login_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class)
            ->withPivot(['role', 'status', 'is_primary', 'invited_at', 'accepted_at', 'deactivated_at'])
            ->withTimestamps();
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_active && $this->email_verified_at !== null;
    }

    public function isSagaDevAdmin(): bool
    {
        return $this->global_role === 'sagadev_admin';
    }

    public function currentOrganization(): ?Organization
    {
        return $this->organizations()
            ->wherePivot('status', 'active')
            ->wherePivotNotNull('accepted_at')
            ->orderByPivot('is_primary', 'desc')
            ->first();
    }

    public function roleFor(Organization|int $organization): ?string
    {
        $organizationId = $organization instanceof Organization ? $organization->id : $organization;

        return $this->organizations()
            ->whereKey($organizationId)
            ->wherePivot('status', 'active')
            ->wherePivotNotNull('accepted_at')
            ->first()?->pivot?->role;
    }

    public function sagaPlatformAccounts(): HasMany
    {
        return $this->hasMany(SagaPlatformAccount::class);
    }
}
