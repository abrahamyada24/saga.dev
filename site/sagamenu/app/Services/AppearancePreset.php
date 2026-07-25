<?php

namespace App\Services;

use App\Models\Catalog;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AppearancePreset
{
    public const PRESETS = [
        'warm_minimal' => [
            'primary_color' => '#a4492d',
            'accent_color' => '#28665b',
            'paper_color' => '#f7f3ed',
            'heading_font' => 'Instrument Sans',
            'body_font' => 'Instrument Sans',
            'density' => 'comfortable',
            'image_treatment' => 'natural',
        ],
        'bold_street' => [
            'primary_color' => '#d5432f',
            'accent_color' => '#176b87',
            'paper_color' => '#f4f1e9',
            'heading_font' => 'Inter',
            'body_font' => 'Inter',
            'density' => 'compact',
            'image_treatment' => 'high_contrast',
        ],
        'clean_premium' => [
            'primary_color' => '#1f4c3f',
            'accent_color' => '#9b6b2f',
            'paper_color' => '#f7f7f4',
            'heading_font' => 'Georgia',
            'body_font' => 'Instrument Sans',
            'density' => 'comfortable',
            'image_treatment' => 'soft',
        ],
    ];

    public function apply(Catalog $catalog, string $preset, User $actor): Catalog
    {
        if (! isset(self::PRESETS[$preset])) {
            throw ValidationException::withMessages(['preset' => 'Unknown appearance preset.']);
        }

        $before = $catalog->appearance ?? [];
        $catalog->update(['appearance' => ['preset' => $preset, ...self::PRESETS[$preset]]]);
        app(AuditLogger::class)->log($catalog, 'catalog.appearance_preset_applied', $actor, null, $before, $catalog->appearance);

        return $catalog->fresh();
    }
}
