<?php

namespace App\Policies;

use App\Models\SupportIssue;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class SupportIssuePolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, SupportIssue $issue): bool
    {
        return $this->belongsToOrganization($user, $issue);
    }

    public function create(User $user): bool
    {
        return $user->isSagaDevAdmin() || $user->currentOrganization() !== null;
    }

    public function update(User $user, SupportIssue $issue): bool
    {
        return $this->hasRole($user, $issue, ['owner', 'manager', 'editor']);
    }

    public function delete(User $user, SupportIssue $issue): bool
    {
        return false;
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}
