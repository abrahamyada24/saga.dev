<?php

namespace App\Services;

use App\Models\OrganizationMembership;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrganizationMembershipService
{
    public function changeRole(OrganizationMembership $membership, string $role, User $actor): OrganizationMembership
    {
        $this->authorize($membership, $actor);
        $this->validateRole($role);

        return DB::transaction(function () use ($membership, $role, $actor): OrganizationMembership {
            $locked = OrganizationMembership::query()->lockForUpdate()->findOrFail($membership->id);
            $before = $locked->only(['role', 'status']);
            $locked->update(['role' => $role]);
            app(AuditLogger::class)->log($locked->organization, 'organization.membership_role_changed', $actor, null, $before, $locked->only(['role', 'status']));

            return $locked->fresh(['user', 'organization']);
        });
    }

    public function changeStatus(OrganizationMembership $membership, string $status, User $actor): OrganizationMembership
    {
        $this->authorize($membership, $actor);
        if (! in_array($status, ['active', 'inactive'], true)) {
            throw ValidationException::withMessages(['status' => 'Invalid membership status.']);
        }

        return DB::transaction(function () use ($membership, $status, $actor): OrganizationMembership {
            $locked = OrganizationMembership::query()->lockForUpdate()->findOrFail($membership->id);
            $before = $locked->only(['role', 'status']);
            $locked->update([
                'status' => $status,
                'deactivated_at' => $status === 'inactive' ? now() : null,
            ]);
            app(AuditLogger::class)->log($locked->organization, 'organization.membership_status_changed', $actor, null, $before, $locked->only(['role', 'status']));

            return $locked->fresh(['user', 'organization']);
        });
    }

    public function remove(OrganizationMembership $membership, User $actor): void
    {
        $this->authorize($membership, $actor);

        DB::transaction(function () use ($membership, $actor): void {
            $locked = OrganizationMembership::query()->lockForUpdate()->findOrFail($membership->id);
            $organization = $locked->organization;
            $memberEmail = $locked->user->email;
            $locked->delete();
            app(AuditLogger::class)->log($organization, 'organization.membership_removed', $actor, $memberEmail);
        });
    }

    private function authorize(OrganizationMembership $membership, User $actor): void
    {
        abort_unless($actor->isSagaDevAdmin() || $actor->roleFor($membership->organization_id) === 'owner', 403);
    }

    private function validateRole(string $role): void
    {
        if (! in_array($role, ['owner', 'manager', 'editor'], true)) {
            throw ValidationException::withMessages(['role' => 'Invalid organization role.']);
        }
    }
}
