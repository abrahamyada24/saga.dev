<?php

namespace App\Services\Catalog;

use App\Models\Catalog;
use App\Models\Offering;

class CatalogHealthValidator
{
    /**
     * @return array<int, array{id: string, severity: string, code: string, title: string, detail: string, offering_id?: int}>
     */
    public function validate(Catalog $catalog): array
    {
        $catalog->load([
            'organization',
            'collections',
            'offerings.primaryCollection',
            'offerings.media.mediaAsset',
            'offerings.translations',
        ]);

        $issues = [];
        if ($catalog->collections->where('is_visible', true)->isEmpty()) {
            $issues[] = $this->issue('catalog:no-visible-collection', 'blocking', 'no_visible_collection', 'Belum ada kategori aktif', $catalog->name);
        }

        foreach ($catalog->offerings->whereNull('archived_at') as $offering) {
            $issues = [...$issues, ...$this->offeringIssues($catalog, $offering)];
        }

        $appearance = $catalog->appearance ?? [];
        $foreground = $appearance['ink'] ?? '#20231f';
        $background = $appearance['paper'] ?? '#ffffff';
        $ratio = $this->contrastRatio($foreground, $background);
        if ($ratio < 4.5) {
            $issues[] = $this->issue(
                'catalog:contrast',
                'blocking',
                'contrast',
                'Kontras teks belum memenuhi target',
                sprintf('Rasio %.2f:1; target minimal 4.5:1.', $ratio),
            );
        }

        return $issues;
    }

    public function hasBlockingIssues(Catalog $catalog): bool
    {
        return collect($this->validate($catalog))->contains('severity', 'blocking');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function offeringIssues(Catalog $catalog, Offering $offering): array
    {
        $issues = [];
        if (! trim((string) $offering->name)) {
            $issues[] = $this->offeringIssue($offering, 'blocking', 'missing_name', 'Nama menu belum diisi');
        }
        if (! $offering->primaryCollection || $offering->primaryCollection->catalog_id !== $catalog->id) {
            $issues[] = $this->offeringIssue($offering, 'blocking', 'invalid_category', 'Kategori menu tidak valid');
        }
        if (in_array($offering->price_type, ['fixed', 'starting_from', 'range'], true) && $offering->price_min_minor === null) {
            $issues[] = $this->offeringIssue($offering, 'blocking', 'missing_price', 'Harga menu belum diisi');
        }
        if (! trim((string) $offering->short_description)) {
            $issues[] = $this->offeringIssue($offering, 'warning', 'missing_description', 'Deskripsi menu belum lengkap');
        }

        $primaryImage = $offering->media->firstWhere('role', 'primary_image')?->mediaAsset;
        if (! $primaryImage) {
            $issues[] = $this->offeringIssue($offering, 'warning', 'missing_image', 'Foto utama belum tersedia');
        } elseif (! trim((string) $primaryImage->alt_text)) {
            $issues[] = $this->offeringIssue($offering, 'warning', 'missing_alt', 'Alt text foto belum lengkap');
        }

        $video = $offering->media->first(fn ($media) => $media->mediaAsset?->type === 'video')?->mediaAsset;
        $defaultLocale = $catalog->organization?->locale ?? 'id';
        $defaultTranslation = $offering->translations->firstWhere('locale', $defaultLocale);
        if ($video && ! trim((string) $defaultTranslation?->video_transcript)) {
            $issues[] = $this->offeringIssue($offering, 'warning', 'missing_transcript', 'Video belum memiliki transcript');
        }

        $enabledLocales = array_values(array_filter(data_get($catalog->settings, 'enabled_locales', [$defaultLocale])));
        foreach (array_diff($enabledLocales, [$defaultLocale]) as $locale) {
            $translation = $offering->translations->firstWhere('locale', $locale);
            if (! $translation?->name || ! $translation?->short_description) {
                $issues[] = $this->offeringIssue($offering, 'warning', "translation_{$locale}", "Terjemahan {$locale} belum lengkap");
            }
        }

        if ($offering->available_from && $offering->available_until && $offering->available_from->gte($offering->available_until)) {
            $issues[] = $this->offeringIssue($offering, 'blocking', 'invalid_schedule', 'Waktu selesai harus setelah waktu mulai');
        }

        return $issues;
    }

    /**
     * @return array<string, mixed>
     */
    private function offeringIssue(Offering $offering, string $severity, string $code, string $title): array
    {
        return [
            ...$this->issue("offering:{$offering->id}:{$code}", $severity, $code, $title, $offering->name ?: "Offering #{$offering->id}"),
            'offering_id' => $offering->id,
        ];
    }

    /**
     * @return array{id: string, severity: string, code: string, title: string, detail: string}
     */
    private function issue(string $id, string $severity, string $code, string $title, string $detail): array
    {
        return compact('id', 'severity', 'code', 'title', 'detail');
    }

    private function contrastRatio(string $foreground, string $background): float
    {
        $first = $this->luminance($foreground);
        $second = $this->luminance($background);

        return (max($first, $second) + 0.05) / (min($first, $second) + 0.05);
    }

    private function luminance(string $hex): float
    {
        $hex = ltrim($hex, '#');
        if (! preg_match('/^[0-9a-f]{6}$/i', $hex)) {
            return 0;
        }

        $channels = array_map(
            fn (int $offset): float => hexdec(substr($hex, $offset, 2)) / 255,
            [0, 2, 4],
        );
        $channels = array_map(
            fn (float $value): float => $value <= 0.03928 ? $value / 12.92 : (($value + 0.055) / 1.055) ** 2.4,
            $channels,
        );

        return ($channels[0] * 0.2126) + ($channels[1] * 0.7152) + ($channels[2] * 0.0722);
    }
}
