<?php

namespace App\Policies;

use App\Models\MediaAsset;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOrganization;

class MediaAssetPolicy
{
    use AuthorizesOrganization;

    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, MediaAsset $mediaAsset): bool
    {
        return $this->belongsToOrganization($user, $mediaAsset);
    }

    public function create(User $user): bool
    {
        return $user->isSagaDevAdmin() || $user->currentOrganization() !== null;
    }

    public function update(User $user, MediaAsset $mediaAsset): bool
    {
        return $this->hasRole($user, $mediaAsset, ['owner', 'manager', 'editor']);
    }

    public function delete(User $user, MediaAsset $mediaAsset): bool
    {
        return $this->hasRole($user, $mediaAsset, ['owner', 'manager']);
    }

    public function deleteAny(User $user): bool
    {
        return $user->isSagaDevAdmin() || in_array($user->currentOrganization()?->pivot?->role, ['owner', 'manager'], true);
    }
}
