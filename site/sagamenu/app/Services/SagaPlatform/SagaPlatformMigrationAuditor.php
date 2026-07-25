<?php

namespace App\Services\SagaPlatform;

use App\Models\SagaPlatformMigrationCandidate;
use App\Models\User;
use Illuminate\Support\Collection;

class SagaPlatformMigrationAuditor
{
    public function inventory(bool $persist = false): array
    {
        $users = User::query()->with('organizations')->get();
        $duplicateEmails = $users
            ->groupBy(fn (User $user) => strtolower(trim($user->email)))
            ->filter(fn (Collection $group) => $group->count() > 1)
            ->keys();
        $summary = [
            'scanned' => 0,
            'alreadyLinked' => 0,
            'eligible' => 0,
            'manualReview' => 0,
            'excluded' => 0,
            'persisted' => 0,
        ];

        foreach ($users as $user) {
            $summary['scanned']++;
            [$state, $reason] = $this->classify($user, $duplicateEmails);
            $summary[match ($state) {
                'linked' => 'alreadyLinked',
                'eligible' => 'eligible',
                'review' => 'manualReview',
                default => 'excluded',
            }]++;

            if (! $persist || $state === 'linked') {
                continue;
            }

            SagaPlatformMigrationCandidate::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'email_fingerprint' => hash_hmac(
                        'sha256',
                        strtolower(trim($user->email)),
                        (string) config('app.key'),
                    ),
                    'state' => $state,
                    'reason_code' => $reason,
                    'compatibility_until' => config('sagamenu.saga_platform.legacy_login_compatibility_ends_at'),
                ],
            );
            $summary['persisted']++;
        }

        return $summary;
    }

    private function classify(User $user, Collection $duplicateEmails): array
    {
        if (filled($user->central_user_id)) {
            return ['linked', 'CENTRAL_ID_PRESENT'];
        }
        if ($duplicateEmails->contains(strtolower(trim($user->email)))) {
            return ['review', 'DUPLICATE_NORMALIZED_EMAIL'];
        }
        if ($user->organizations->isEmpty()) {
            return ['excluded', 'NO_ORGANIZATION_MEMBERSHIP'];
        }
        if ($user->organizations->where('pivot.role', 'owner')->count() > 1) {
            return ['review', 'MULTIPLE_TENANT_OWNERSHIP'];
        }
        if (blank($user->password)) {
            return ['review', 'LOCAL_CREDENTIAL_MISSING'];
        }

        return ['eligible', 'CENTRAL_ENROLLMENT_REQUIRED'];
    }
}
