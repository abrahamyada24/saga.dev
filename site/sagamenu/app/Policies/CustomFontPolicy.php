<?php

namespace App\Policies;

use App\Models\CustomFont;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class CustomFontPolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, CustomFont $font): bool
    {
        return $this->belongsToOrganization($user, $font);
    }

    public function create(User $user): bool
    {
        return $user->isSagaDevAdmin() || $user->currentOrganization() !== null;
    }

    public function update(User $user, CustomFont $font): bool
    {
        return $this->hasRole($user, $font, ['owner', 'manager']);
    }

    public function delete(User $user, CustomFont $font): bool
    {
        return $this->hasRole($user, $font, ['owner', 'manager']);
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}
