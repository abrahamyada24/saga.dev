<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectFilamentLoginToSagaPlatform
{
    public function handle(Request $request, Closure $next): Response
    {
        if (config('sagamenu.saga_platform.enabled')
            && $request->routeIs('filament.admin.auth.login')) {
            return redirect()->route('saga-platform.login.show');
        }

        return $next($request);
    }
}
