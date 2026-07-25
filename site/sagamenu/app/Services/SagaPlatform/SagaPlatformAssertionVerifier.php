<?php

namespace App\Services\SagaPlatform;

use App\Exceptions\SagaPlatformException;
use Illuminate\Support\Facades\Cache;
use JsonException;

class SagaPlatformAssertionVerifier
{
    public function verify(string $assertion): array
    {
        $parts = explode('.', $assertion);
        if (count($parts) !== 3 || $parts[0] !== 'v1') {
            throw new SagaPlatformException('PLT_ASSERTION_INVALID', 401);
        }

        [$version, $encoded, $providedSignature] = $parts;
        $expectedSignature = $this->base64UrlEncode(hash_hmac(
            'sha256',
            $version.'.'.$encoded,
            (string) config('sagamenu.saga_platform.hmac_secret'),
            true,
        ));
        if (! hash_equals($expectedSignature, $providedSignature)) {
            throw new SagaPlatformException('PLT_ASSERTION_INVALID', 401);
        }

        try {
            $decoded = $this->base64UrlDecode($encoded);
            $claims = json_decode($decoded, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw new SagaPlatformException('PLT_ASSERTION_INVALID', 401);
        }

        if (! is_array($claims)) {
            throw new SagaPlatformException('PLT_ASSERTION_INVALID', 401);
        }

        $now = now()->timestamp;
        $issuedAt = filter_var($claims['iat'] ?? null, FILTER_VALIDATE_INT);
        $expiresAt = filter_var($claims['exp'] ?? null, FILTER_VALIDATE_INT);
        $maxTtl = max(60, (int) config('sagamenu.saga_platform.assertion_max_ttl_seconds', 300));
        $valid = ($claims['iss'] ?? null) === config('sagamenu.saga_platform.issuer', 'saga-platform')
            && ($claims['aud'] ?? null) === config('sagamenu.saga_platform.audience', 'sagamenu-web')
            && ($claims['product'] ?? null) === config('sagamenu.saga_platform.product_code', 'sagamenu')
            && is_string($claims['sub'] ?? null)
            && is_string($claims['organization_id'] ?? null)
            && is_string($claims['product_account_id'] ?? null)
            && is_string($claims['jti'] ?? null)
            && $issuedAt !== false
            && $expiresAt !== false
            && $issuedAt <= $now + 30
            && $expiresAt > $now
            && $expiresAt - $issuedAt <= $maxTtl;
        if (! $valid) {
            throw new SagaPlatformException('PLT_ASSERTION_INVALID', 401);
        }

        $replayKey = 'sagamenu:saga-platform:assertion-jti:'.hash('sha256', (string) $claims['jti']);
        if (! Cache::add($replayKey, true, max(60, $expiresAt - $now + 30))) {
            throw new SagaPlatformException('PLT_ASSERTION_REPLAYED', 401);
        }

        return $claims;
    }

    private function base64UrlDecode(string $value): string
    {
        $padded = str_pad($value, strlen($value) + ((4 - strlen($value) % 4) % 4), '=', STR_PAD_RIGHT);
        $decoded = base64_decode(strtr($padded, '-_', '+/'), true);
        if ($decoded === false) {
            throw new SagaPlatformException('PLT_ASSERTION_INVALID', 401);
        }

        return $decoded;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
