<?php

namespace App\Services;

use InvalidArgumentException;

class ExternalUrlSanitizer
{
    private const ALLOWED_LABELS = [
        'Info Toko',
        'Hubungi Bisnis',
        'Lihat Lokasi',
        'Tanya Staf',
        'Informasi Selengkapnya',
    ];

    public function validate(?string $label, ?string $url): ?string
    {
        if (! $label && ! $url) {
            return null;
        }

        if (! in_array($label, self::ALLOWED_LABELS, true)) {
            throw new InvalidArgumentException('Label action tidak termasuk allowlist preview-only.');
        }

        $normalized = trim((string) $url);
        $parts = parse_url($normalized);

        if (! $parts || ! in_array(strtolower($parts['scheme'] ?? ''), ['https', 'http'], true)) {
            throw new InvalidArgumentException('URL harus menggunakan HTTP atau HTTPS.');
        }

        return $normalized;
    }
}
