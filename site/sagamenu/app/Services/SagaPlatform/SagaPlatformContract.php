<?php

namespace App\Services\SagaPlatform;

use App\Exceptions\SagaPlatformException;
use DateTimeImmutable;
use Throwable;

class SagaPlatformContract
{
    public const SUBSCRIPTION_STATUSES = [
        'pending_verification',
        'provisioning_pending',
        'trialing',
        'active',
        'past_due',
        'expired',
        'suspended',
        'cancelled',
        'reactivated',
        'provisioning_failed',
    ];

    public function signup(array $payload): array
    {
        $this->requireStrings($payload, [
            'signupAttemptId',
            'platformUserId',
            'organizationId',
            'workspaceId',
            'productAccountId',
            'subscriptionId',
            'planCode',
            'subscriptionStatus',
        ]);
        $this->requirePositiveVersion($payload, 'lifecycleVersion');
        $this->requireSubscriptionStatus($payload['subscriptionStatus']);

        return $payload;
    }

    public function verification(array $payload): array
    {
        $this->requireStrings($payload, [
            'productAccountId',
            'subscriptionId',
            'planCode',
            'subscriptionStatus',
            'trialEndsAt',
        ]);
        $this->requirePositiveVersion($payload, 'lifecycleVersion');
        $this->requireSubscriptionStatus($payload['subscriptionStatus']);
        $this->requireDate($payload['trialEndsAt']);

        return $payload;
    }

    public function provisioning(array $payload): array
    {
        $this->requireStrings($payload, ['productAccountId', 'status']);
        $this->requirePositiveVersion($payload, 'lifecycleVersion');
        if (! in_array($payload['status'], ['linked', 'ready'], true)) {
            $this->incomplete();
        }

        return $payload;
    }

    public function session(array $payload): array
    {
        $this->requireStrings($payload, ['status', 'opaqueExchangeCode']);
        if ($payload['status'] !== 'exchange_required' || strlen($payload['opaqueExchangeCode']) < 32) {
            $this->incomplete();
        }

        return $payload;
    }

    public function exchange(array $payload): array
    {
        $this->requireStrings($payload, ['signedAssertion']);
        if (! str_starts_with($payload['signedAssertion'], 'v1.')) {
            $this->incomplete();
        }

        return $payload;
    }

    public function checkout(array $payload): array
    {
        $this->requireStrings($payload, ['status', 'reference', 'gatewayMode']);
        if (array_key_exists('expiresAt', $payload) && filled($payload['expiresAt'])) {
            $this->requireDate($payload['expiresAt']);
        }

        return $payload;
    }

    public function lifecycle(array $payload): array
    {
        $this->requireStrings($payload, ['subscriptionId', 'status']);
        $this->requirePositiveVersion($payload, 'version');
        $this->requireSubscriptionStatus($payload['status']);

        return $payload;
    }

    public function usageAcknowledgement(array $payload): array
    {
        if (($payload['accepted'] ?? null) !== true) {
            $this->incomplete();
        }

        return $payload;
    }

    public function accessProjection(array $payload): array
    {
        $this->requireStrings($payload, [
            'productAccountId',
            'subscriptionId',
            'planCode',
            'subscriptionStatus',
            'trialEndsAt',
        ]);
        $this->requirePositiveVersion($payload, 'lifecycleVersion');
        $this->requireSubscriptionStatus($payload['subscriptionStatus']);
        $this->requireDate($payload['trialEndsAt']);

        foreach (['entitlements', 'quotaPolicy'] as $field) {
            if (array_key_exists($field, $payload) && ! is_array($payload[$field])) {
                $this->incomplete();
            }
        }
        if (array_key_exists('entitlementVersion', $payload)
            && (! is_int($payload['entitlementVersion']) || $payload['entitlementVersion'] < 0)) {
            $this->incomplete();
        }

        return $payload;
    }

    private function requireStrings(array $payload, array $fields): void
    {
        foreach ($fields as $field) {
            if (! array_key_exists($field, $payload)
                || ! is_string($payload[$field])
                || trim($payload[$field]) === '') {
                $this->incomplete();
            }
        }
    }

    private function requirePositiveVersion(array $payload, string $field): void
    {
        if (! array_key_exists($field, $payload)
            || ! is_int($payload[$field])
            || $payload[$field] < 1) {
            $this->incomplete();
        }
    }

    private function requireSubscriptionStatus(string $status): void
    {
        if (! in_array($status, self::SUBSCRIPTION_STATUSES, true)) {
            $this->incomplete();
        }
    }

    private function requireDate(string $value): void
    {
        try {
            new DateTimeImmutable($value);
        } catch (Throwable) {
            $this->incomplete();
        }
    }

    private function incomplete(): never
    {
        throw new SagaPlatformException('PLT_CONTRACT_RESPONSE_INCOMPLETE', 503);
    }
}
