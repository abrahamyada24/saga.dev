<?php

namespace App\Policies;

use App\Models\OrganizationMembership;
use App\Models\User;

class OrganizationMembershipPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && ($user->isSagaDevAdmin() || $user->currentOrganization() !== null);
    }

    public function view(User $user, OrganizationMembership $membership): bool
    {
        return $user->isSagaDevAdmin() || $user->roleFor($membership->organization_id) === 'owner';
    }

    public function update(User $user, OrganizationMembership $membership): bool
    {
        return $this->view($user, $membership);
    }

    public function delete(User $user, OrganizationMembership $membership): bool
    {
        return $this->view($user, $membership);
    }
}
