<?php

namespace App\Services;

use App\Models\AdminAssistSession;
use App\Models\User;

class TenantContext
{
    public function organizationId(?User $user): ?int
    {
        if (! $user) {
            return null;
        }

        if (! $user->isSagaDevAdmin()) {
            return $user->currentOrganization()?->id;
        }

        $organizationId = session('assist_organization_id');
        if (! $organizationId) {
            return null;
        }

        $active = AdminAssistSession::query()
            ->whereKey(session('assist_session_id'))
            ->where('user_id', $user->id)
            ->where('organization_id', $organizationId)
            ->whereNull('ended_at')
            ->where('expires_at', '>', now())
            ->exists();

        if (! $active) {
            session()->forget(['assist_session_id', 'assist_organization_id']);

            return null;
        }

        return (int) $organizationId;
    }
}
