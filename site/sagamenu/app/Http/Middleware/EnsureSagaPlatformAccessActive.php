<?php

namespace App\Http\Middleware;

use App\Models\SagaPlatformAccount;
use App\Services\SagaPlatform\SagaPlatformAccessProjector;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureSagaPlatformAccessActive
{
    public function __construct(private readonly SagaPlatformAccessProjector $access) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user || blank($user->central_user_id)) {
            return $next($request);
        }

        $account = SagaPlatformAccount::query()
            ->where('user_id', $user->id)
            ->where('central_user_id', $user->central_user_id)
            ->first();
        if ($account && $this->access->canAuthenticate($account)) {
            return $next($request);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $request->session()->put('saga_platform.restricted_status', $account?->status ?? 'unavailable');

        return redirect()->route('saga-platform.account-status');
    }
}
