<?php

namespace App\Policies\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

trait AuthorizesOrganization
{
    protected function belongsToOrganization(User $user, Model $record): bool
    {
        return $user->isSagaDevAdmin()
            || ($record->organization_id && $user->organizations()->whereKey($record->organization_id)->exists());
    }

    protected function hasRole(User $user, Model $record, array $roles): bool
    {
        return $user->isSagaDevAdmin()
            || ($this->belongsToOrganization($user, $record) && in_array($user->roleFor($record->organization_id), $roles, true));
    }
}
