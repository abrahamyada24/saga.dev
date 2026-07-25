<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class InvalidateDisabledSagaPlatformSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        if (! config('sagamenu.saga_platform.enabled') && filled($user?->central_user_id)) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return $next($request);
    }
}
