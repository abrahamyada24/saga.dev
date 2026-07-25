<?php

namespace App\Services\SagaPlatform;

use App\Models\Organization;

class PublicCatalogAccessPolicy
{
    public function shouldShowMaintenance(Organization $organization): bool
    {
        $organization->loadMissing(['sagaPlatformAccount', 'subscription']);
        $account = $organization->sagaPlatformAccount;
        if (! $account) {
            return false;
        }

        $allowed = config('sagamenu.commercial.public_catalog_allowed_statuses', ['active', 'trialing']);
        if (! is_array($allowed) || ! in_array($account->status, $allowed, true)) {
            return true;
        }

        $subscription = $organization->subscription;
        if (blank($account->central_subscription_id)
            || ! $subscription
            || $subscription->central_subscription_id !== $account->central_subscription_id
            || ! in_array($subscription->status, $allowed, true)) {
            return true;
        }

        return false;
    }
}
