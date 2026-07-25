<?php

namespace App\Http\Controllers;

use App\Exceptions\SagaPlatformException;
use App\Models\SagaPlatformAccount;
use App\Services\SagaPlatform\SagaPlatformClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SagaPlatformBillingController extends Controller
{
    public function __construct(private readonly SagaPlatformClient $platform) {}

    public function checkout(Request $request): JsonResponse
    {
        $data = $request->validate([
            'plan_code' => ['required', 'string', 'max:96'],
            'billing_cycle' => ['required', 'in:monthly,annual'],
        ]);
        $user = $request->user();
        $organization = $user?->currentOrganization();
        $account = $organization
            ? SagaPlatformAccount::query()->where('organization_id', $organization->id)->first()
            : null;
        if (! $account || ! $account->central_subscription_id) {
            return response()->json(['error' => ['code' => 'PRODUCT_SUBSCRIPTION_MAPPING_REQUIRED']], 409);
        }

        $planKey = $data['plan_code'].':'.$data['billing_cycle'];
        $plans = config('sagamenu.saga_platform.checkout_plans', []);
        $amount = is_array($plans) ? ($plans[$planKey] ?? null) : null;
        if (! is_int($amount) || $amount < 1000) {
            return response()->json(['error' => ['code' => 'PRODUCT_PLAN_NOT_CONFIGURED']], 422);
        }

        $sessionKey = 'saga_platform.checkout_idempotency.'.hash('sha256', $account->id.'|'.$planKey);
        $idempotencyKey = $request->session()->get($sessionKey);
        if (! is_string($idempotencyKey)) {
            $idempotencyKey = 'sagamenu-checkout-'.Str::lower((string) Str::ulid());
            $request->session()->put($sessionKey, $idempotencyKey);
        }

        try {
            $checkout = $this->platform->createSubscriptionCheckout([
                'idempotencyKey' => $idempotencyKey,
                'subscriptionId' => $account->central_subscription_id,
                'planCode' => $data['plan_code'],
                'billingCycle' => $data['billing_cycle'],
                'amount' => $amount,
                'customerName' => $user->name,
                'customerEmail' => $user->email,
            ]);
        } catch (SagaPlatformException $exception) {
            return response()->json([
                'error' => ['code' => $this->safeCode($exception)],
            ], $exception->httpStatus >= 400 && $exception->httpStatus < 600 ? $exception->httpStatus : 503);
        }

        return response()->json([
            'data' => [
                'status' => $checkout['status'] ?? 'pending',
                'reference' => $checkout['reference'] ?? null,
                'checkout_url' => $this->safeCheckoutUrl($checkout['checkoutUrl'] ?? null),
                'expires_at' => $checkout['expiresAt'] ?? null,
                'gateway_mode' => $checkout['gatewayMode'] ?? null,
            ],
        ], 201);
    }

    private function safeCheckoutUrl(mixed $url): ?string
    {
        if (! is_string($url) || ! filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        return parse_url($url, PHP_URL_SCHEME) === 'https' ? $url : null;
    }

    private function safeCode(SagaPlatformException $exception): string
    {
        return in_array($exception->safeCode, [
            'PLT_IDEMPOTENCY_CONFLICT',
            'PLT_PRODUCT_ACCOUNT_NOT_FOUND',
            'PLT_SUBSCRIPTION_INVALID_STATE',
            'PLT_DEPENDENCY_UNAVAILABLE',
        ], true) ? $exception->safeCode : 'PLT_REQUEST_INVALID';
    }
}
