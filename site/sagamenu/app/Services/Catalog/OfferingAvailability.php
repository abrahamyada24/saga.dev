<?php

namespace App\Services\Catalog;

final class OfferingAvailability
{
    /**
     * @var array<string, array{label: string, description: string, is_available: bool, tone: string, filament_color: string}>
     */
    private const STATES = [
        'available' => [
            'label' => 'Tersedia',
            'description' => 'Menu tersedia untuk dilihat customer.',
            'is_available' => true,
            'tone' => 'available',
            'filament_color' => 'success',
        ],
        'sold_out' => [
            'label' => 'Sold out',
            'description' => 'Menu tetap terlihat, tetapi ditandai habis.',
            'is_available' => false,
            'tone' => 'unavailable',
            'filament_color' => 'danger',
        ],
        'temporary' => [
            'label' => 'Sementara tidak tersedia',
            'description' => 'Menu tetap terlihat dengan status sementara.',
            'is_available' => false,
            'tone' => 'unavailable',
            'filament_color' => 'warning',
        ],
        'coming_soon' => [
            'label' => 'Segera hadir',
            'description' => 'Menu dapat dikenalkan sebelum mulai tersedia.',
            'is_available' => false,
            'tone' => 'informational',
            'filament_color' => 'info',
        ],
        'seasonal' => [
            'label' => 'Menu musiman',
            'description' => 'Menu tersedia selama periode tayangnya.',
            'is_available' => true,
            'tone' => 'informational',
            'filament_color' => 'info',
        ],
    ];

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::STATES)
            ->mapWithKeys(fn (array $state, string $key): array => [$key => $state['label']])
            ->all();
    }

    /**
     * @return array<int, string>
     */
    public static function allowed(): array
    {
        return array_keys(self::STATES);
    }

    /**
     * @return array{key: string, label: string, description: string, is_available: bool, tone: string, filament_color: string}
     */
    public function resolve(mixed $value): array
    {
        if (is_string($value) && isset(self::STATES[$value])) {
            return ['key' => $value, ...self::STATES[$value]];
        }

        return [
            'key' => 'unknown',
            'label' => 'Ketersediaan belum dikonfirmasi',
            'description' => 'Tanyakan status menu ini kepada staf.',
            'is_available' => false,
            'tone' => 'unavailable',
            'filament_color' => 'danger',
        ];
    }

    /**
     * @return array{key: string, label: string, description: string, is_available: bool, tone: string}
     */
    public function publicState(mixed $value): array
    {
        $state = $this->resolve($value);

        return [
            'key' => $state['key'],
            'label' => $state['label'],
            'description' => $state['description'],
            'is_available' => $state['is_available'],
            'tone' => $state['tone'],
        ];
    }
}
