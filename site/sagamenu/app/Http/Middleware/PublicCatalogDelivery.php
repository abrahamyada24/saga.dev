<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PublicCatalogDelivery
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->isMethodCacheable() || $response->getStatusCode() !== Response::HTTP_OK) {
            return $response;
        }

        $content = $response->getContent();
        if (! is_string($content)) {
            return $response;
        }

        $response->setEtag(hash('sha256', $content));
        $response->setVary(array_values(array_unique([
            ...$response->getVary(),
            'Accept-Encoding',
        ])));
        $response->headers->set('Cache-Control', $this->cacheControl());
        $response->isNotModified($request);

        return $response;
    }

    private function cacheControl(): string
    {
        return implode(', ', [
            'public',
            'max-age='.(int) config('sagamenu.public_delivery.browser_max_age_seconds', 0),
            's-maxage='.(int) config('sagamenu.public_delivery.shared_max_age_seconds', 60),
            'stale-while-revalidate='.(int) config('sagamenu.public_delivery.stale_while_revalidate_seconds', 30),
            'stale-if-error='.(int) config('sagamenu.public_delivery.stale_if_error_seconds', 86400),
        ]);
    }
}
