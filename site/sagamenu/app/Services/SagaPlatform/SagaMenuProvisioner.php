<?php

namespace App\Services\SagaPlatform;

use App\Exceptions\SagaPlatformException;
use App\Models\Catalog;
use App\Models\Location;
use App\Models\Organization;
use App\Models\SagaPlatformAccount;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SagaMenuProvisioner
{
    public function provision(array $signup, array $verification): SagaPlatformAccount
    {
        $required = ['platformUserId', 'organizationId', 'productAccountId', 'subscriptionId', 'planCode', 'subscriptionStatus', 'email', 'name', 'organizationName'];
        foreach ($required as $key) {
            if (blank($signup[$key] ?? null)) {
                throw new SagaPlatformException('PRODUCT_PROVISIONING_CONTEXT_INCOMPLETE', 409);
            }
        }
        if (! isset($verification['lifecycleVersion']) || (int) $verification['lifecycleVersion'] < 1
            || blank($verification['trialEndsAt'] ?? null)) {
            throw new SagaPlatformException('PLT_CONTRACT_RESPONSE_INCOMPLETE', 503);
        }

        return DB::transaction(function () use ($signup, $verification): SagaPlatformAccount {
            $existing = SagaPlatformAccount::query()
                ->where('central_product_account_id', $signup['productAccountId'])
                ->lockForUpdate()
                ->first();
            if ($existing) {
                $this->assertSameBinding($existing, $signup);

                return $existing;
            }

            $email = Str::lower(trim((string) $signup['email']));
            $user = User::query()->where('central_user_id', $signup['platformUserId'])->lockForUpdate()->first();
            if (! $user) {
                $user = User::query()->whereRaw('LOWER(email) = ?', [$email])->lockForUpdate()->first();
            }
            if ($user && $user->central_user_id && $user->central_user_id !== $signup['platformUserId']) {
                throw new SagaPlatformException('PRODUCT_IDENTITY_BINDING_CONFLICT', 409);
            }
            if ($user && ! $user->central_user_id && $user->organizations()->exists()) {
                throw new SagaPlatformException('PRODUCT_IDENTITY_REVIEW_REQUIRED', 409);
            }
            if (! $user) {
                $user = User::query()->create([
                    'central_user_id' => $signup['platformUserId'],
                    'name' => trim((string) $signup['name']),
                    'email' => $email,
                    'password' => null,
                    'global_role' => 'owner',
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]);
            } else {
                $user->forceFill([
                    'central_user_id' => $signup['platformUserId'],
                    'email_verified_at' => $user->email_verified_at ?: now(),
                    'is_active' => true,
                ])->save();
            }

            $organization = Organization::query()
                ->where('central_organization_id', $signup['organizationId'])
                ->lockForUpdate()
                ->first();
            if (! $organization) {
                $organization = Organization::query()->create([
                    'central_organization_id' => $signup['organizationId'],
                    'name' => trim((string) $signup['organizationName']),
                    'slug' => $this->uniqueOrganizationSlug((string) $signup['organizationName']),
                    'business_type' => $signup['businessType'] ?? 'fnb',
                    'status' => 'active',
                    'plan_key' => $signup['planCode'],
                    'locale' => $signup['locale'] ?? 'id',
                    'currency' => 'IDR',
                    'default_timezone' => $signup['timezone'] ?? 'Asia/Jakarta',
                    'onboarding_status' => 'setup',
                    'pilot_status' => 'not_ready',
                    'attention_status' => 'clear',
                ]);
            }

            $organization->users()->syncWithoutDetaching([
                $user->id => [
                    'role' => 'owner',
                    'status' => 'active',
                    'is_primary' => true,
                    'accepted_at' => now(),
                    'deactivated_at' => null,
                ],
            ]);

            $workspaceId = $signup['workspaceId'] ?? null;
            $location = $workspaceId
                ? Location::query()->where('central_workspace_id', $workspaceId)->lockForUpdate()->first()
                : null;
            $location ??= Location::query()->create([
                'organization_id' => $organization->id,
                'central_workspace_id' => $workspaceId,
                'name' => 'Main Outlet',
                'slug' => 'main-outlet',
                'timezone' => $signup['timezone'] ?? 'Asia/Jakarta',
                'is_default' => true,
                'is_active' => true,
            ]);

            Catalog::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'slug' => 'main-menu'],
                [
                    'location_id' => $location->id,
                    'name' => 'Main Menu',
                    'vertical' => $signup['businessType'] ?? 'fnb',
                    'status' => 'draft',
                    'store_display_enabled' => true,
                    'mobile_catalog_enabled' => true,
                    'default_view_mode' => 'photo',
                ],
            );

            $trialEndsAt = $verification['trialEndsAt'] ?? null;
            Subscription::query()->updateOrCreate(
                ['organization_id' => $organization->id],
                [
                    'central_subscription_id' => $signup['subscriptionId'] ?? null,
                    'plan_key' => $signup['planCode'],
                    'status' => $signup['subscriptionStatus'],
                    'starts_at' => now(),
                    'ends_at' => $trialEndsAt,
                    'entitlements' => null,
                ],
            );

            return SagaPlatformAccount::query()->create([
                'user_id' => $user->id,
                'organization_id' => $organization->id,
                'location_id' => $location->id,
                'central_user_id' => $signup['platformUserId'],
                'central_organization_id' => $signup['organizationId'],
                'central_workspace_id' => $workspaceId,
                'central_product_account_id' => $signup['productAccountId'],
                'central_subscription_id' => $signup['subscriptionId'] ?? null,
                'status' => $signup['subscriptionStatus'],
                'lifecycle_version' => (int) $verification['lifecycleVersion'],
                'trial_ends_at' => $trialEndsAt,
                'last_synced_at' => now(),
            ]);
        });
    }

    private function assertSameBinding(SagaPlatformAccount $account, array $signup): void
    {
        if ($account->central_user_id !== $signup['platformUserId']
            || $account->central_organization_id !== $signup['organizationId']
            || ($account->central_subscription_id && $account->central_subscription_id !== $signup['subscriptionId'])) {
            throw new SagaPlatformException('PRODUCT_ACCOUNT_BINDING_CONFLICT', 409);
        }
    }

    private function uniqueOrganizationSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'business';
        $slug = $base;
        $suffix = 2;
        while (Organization::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }
}
