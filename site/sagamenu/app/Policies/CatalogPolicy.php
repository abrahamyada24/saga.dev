<?php

namespace App\Policies;

use App\Models\Catalog;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class CatalogPolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, Catalog $catalog): bool
    {
        return $this->belongsToOrganization($user, $catalog);
    }

    public function create(User $user): bool
    {
        return $user->isSagaDevAdmin() || $user->currentOrganization() !== null;
    }

    public function update(User $user, Catalog $catalog): bool
    {
        return $this->hasRole($user, $catalog, ['owner', 'manager', 'editor']);
    }

    public function delete(User $user, Catalog $catalog): bool
    {
        return $this->hasRole($user, $catalog, ['owner', 'manager']);
    }

    public function deleteAny(User $user): bool
    {
        return $user->isSagaDevAdmin() || in_array($user->currentOrganization()?->pivot?->role, ['owner', 'manager'], true);
    }

    public function publish(User $user, Catalog $catalog): bool
    {
        return $this->hasRole($user, $catalog, ['owner', 'manager']);
    }
}
