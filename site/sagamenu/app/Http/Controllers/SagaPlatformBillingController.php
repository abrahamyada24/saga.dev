<?php

namespace App\Http\Controllers;

use App\Exceptions\SagaPlatformException;
use App\Models\SagaPlatformAccount;
use App\Services\SagaPlatform\SagaPlatformAccessProjector;
use App\Services\SagaPlatform\SagaPlatformCheckoutService;
use App\Services\SagaPlatform\SagaPlatformClient;
use App\Services\SagaPlatform\SagaPlatformContract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SagaPlatformBillingController extends Controller
{
    public function __construct(
        private readonly SagaPlatformClient $platform,
        private readonly SagaPlatformCheckoutService $checkouts,
        private readonly SagaPlatformContract $contract,
        private readonly SagaPlatformAccessProjector $access,
    ) {}

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
        if (! $user->isSagaDevAdmin() && $user->roleFor($organization) !== 'owner') {
            return response()->json(['error' => ['code' => 'PRODUCT_OWNER_REQUIRED']], 403);
        }

        $planKey = $data['plan_code'].':'.$data['billing_cycle'];
        $plans = config('sagamenu.saga_platform.checkout_plans', []);
        $amount = is_array($plans) ? ($plans[$planKey] ?? null) : null;
        if (! is_int($amount) || $amount < 1000) {
            return response()->json(['error' => ['code' => 'PRODUCT_PLAN_NOT_CONFIGURED']], 422);
        }

        try {
            $attempt = $this->checkouts->create(
                $account,
                $user,
                $data['plan_code'],
                $data['billing_cycle'],
                $amount,
            );
        } catch (SagaPlatformException $exception) {
            return response()->json([
                'error' => ['code' => $this->safeCode($exception)],
            ], $exception->httpStatus >= 400 && $exception->httpStatus < 600 ? $exception->httpStatus : 503);
        }

        return response()->json([
            'data' => [
                'status' => $attempt->status,
                'reference' => $attempt->central_reference,
                'checkout_url' => $attempt->checkout_url,
                'expires_at' => $attempt->expires_at?->utc()->toIso8601ZuluString(),
                'gateway_mode' => $attempt->gateway_mode,
            ],
        ], 201);
    }

    public function lifecycle(Request $request, string $action): JsonResponse
    {
        if (! in_array($action, ['suspend', 'resume', 'cancel'], true)) {
            abort(404);
        }
        $user = $request->user();
        $organization = $user?->currentOrganization();
        if (! $organization || (! $user->isSagaDevAdmin() && $user->roleFor($organization) !== 'owner')) {
            return response()->json(['error' => ['code' => 'PRODUCT_OWNER_REQUIRED']], 403);
        }
        $account = SagaPlatformAccount::query()->where('organization_id', $organization->id)->first();
        if (! $account || ! $account->central_subscription_id) {
            return response()->json(['error' => ['code' => 'PRODUCT_SUBSCRIPTION_MAPPING_REQUIRED']], 409);
        }

        try {
            $payload = $this->contract->lifecycle(
                $this->platform->changeSubscription($account->central_subscription_id, $action),
            );
            $updated = $this->access->applyLifecycleResponse($account, $payload);
        } catch (SagaPlatformException $exception) {
            return response()->json(
                ['error' => ['code' => $this->safeCode($exception)]],
                $exception->httpStatus >= 400 && $exception->httpStatus < 600 ? $exception->httpStatus : 503,
            );
        }

        return response()->json([
            'data' => [
                'subscription_id' => $updated->central_subscription_id,
                'status' => $updated->status,
                'version' => $updated->lifecycle_version,
            ],
        ]);
    }

    private function safeCode(SagaPlatformException $exception): string
    {
        return in_array($exception->safeCode, [
            'PLT_IDEMPOTENCY_CONFLICT',
            'PLT_PRODUCT_ACCOUNT_NOT_FOUND',
            'PLT_SUBSCRIPTION_INVALID_STATE',
            'PLT_DEPENDENCY_UNAVAILABLE',
            'PRODUCT_STALE_LIFECYCLE_UPDATE',
            'PRODUCT_ACCOUNT_BINDING_CONFLICT',
            'PLT_CONTRACT_RESPONSE_INCOMPLETE',
        ], true) ? $exception->safeCode : 'PLT_REQUEST_INVALID';
    }
}
