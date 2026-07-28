<?php

return [
    'commercial' => [
        'approved_trial_days' => 14,
        'public_catalog_allowed_statuses' => ['active', 'trialing'],
        'maintenance_retry_after_seconds' => 3600,
    ],
    'saga_platform' => [
        'enabled' => filter_var(env('SAGAMENU_SAGA_PLATFORM_ENABLED', false), FILTER_VALIDATE_BOOLEAN),
        'base_url' => rtrim((string) env('SAGAMENU_SAGA_PLATFORM_BASE_URL', ''), '/'),
        'product_code' => env('SAGAMENU_SAGA_PLATFORM_PRODUCT_CODE', 'sagamenu'),
        'key_id' => env('SAGAMENU_SAGA_PLATFORM_KEY_ID'),
        'hmac_secret' => env('SAGAMENU_SAGA_PLATFORM_HMAC_SECRET'),
        'contract_version' => env('SAGAMENU_SAGA_PLATFORM_CONTRACT_VERSION', '1.0'),
        'issuer' => env('SAGAMENU_SAGA_PLATFORM_ISSUER', 'saga-platform'),
        'audience' => env('SAGAMENU_SAGA_PLATFORM_AUDIENCE', 'sagamenu-web'),
        'plan_code' => blank(env('SAGAMENU_SAGA_PLATFORM_PLAN_CODE'))
            ? null
            : env('SAGAMENU_SAGA_PLATFORM_PLAN_CODE'),
        'terms_version' => env('SAGAMENU_SAGA_PLATFORM_TERMS_VERSION', '2026-07-16'),
        'connect_timeout_seconds' => (int) env('SAGAMENU_SAGA_PLATFORM_CONNECT_TIMEOUT_SECONDS', 3),
        'timeout_seconds' => (int) env('SAGAMENU_SAGA_PLATFORM_TIMEOUT_SECONDS', 10),
        'retry_attempts' => (int) env('SAGAMENU_SAGA_PLATFORM_RETRY_ATTEMPTS', 3),
        'retry_delay_milliseconds' => (int) env('SAGAMENU_SAGA_PLATFORM_RETRY_DELAY_MILLISECONDS', 200),
        'assertion_max_ttl_seconds' => (int) env('SAGAMENU_SAGA_PLATFORM_ASSERTION_MAX_TTL_SECONDS', 300),
        'checkout_plans' => json_decode((string) env('SAGAMENU_SAGA_PLATFORM_CHECKOUT_PLANS_JSON', '{}'), true) ?: [],
        'legacy_login_compatibility_enabled' => filter_var(
            env('SAGAMENU_LEGACY_LOGIN_COMPATIBILITY_ENABLED', false),
            FILTER_VALIDATE_BOOLEAN,
        ),
        'legacy_login_compatibility_ends_at' => env(
            'SAGAMENU_LEGACY_LOGIN_COMPATIBILITY_ENDS_AT',
            '2026-08-01T23:59:59+07:00',
        ),
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
    'media' => [
        'image_max_kb' => (int) env('SAGAMENU_IMAGE_MAX_KB', 5120),
        'video_max_kb' => (int) env('SAGAMENU_VIDEO_MAX_KB', 51200),
        'video_max_duration_seconds' => (int) env('SAGAMENU_VIDEO_MAX_DURATION_SECONDS', 60),
        'video_processing_required' => filter_var(
            env('SAGAMENU_VIDEO_PROCESSING_REQUIRED', true),
            FILTER_VALIDATE_BOOLEAN,
        ),
    ],
];
