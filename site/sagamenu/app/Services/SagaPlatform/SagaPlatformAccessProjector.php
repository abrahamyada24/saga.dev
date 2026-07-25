<?php

namespace App\Services\SagaPlatform;

use App\Exceptions\SagaPlatformException;
use App\Models\SagaPlatformAccount;
use App\Models\SagaPlatformSyncEvent;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;

class SagaPlatformAccessProjector
{
    public function __construct(private readonly SagaPlatformContract $contract) {}

    public function applyAccessSnapshot(array $payload, ?string $eventId = null): array
    {
        $payload = $this->contract->accessProjection($payload);

        return DB::transaction(function () use ($payload, $eventId): array {
            $account = SagaPlatformAccount::query()
                ->where('central_product_account_id', $payload['productAccountId'])
                ->lockForUpdate()
                ->first();
            if (! $account || $account->central_subscription_id !== $payload['subscriptionId']) {
                throw new SagaPlatformException('PRODUCT_ACCOUNT_BINDING_CONFLICT', 409);
            }

            $digest = $this->digest($payload);
            if ($eventId) {
                $existingEvent = SagaPlatformSyncEvent::query()->where('central_event_id', $eventId)->first();
                if ($existingEvent) {
                    if (! hash_equals($existingEvent->payload_digest, $digest)) {
                        throw new SagaPlatformException('PLT_IDEMPOTENCY_CONFLICT', 409);
                    }

                    return ['status' => 'duplicate', 'appliedVersion' => $account->lifecycle_version];
                }
            }

            $incomingVersion = $payload['lifecycleVersion'];
            if ($incomingVersion < $account->lifecycle_version) {
                $this->record($account, $eventId, $incomingVersion, $digest, 'stale', 'PRODUCT_STALE_LIFECYCLE_UPDATE');

                return ['status' => 'stale', 'appliedVersion' => $account->lifecycle_version];
            }
            if ($incomingVersion === $account->lifecycle_version) {
                $matches = $account->plan_code === $payload['planCode']
                    && $account->status === $payload['subscriptionStatus'];
                if (! $matches) {
                    throw new SagaPlatformException('PRODUCT_LIFECYCLE_VERSION_CONFLICT', 409);
                }
                $this->record($account, $eventId, $incomingVersion, $digest, 'duplicate');

                return ['status' => 'duplicate', 'appliedVersion' => $account->lifecycle_version];
            }

            $entitlementVersion = $payload['entitlementVersion'] ?? $account->entitlement_version;
            if ($entitlementVersion < $account->entitlement_version) {
                throw new SagaPlatformException('PRODUCT_STALE_ENTITLEMENT_UPDATE', 409);
            }

            $account->forceFill([
                'status' => $payload['subscriptionStatus'],
                'plan_code' => $payload['planCode'],
                'lifecycle_version' => $incomingVersion,
                'trial_ends_at' => $payload['trialEndsAt'],
                'entitlement_version' => $entitlementVersion,
                'entitlements' => $payload['entitlements'] ?? $account->entitlements,
                'quota_policy' => $payload['quotaPolicy'] ?? $account->quota_policy,
                'license_status' => $payload['licenseStatus'] ?? $account->license_status,
                'lifecycle_reason' => $payload['reasonCode'] ?? null,
                'last_synced_at' => now(),
                'access_synced_at' => now(),
            ])->save();

            Subscription::query()->where('organization_id', $account->organization_id)->update([
                'plan_key' => $payload['planCode'],
                'status' => $payload['subscriptionStatus'],
                'ends_at' => $payload['trialEndsAt'],
                'central_version' => $incomingVersion,
                'entitlements' => $payload['entitlements'] ?? $account->entitlements,
                'quota_policy' => $payload['quotaPolicy'] ?? $account->quota_policy,
                'license_status' => $payload['licenseStatus'] ?? $account->license_status,
                'updated_at' => now(),
            ]);
            $this->record($account, $eventId, $incomingVersion, $digest, 'applied');

            return ['status' => 'applied', 'appliedVersion' => $incomingVersion];
        });
    }

    public function applyLifecycleResponse(SagaPlatformAccount $account, array $payload): SagaPlatformAccount
    {
        $payload = $this->contract->lifecycle($payload);
        if ($payload['subscriptionId'] !== $account->central_subscription_id) {
            throw new SagaPlatformException('PRODUCT_ACCOUNT_BINDING_CONFLICT', 409);
        }

        return DB::transaction(function () use ($account, $payload): SagaPlatformAccount {
            $locked = SagaPlatformAccount::query()->lockForUpdate()->findOrFail($account->id);
            if ($payload['version'] < $locked->lifecycle_version) {
                throw new SagaPlatformException('PRODUCT_STALE_LIFECYCLE_UPDATE', 409);
            }

            $locked->forceFill([
                'status' => $payload['status'],
                'lifecycle_version' => $payload['version'],
                'last_synced_at' => now(),
            ])->save();
            Subscription::query()->where('organization_id', $locked->organization_id)->update([
                'status' => $payload['status'],
                'central_version' => $payload['version'],
                'updated_at' => now(),
            ]);

            return $locked;
        });
    }

    public function canAuthenticate(SagaPlatformAccount $account): bool
    {
        return in_array($account->status, ['active', 'trialing'], true);
    }

    private function record(
        SagaPlatformAccount $account,
        ?string $eventId,
        int $version,
        string $digest,
        string $status,
        ?string $safeErrorCode = null,
    ): void {
        SagaPlatformSyncEvent::query()->create([
            'saga_platform_account_id' => $account->id,
            'central_event_id' => $eventId,
            'event_type' => 'access_projection',
            'central_version' => $version,
            'payload_digest' => $digest,
            'status' => $status,
            'safe_error_code' => $safeErrorCode,
            'applied_at' => $status === 'applied' ? now() : null,
        ]);
    }

    private function digest(array $payload): string
    {
        ksort($payload);

        return hash('sha256', json_encode($payload, JSON_THROW_ON_ERROR));
    }
}
