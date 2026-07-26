<?php

namespace App\Services;

use App\Models\Catalog;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AppearancePreset
{
    public const PRESETS = [
        'editorial_kv' => [
            'primary_color' => '#236354',
            'accent_color' => '#cbf45a',
            'paper_color' => '#f3f5f1',
            'heading_font' => 'Plus Jakarta Sans',
            'body_font' => 'Plus Jakarta Sans',
            'density' => 'comfortable',
            'image_treatment' => 'natural',
            'mobile_layout' => 'editorial_list',
            'store_layout' => 'editorial_grid',
        ],
        'warm_minimal' => [
            'primary_color' => '#a4492d',
            'accent_color' => '#28665b',
            'paper_color' => '#f7f3ed',
            'heading_font' => 'Plus Jakarta Sans',
            'body_font' => 'Plus Jakarta Sans',
            'density' => 'comfortable',
            'image_treatment' => 'natural',
            'mobile_layout' => 'photo_grid',
            'store_layout' => 'editorial_grid',
        ],
        'bold_street' => [
            'primary_color' => '#d5432f',
            'accent_color' => '#176b87',
            'paper_color' => '#f4f1e9',
            'heading_font' => 'Plus Jakarta Sans',
            'body_font' => 'Plus Jakarta Sans',
            'density' => 'compact',
            'image_treatment' => 'high_contrast',
            'mobile_layout' => 'photo_grid',
            'store_layout' => 'photo_grid',
        ],
        'clean_premium' => [
            'primary_color' => '#1f4c3f',
            'accent_color' => '#9b6b2f',
            'paper_color' => '#f7f7f4',
            'heading_font' => 'Georgia',
            'body_font' => 'Plus Jakarta Sans',
            'density' => 'comfortable',
            'image_treatment' => 'soft',
            'mobile_layout' => 'editorial_list',
            'store_layout' => 'editorial_grid',
        ],
        'modern_cafe' => [
            'primary_color' => '#1f574c',
            'accent_color' => '#ed6b4c',
            'paper_color' => '#f5f7f4',
            'heading_font' => 'Plus Jakarta Sans',
            'body_font' => 'Plus Jakarta Sans',
            'density' => 'comfortable',
            'image_treatment' => 'natural',
            'mobile_layout' => 'photo_grid',
            'store_layout' => 'photo_grid',
        ],
        'playful_pop' => [
            'primary_color' => '#5636a5',
            'accent_color' => '#f3c63d',
            'paper_color' => '#f7f4ff',
            'heading_font' => 'Plus Jakarta Sans',
            'body_font' => 'Plus Jakarta Sans',
            'density' => 'comfortable',
            'image_treatment' => 'high_contrast',
            'mobile_layout' => 'photo_grid',
            'store_layout' => 'editorial_grid',
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
