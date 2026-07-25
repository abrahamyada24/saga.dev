<?php

return [
    'saga_platform' => [
        'enabled' => filter_var(env('SAGAMENU_SAGA_PLATFORM_ENABLED', false), FILTER_VALIDATE_BOOLEAN),
        'base_url' => rtrim((string) env('SAGAMENU_SAGA_PLATFORM_BASE_URL', ''), '/'),
        'product_code' => env('SAGAMENU_SAGA_PLATFORM_PRODUCT_CODE', 'sagamenu'),
        'key_id' => env('SAGAMENU_SAGA_PLATFORM_KEY_ID'),
        'hmac_secret' => env('SAGAMENU_SAGA_PLATFORM_HMAC_SECRET'),
        'contract_version' => env('SAGAMENU_SAGA_PLATFORM_CONTRACT_VERSION', '1.0'),
        'issuer' => env('SAGAMENU_SAGA_PLATFORM_ISSUER', 'saga-platform'),
        'audience' => env('SAGAMENU_SAGA_PLATFORM_AUDIENCE', 'sagamenu-web'),
        'plan_code' => env('SAGAMENU_SAGA_PLATFORM_PLAN_CODE'),
        'terms_version' => env('SAGAMENU_SAGA_PLATFORM_TERMS_VERSION', '2026-07-16'),
        'connect_timeout_seconds' => (int) env('SAGAMENU_SAGA_PLATFORM_CONNECT_TIMEOUT_SECONDS', 3),
        'timeout_seconds' => (int) env('SAGAMENU_SAGA_PLATFORM_TIMEOUT_SECONDS', 10),
        'retry_attempts' => (int) env('SAGAMENU_SAGA_PLATFORM_RETRY_ATTEMPTS', 3),
        'retry_delay_milliseconds' => (int) env('SAGAMENU_SAGA_PLATFORM_RETRY_DELAY_MILLISECONDS', 200),
        'assertion_max_ttl_seconds' => (int) env('SAGAMENU_SAGA_PLATFORM_ASSERTION_MAX_TTL_SECONDS', 300),
        'checkout_plans' => json_decode((string) env('SAGAMENU_SAGA_PLATFORM_CHECKOUT_PLANS_JSON', '{}'), true) ?: [],
    ],
    'backup' => [
        'disk' => env('SAGAMENU_BACKUP_DISK'),
        'max_age_hours' => (int) env('SAGAMENU_BACKUP_MAX_AGE_HOURS', 26),
    ],
    'monitoring' => [
        'webhook_url' => env('SAGAMENU_MONITORING_WEBHOOK_URL'),
        'scheduler_max_age_minutes' => (int) env('SAGAMENU_SCHEDULER_MAX_AGE_MINUTES', 10),
    ],
    'malware' => [
        'enabled' => (bool) env('SAGAMENU_CLAMAV_ENABLED', false),
        'required' => (bool) env('SAGAMENU_CLAMAV_REQUIRED', false),
        'binary' => env('SAGAMENU_CLAMAV_BINARY', 'clamscan'),
    ],
];
