<?php

namespace App\Policies;

use App\Models\CatalogSnapshot;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class CatalogSnapshotPolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, CatalogSnapshot $snapshot): bool
    {
        return $this->belongsToOrganization($user, $snapshot);
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, CatalogSnapshot $snapshot): bool
    {
        return false;
    }

    public function delete(User $user, CatalogSnapshot $snapshot): bool
    {
        return false;
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}
