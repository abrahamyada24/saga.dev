<!DOCTYPE html>
<html lang="{{ data_get($payload ?? [], 'organization.locale', 'id') }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="description" content="{{ data_get($payload ?? [], 'seo.description', 'Visual catalog powered by Saga Menu') }}">
    <meta name="theme-color" content="{{ data_get($payload ?? [], 'catalog.appearance.primary_color', '#236354') }}">
    @if (($surface ?? 'mobile') === 'store' || ($isPreview ?? false))
        <meta name="robots" content="noindex, nofollow">
    @else
        <meta name="robots" content="index, follow">
    @endif
    <title>@yield('title', data_get($payload ?? [], 'seo.title', 'Saga Menu'))</title>
    @php
        $appearance = data_get($payload ?? [], 'catalog.appearance', []);
        $safeColor = fn ($value, $fallback) => is_string($value) && preg_match('/^#[0-9a-fA-F]{6}$/', $value) ? $value : $fallback;
        $fontFormat = in_array(data_get($appearance, 'custom_font_format'), ['woff', 'woff2'], true)
            ? data_get($appearance, 'custom_font_format')
            : 'woff2';
        $fontAllowlist = ['Plus Jakarta Sans', 'Georgia'];
        $headingFont = in_array(data_get($appearance, 'heading_font'), $fontAllowlist, true) ? data_get($appearance, 'heading_font') : 'Plus Jakarta Sans';
        $bodyFont = in_array(data_get($appearance, 'body_font'), $fontAllowlist, true) ? data_get($appearance, 'body_font') : 'Plus Jakarta Sans';
    @endphp
    <style>
        @if (data_get($appearance, 'custom_font_enabled') && data_get($appearance, 'custom_font_url'))
        @font-face {
            font-family: 'SagaCustom';
            src: url('{{ data_get($appearance, 'custom_font_url') }}') format('{{ $fontFormat }}');
            font-display: swap;
        }
        @endif
        :root {
            --brand-primary: {{ $safeColor(data_get($appearance, 'primary_color'), '#236354') }};
            --brand-accent: {{ $safeColor(data_get($appearance, 'accent_color'), '#cbf45a') }};
            --brand-paper: {{ $safeColor(data_get($appearance, 'paper_color'), '#f3f5f1') }};
            --brand-heading-font: {{ data_get($appearance, 'custom_font_enabled') ? "'SagaCustom'" : "'{$headingFont}'" }}, ui-sans-serif, system-ui, sans-serif;
            --brand-body-font: '{{ $bodyFont }}', ui-sans-serif, system-ui, sans-serif;
        }
    </style>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body
    class="{{ ($surface ?? 'mobile') === 'store' ? 'store-surface' : 'mobile-surface' }}"
    data-analytics-endpoint="{{ $analyticsEndpoint ?? '' }}"
    data-brand="{{ data_get($payload ?? [], 'organization.slug') }}"
    data-catalog="{{ data_get($payload ?? [], 'catalog.slug') }}"
    data-surface="{{ $surface ?? 'mobile' }}"
    data-preview="{{ ($isPreview ?? false) ? 'true' : 'false' }}"
    data-density="{{ in_array(data_get($appearance, 'density'), ['comfortable', 'compact'], true) ? data_get($appearance, 'density') : 'comfortable' }}"
    data-image-treatment="{{ in_array(data_get($appearance, 'image_treatment'), ['natural', 'high_contrast', 'soft'], true) ? data_get($appearance, 'image_treatment') : 'natural' }}"
    data-mobile-layout="{{ in_array(data_get($appearance, 'mobile_layout'), ['editorial_list', 'photo_grid'], true) ? data_get($appearance, 'mobile_layout') : 'editorial_list' }}"
    data-store-layout="{{ in_array(data_get($appearance, 'store_layout'), ['editorial_grid', 'photo_grid'], true) ? data_get($appearance, 'store_layout') : 'editorial_grid' }}"
>
    @if ($isPreview ?? false)
        <div class="preview-banner" role="status">Draft preview. Perubahan ini belum tampil di halaman publik.</div>
    @endif
    @yield('body')
</body>
</html>
