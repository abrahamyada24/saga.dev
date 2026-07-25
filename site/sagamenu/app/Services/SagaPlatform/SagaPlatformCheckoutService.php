<?php

namespace App\Services\SagaPlatform;

use App\Exceptions\SagaPlatformException;
use App\Models\SagaPlatformAccount;
use App\Models\SagaPlatformCheckoutAttempt;
use App\Models\User;
use Illuminate\Support\Str;

class SagaPlatformCheckoutService
{
    public function __construct(
        private readonly SagaPlatformClient $platform,
        private readonly SagaPlatformContract $contract,
    ) {}

    public function create(
        SagaPlatformAccount $account,
        User $owner,
        string $planCode,
        string $billingCycle,
        int $amount,
    ): SagaPlatformCheckoutAttempt {
        $requestHash = hash('sha256', implode('|', [
            $account->central_subscription_id,
            $account->lifecycle_version,
            $planCode,
            $billingCycle,
            $amount,
        ]));
        $attempt = SagaPlatformCheckoutAttempt::query()
            ->where('saga_platform_account_id', $account->id)
            ->where('request_hash', $requestHash)
            ->latest('id')
            ->first();
        $attempt ??= SagaPlatformCheckoutAttempt::query()->create([
            'saga_platform_account_id' => $account->id,
            'idempotency_key' => 'sagamenu-checkout-'.Str::lower((string) Str::ulid()),
            'request_hash' => $requestHash,
            'plan_code' => $planCode,
            'billing_cycle' => $billingCycle,
            'amount' => $amount,
            'status' => 'pending',
        ]);

        try {
            $checkout = $this->contract->checkout($this->platform->createSubscriptionCheckout([
                'idempotencyKey' => $attempt->idempotency_key,
                'subscriptionId' => $account->central_subscription_id,
                'planCode' => $planCode,
                'billingCycle' => $billingCycle,
                'amount' => $amount,
                'customerName' => $owner->name,
                'customerEmail' => $owner->email,
            ]));
        } catch (SagaPlatformException $exception) {
            $attempt->forceFill([
                'status' => 'failed',
                'safe_error_code' => $exception->safeCode,
                'attempted_at' => now(),
            ])->save();

            throw $exception;
        }

        $attempt->forceFill([
            'status' => $checkout['status'],
            'central_reference' => $checkout['reference'],
            'checkout_url' => $this->safeCheckoutUrl($checkout['checkoutUrl'] ?? null),
            'expires_at' => $checkout['expiresAt'] ?? null,
            'gateway_mode' => $checkout['gatewayMode'],
            'safe_error_code' => null,
            'attempted_at' => now(),
            'completed_at' => in_array($checkout['status'], ['paid', 'completed'], true) ? now() : null,
        ])->save();

        return $attempt;
    }

    private function safeCheckoutUrl(mixed $url): ?string
    {
        if (! is_string($url) || ! filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        return parse_url($url, PHP_URL_SCHEME) === 'https' ? $url : null;
    }
}
