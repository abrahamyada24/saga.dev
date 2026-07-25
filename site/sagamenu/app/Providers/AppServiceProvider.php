<?php

namespace App\Providers;

use App\Models\Catalog;
use App\Models\Collection;
use App\Models\MediaAsset;
use App\Models\Offering;
use App\Models\OfferingMedia;
use App\Models\OrganizationMembership;
use App\Models\QrRoute;
use App\Services\AuditLogger;
use App\Services\ExternalUrlSanitizer;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! app()->isProduction());

        RateLimiter::for('analytics', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));
        RateLimiter::for('preview', fn (Request $request) => Limit::perMinute(30)->by($request->ip()));
        RateLimiter::for('qr', fn (Request $request) => Limit::perMinute(120)->by($request->ip()));

        foreach ([Catalog::class, Collection::class, Offering::class, MediaAsset::class, QrRoute::class] as $modelClass) {
            $modelClass::creating(function (Model $model): void {
                $user = auth()->user();
                if ($user && ! $user->isSagaDevAdmin()) {
                    $model->organization_id = $user->currentOrganization()?->id;
                }
            });

            $modelClass::updating(function (Model $model): void {
                $user = auth()->user();
                if ($user && ! $user->isSagaDevAdmin() && $model->isDirty('organization_id')) {
                    abort(403, 'Organization ownership cannot be changed.');
                }
            });

            $modelClass::updated(function (Model $model): void {
                $user = auth()->user();
                if (! $user) {
                    return;
                }

                $changes = collect($model->getChanges())->except('updated_at')->all();
                if (! $changes) {
                    return;
                }

                $before = collect(array_keys($changes))->mapWithKeys(fn ($key) => [$key => $model->getOriginal($key)])->all();
                app(AuditLogger::class)->log($model, strtolower(class_basename($model)).'.updated', $user, null, $before, $changes);
            });
        }

        Offering::saving(function (Offering $offering): void {
            try {
                $offering->external_action_url = app(ExternalUrlSanitizer::class)
                    ->validate($offering->external_action_label, $offering->external_action_url);
            } catch (InvalidArgumentException $exception) {
                throw ValidationException::withMessages(['external_action_url' => $exception->getMessage()]);
            }
        });

        OfferingMedia::creating(function (OfferingMedia $media): void {
            $media->organization_id = Offering::query()->findOrFail($media->offering_id)->organization_id;
        });

        $guardLastOwner = function (OrganizationMembership $membership): void {
            $wasActiveOwner = $membership->getOriginal('role') === 'owner'
                && $membership->getOriginal('status') === 'active'
                && $membership->getOriginal('accepted_at') !== null;
            $willRemainActiveOwner = ! $membership->exists
                || ($membership->role === 'owner' && $membership->status === 'active' && $membership->accepted_at !== null);

            if (! $wasActiveOwner || $willRemainActiveOwner) {
                return;
            }

            $otherOwners = OrganizationMembership::query()
                ->where('organization_id', $membership->organization_id)
                ->whereKeyNot($membership->id)
                ->where('role', 'owner')
                ->where('status', 'active')
                ->whereNotNull('accepted_at')
                ->lockForUpdate()
                ->count();

            if ($otherOwners === 0) {
                throw ValidationException::withMessages(['role' => 'An organization must keep at least one active Owner.']);
            }
        };

        OrganizationMembership::updating($guardLastOwner);
        OrganizationMembership::deleting(function (OrganizationMembership $membership) use ($guardLastOwner): void {
            $membership->role = 'editor';
            $guardLastOwner($membership);
        });

        Gate::before(fn ($user) => $user->isSagaDevAdmin() ? true : null);
    }
}
