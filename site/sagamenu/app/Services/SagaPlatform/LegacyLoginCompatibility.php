<?php

namespace App\Services\SagaPlatform;

use App\Models\User;
use DateTimeImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Throwable;

class LegacyLoginCompatibility
{
    public function attempt(string $email, string $password, Request $request): bool
    {
        if (! $this->isAvailable()) {
            return false;
        }

        $user = User::query()
            ->whereNull('central_user_id')
            ->whereRaw('LOWER(email) = ?', [strtolower(trim($email))])
            ->first();
        if (! $user || ! $user->is_active || blank($user->password) || ! Hash::check($password, $user->password)) {
            return false;
        }

        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->put('saga_platform.session_origin', 'legacy_compatibility');
        $request->session()->put(
            'saga_platform.legacy_compatibility_ends_at',
            config('sagamenu.saga_platform.legacy_login_compatibility_ends_at'),
        );
        $user->forceFill(['last_login_at' => now()])->save();

        return true;
    }

    public function isAvailable(): bool
    {
        if (! config('sagamenu.saga_platform.legacy_login_compatibility_enabled')) {
            return false;
        }

        $endsAt = trim((string) config('sagamenu.saga_platform.legacy_login_compatibility_ends_at'));
        if ($endsAt === '') {
            return false;
        }

        try {
            return new DateTimeImmutable($endsAt) > new DateTimeImmutable('now');
        } catch (Throwable) {
            return false;
        }
    }
}
