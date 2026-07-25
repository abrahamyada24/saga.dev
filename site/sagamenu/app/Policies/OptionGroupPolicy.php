<?php

namespace App\Policies;

use App\Models\OptionGroup;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class OptionGroupPolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, OptionGroup $group): bool
    {
        return $this->belongsToOrganization($user, $group);
    }

    public function create(User $user): bool
    {
        return $user->isSagaDevAdmin() || $user->currentOrganization() !== null;
    }

    public function update(User $user, OptionGroup $group): bool
    {
        return $this->hasRole($user, $group, ['owner', 'manager', 'editor']);
    }

    public function delete(User $user, OptionGroup $group): bool
    {
        return $this->hasRole($user, $group, ['owner', 'manager']);
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}
