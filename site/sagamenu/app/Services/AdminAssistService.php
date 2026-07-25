<?php

namespace App\Services;

use App\Models\AdminAssistSession;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AdminAssistService
{
    public function start(User $admin, Organization $organization, string $reason): AdminAssistSession
    {
        abort_unless($admin->isSagaDevAdmin(), 403);

        if (mb_strlen(trim($reason)) < 10) {
            throw ValidationException::withMessages(['reason' => 'Assist reason must contain at least 10 characters.']);
        }

        $this->stop($admin);
        $assist = AdminAssistSession::query()->create([
            'organization_id' => $organization->id,
            'user_id' => $admin->id,
            'reason' => trim($reason),
            'started_at' => now(),
            'expires_at' => now()->addHour(),
        ]);

        session(['assist_organization_id' => $organization->id, 'assist_session_id' => $assist->id]);
        app(AuditLogger::class)->log($organization, 'admin_assist.started', $admin, $reason);

        return $assist;
    }

    public function stop(User $admin): void
    {
        if ($sessionId = session('assist_session_id')) {
            AdminAssistSession::query()->whereKey($sessionId)->where('user_id', $admin->id)->update(['ended_at' => now()]);
        }

        session()->forget(['assist_organization_id', 'assist_session_id']);
    }
}
