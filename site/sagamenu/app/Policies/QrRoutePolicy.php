<?php

namespace App\Policies;

use App\Models\QrRoute;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class QrRoutePolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, QrRoute $qrRoute): bool
    {
        return $this->belongsToOrganization($user, $qrRoute);
    }

    public function create(User $user): bool
    {
        return $user->isSagaDevAdmin() || in_array($user->currentOrganization()?->pivot?->role, ['owner', 'manager'], true);
    }

    public function update(User $user, QrRoute $qrRoute): bool
    {
        return $this->hasRole($user, $qrRoute, ['owner', 'manager']);
    }

    public function delete(User $user, QrRoute $qrRoute): bool
    {
        return false;
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}
