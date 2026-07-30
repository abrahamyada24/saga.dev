<?php

namespace App\Services\Publishing;

use App\Models\Offering;
use App\Models\User;
use App\Services\Catalog\OfferingAvailability;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CatalogAvailabilityPublisher
{
    public function updateAndPublish(Offering $offering, string $availability, User $actor): Offering
    {
        if (! in_array($availability, OfferingAvailability::allowed(), true)) {
            throw ValidationException::withMessages(['availability' => 'Invalid availability state.']);
        }

        return DB::transaction(function () use ($offering, $availability, $actor): Offering {
            $locked = Offering::query()->with('catalog')->lockForUpdate()->findOrFail($offering->id);
            $locked->update(['availability' => $availability]);
            app(CatalogPublisher::class)->publish($locked->catalog->fresh(), $actor, 'Quick availability publish');

            return $locked->fresh();
        });
    }
}
