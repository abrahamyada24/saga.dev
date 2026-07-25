<?php

namespace App\Services\SagaPlatform;

use App\Exceptions\SagaPlatformException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use JsonException;

class SagaPlatformClient
{
    public function signup(array $payload): array
    {
        return $this->request('POST', $this->productPath('signups'), $payload);
    }

    public function verify(string $verificationToken): array
    {
        return $this->request('POST', $this->productPath('verifications'), [
            'verificationToken' => $verificationToken,
        ]);
    }

    public function createSession(string $email, string $password, string $requestNonce): array
    {
        return $this->request('POST', $this->productPath('sessions'), [
            'email' => $email,
            'password' => $password,
            'requestNonce' => $requestNonce,
        ]);
    }

    public function exchangeSession(string $opaqueExchangeCode, string $requestNonce): array
    {
        return $this->request('POST', $this->productPath('sessions/exchange'), [
            'opaqueExchangeCode' => $opaqueExchangeCode,
            'requestNonce' => $requestNonce,
        ]);
    }

    public function reportProvisioning(array $payload): array
    {
        return $this->request('POST', $this->productPath('provisioning-results'), $payload);
    }

    public function createSubscriptionCheckout(array $payload): array
    {
        return $this->request('POST', $this->productPath('subscription-checkouts'), $payload);
    }

    public function changeSubscription(string $subscriptionId, string $action): array
    {
        if (! in_array($action, ['suspend', 'resume', 'cancel'], true)) {
            throw new SagaPlatformException('PLT_REQUEST_INVALID', 422);
        }

        $path = $this->productPath('subscriptions/'.rawurlencode($subscriptionId).'/'.$action);

        return $this->request('POST', $path, []);
    }

    public function putUsageSnapshot(array $payload): array
    {
        return $this->request('PUT', $this->productPath('usage-snapshots'), $payload);
    }

    public function request(string $method, string $path, array $payload): array
    {
        $this->assertConfigured();

        try {
            $body = json_encode($payload, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw new SagaPlatformException('PLT_REQUEST_INVALID', 422);
        }

        $method = strtoupper($method);
        $correlationId = (string) Str::ulid();
        $keyId = (string) config('sagamenu.saga_platform.key_id');

        $attempts = max(1, (int) config('sagamenu.saga_platform.retry_attempts', 3));
        for ($attempt = 1; $attempt <= $attempts; $attempt++) {
            $headers = $this->signedHeaders(
                $method,
                $path,
                $body,
                $keyId,
                $correlationId,
                is_string($payload['idempotencyKey'] ?? null) ? $payload['idempotencyKey'] : null,
            );
            try {
                $response = Http::connectTimeout(max(1, (int) config('sagamenu.saga_platform.connect_timeout_seconds', 3)))
                    ->timeout(max(1, (int) config('sagamenu.saga_platform.timeout_seconds', 10)))
                    ->withHeaders($headers)
                    ->withBody($body, 'application/json')
                    ->send($method, $this->baseUrl().$path);
            } catch (ConnectionException) {
                if ($attempt === $attempts) {
                    throw new SagaPlatformException('PLT_DEPENDENCY_UNAVAILABLE', 503, true);
                }

                $this->backoff($attempt);

                continue;
            }

            if (($response->status() === 429 || $response->serverError()) && $attempt < $attempts) {
                $this->backoff($attempt);

                continue;
            }

            return $this->unwrap($response);
        }

        throw new SagaPlatformException('PLT_DEPENDENCY_UNAVAILABLE', 503, true);
    }

    private function unwrap(Response $response): array
    {
        $payload = $response->json();
        if ($response->successful() && is_array(data_get($payload, 'data'))) {
            return data_get($payload, 'data');
        }

        $safeCode = (string) data_get($payload, 'error.code', 'PLT_DEPENDENCY_UNAVAILABLE');
        if (! preg_match('/^(PLT|PRODUCT)_[A-Z0-9_]+$/', $safeCode)) {
            $safeCode = 'PLT_DEPENDENCY_UNAVAILABLE';
        }

        throw new SagaPlatformException(
            $safeCode,
            $response->status() >= 400 ? $response->status() : 503,
            (bool) data_get($payload, 'error.retryable', $response->serverError()),
        );
    }

    private function productPath(string $suffix): string
    {
        $productCode = rawurlencode((string) config('sagamenu.saga_platform.product_code', 'sagamenu'));

        return "/internal/v1/products/{$productCode}/{$suffix}";
    }

    private function baseUrl(): string
    {
        return rtrim((string) config('sagamenu.saga_platform.base_url'), '/');
    }

    private function assertConfigured(): void
    {
        if (! config('sagamenu.saga_platform.enabled')) {
            throw new SagaPlatformException('PRODUCT_INTEGRATION_DISABLED', 404);
        }

        foreach (['base_url', 'key_id', 'hmac_secret'] as $key) {
            if (trim((string) config("sagamenu.saga_platform.{$key}")) === '') {
                throw new SagaPlatformException('PLT_CONFIGURATION_INCOMPLETE', 503);
            }
        }
    }

    private function backoff(int $attempt): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        $delay = max(0, (int) config('sagamenu.saga_platform.retry_delay_milliseconds', 200));
        usleep($delay * $attempt * 1000);
    }

    private function signedHeaders(
        string $method,
        string $path,
        string $body,
        string $keyId,
        string $correlationId,
        ?string $idempotencyKey,
    ): array {
        $timestamp = now()->utc()->toIso8601ZuluString();
        $nonce = (string) Str::ulid();
        $canonical = implode("\n", [
            $timestamp,
            $nonce,
            $keyId,
            $method,
            $path,
            hash('sha256', $body),
        ]);

        $headers = [
            'Accept' => 'application/json',
            'X-Saga-Key-Id' => $keyId,
            'X-Saga-Timestamp' => $timestamp,
            'X-Saga-Nonce' => $nonce,
            'X-Saga-Signature' => 'v1='.hash_hmac('sha256', $canonical, (string) config('sagamenu.saga_platform.hmac_secret')),
            'X-Saga-Contract-Version' => (string) config('sagamenu.saga_platform.contract_version', '1.0'),
            'X-Correlation-Id' => $correlationId,
            'X-Content-SHA256' => hash('sha256', $body),
        ];
        if (is_string($idempotencyKey) && strlen($idempotencyKey) >= 16 && strlen($idempotencyKey) <= 128) {
            $headers['Idempotency-Key'] = $idempotencyKey;
        }

        return $headers;
    }
}
