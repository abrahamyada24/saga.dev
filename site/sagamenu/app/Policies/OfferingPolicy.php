<?php

namespace App\Policies;

use App\Models\Offering;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class OfferingPolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, Offering $offering): bool
    {
        return $this->belongsToOrganization($user, $offering);
    }

    public function create(User $user): bool
    {
        return $user->isSagaDevAdmin() || $user->currentOrganization() !== null;
    }

    public function update(User $user, Offering $offering): bool
    {
        return $this->hasRole($user, $offering, ['owner', 'manager', 'editor']);
    }

    public function delete(User $user, Offering $offering): bool
    {
        return $this->hasRole($user, $offering, ['owner', 'manager']);
    }

    public function deleteAny(User $user): bool
    {
        return $user->isSagaDevAdmin() || in_array($user->currentOrganization()?->pivot?->role, ['owner', 'manager'], true);
    }
}
