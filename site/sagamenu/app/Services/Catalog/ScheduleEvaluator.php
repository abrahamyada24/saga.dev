<?php

namespace App\Services\Catalog;

use App\Models\Offering;
use App\Models\QrRoute;
use Illuminate\Support\Carbon;

class ScheduleEvaluator
{
    public function offeringIsVisible(Offering $offering, string $surface, ?Carbon $at = null): bool
    {
        $at ??= now();

        if ($offering->archived_at || $offering->visibility === 'hidden') {
            return false;
        }

        if ($surface === 'mobile' && $offering->visibility === 'store') {
            return false;
        }

        if ($surface === 'store' && $offering->visibility === 'mobile') {
            return false;
        }

        if ($offering->available_from && $at->lt($offering->available_from)) {
            return false;
        }

        return ! $offering->available_until || $at->lte($offering->available_until);
    }

    public function qrRouteIsActive(QrRoute $route, ?Carbon $at = null): bool
    {
        $at ??= now();

        if ($route->status !== 'active' || $route->archived_at) {
            return false;
        }

        if ($route->starts_at && $at->lt($route->starts_at)) {
            return false;
        }

        return ! $route->ends_at || $at->lte($route->ends_at);
    }
}
