<?php

namespace App\Policies;

use App\Models\Collection;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class CollectionPolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, Collection $collection): bool
    {
        return $this->belongsToOrganization($user, $collection);
    }

    public function create(User $user): bool
    {
        return $user->isSagaDevAdmin() || $user->currentOrganization() !== null;
    }

    public function update(User $user, Collection $collection): bool
    {
        return $this->hasRole($user, $collection, ['owner', 'manager', 'editor']);
    }

    public function delete(User $user, Collection $collection): bool
    {
        return $this->hasRole($user, $collection, ['owner', 'manager']);
    }

    public function deleteAny(User $user): bool
    {
        return $user->isSagaDevAdmin() || in_array($user->currentOrganization()?->pivot?->role, ['owner', 'manager'], true);
    }
}
