<?php

namespace App\Http\Controllers;

use App\Models\AnalyticsEvent;
use App\Models\QrRoute;
use App\Services\Catalog\ScheduleEvaluator;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class QrRedirectController extends Controller
{
    public function redirect(string $code, ScheduleEvaluator $scheduleEvaluator): RedirectResponse
    {
        $qr = QrRoute::query()->with(['catalog.organization'])->where('code', $code)->firstOrFail();
        abort_unless($scheduleEvaluator->qrRouteIsActive($qr), 410, 'QR route is unavailable.');

        AnalyticsEvent::query()->create([
            'event_id' => (string) Str::uuid(),
            'organization_id' => $qr->organization_id,
            'catalog_id' => $qr->catalog_id,
            'qr_route_id' => $qr->id,
            'event_name' => 'qr_scanned',
            'surface' => $qr->destination_surface,
            'metadata' => ['source_key' => $qr->source_key],
            'occurred_at' => now(),
        ]);

        $route = $qr->destination_surface === 'store' ? 'public.store-display' : 'public.mobile-catalog';

        return redirect()->route($route, [
            'brand' => $qr->catalog->organization->slug,
            'catalog' => $qr->catalog->slug,
        ]);
    }

    public function download(string $code): Response
    {
        $qr = QrRoute::query()->where('code', $code)->firstOrFail();
        Gate::authorize('view', $qr);
        $png = (new QRCode(new QROptions([
            'outputBase64' => false,
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'imageTransparent' => false,
            'scale' => 8,
        ])))
            ->render(route('qr.redirect', ['code' => $qr->code]));

        return response($png, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment; filename="'.$qr->code.'.png"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
