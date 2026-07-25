<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureSagaPlatformEnabled
{
    public function handle(Request $request, Closure $next, ?string $requireAuth = null): Response
    {
        abort_unless(config('sagamenu.saga_platform.enabled'), 404);
        if ($requireAuth === 'auth' && ! Auth::check()) {
            return redirect()->route('saga-platform.login.show');
        }

        return $next($request);
    }
}
