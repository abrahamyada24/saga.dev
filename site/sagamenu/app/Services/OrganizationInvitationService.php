<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\User;
use App\Notifications\OrganizationInvitationNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrganizationInvitationService
{
    public function create(Organization $organization, string $email, string $role, User $actor): OrganizationInvitation
    {
        if (! $actor->isSagaDevAdmin() && $actor->roleFor($organization) !== 'owner') {
            abort(403);
        }

        if (! in_array($role, ['owner', 'manager', 'editor'], true)) {
            throw ValidationException::withMessages(['role' => 'Invalid organization role.']);
        }

        $normalizedEmail = strtolower(trim($email));
        if ($organization->users()->whereRaw('LOWER(users.email) = ?', [$normalizedEmail])->exists()) {
            throw ValidationException::withMessages(['email' => 'This user is already a member.']);
        }

        $plainToken = Str::random(64);
        $invitation = OrganizationInvitation::query()->create([
            'organization_id' => $organization->id,
            'invited_by_user_id' => $actor->id,
            'email' => $normalizedEmail,
            'role' => $role,
            'token_hash' => hash('sha256', $plainToken),
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $invitation->email)
            ->notify(new OrganizationInvitationNotification($organization, $plainToken));
        app(AuditLogger::class)->log($organization, 'organization.invitation_created', $actor, "Invitation for {$invitation->email}");

        return $invitation;
    }

    public function accept(string $plainToken, User $user): Organization
    {
        $invitation = OrganizationInvitation::query()
            ->where('token_hash', hash('sha256', $plainToken))
            ->whereNull('accepted_at')
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        if (strtolower($user->email) !== strtolower($invitation->email)) {
            abort(403, 'Invitation email does not match the signed-in account.');
        }

        $invitation->organization->users()->syncWithoutDetaching([
            $user->id => ['role' => $invitation->role, 'status' => 'active', 'is_primary' => false, 'accepted_at' => now(), 'deactivated_at' => null],
        ]);
        $invitation->update(['accepted_at' => now()]);
        app(AuditLogger::class)->log($invitation->organization, 'organization.invitation_accepted', $user);

        return $invitation->organization;
    }
}
