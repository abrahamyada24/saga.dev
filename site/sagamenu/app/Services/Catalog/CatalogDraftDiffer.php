<?php

namespace App\Services\Catalog;

use App\Models\Catalog;
use App\Services\Publishing\CatalogSnapshotBuilder;

class CatalogDraftDiffer
{
    public function __construct(private readonly CatalogSnapshotBuilder $builder) {}

    /**
     * @return array<int, array{path: string, group: string, before: mixed, after: mixed}>
     */
    public function diff(Catalog $catalog): array
    {
        $before = $catalog->activeSnapshot?->payload ?? [];
        $after = $this->builder->build($catalog);
        unset($before['generated_at'], $after['generated_at']);

        $changes = [];
        $this->walk($before, $after, '', $changes);

        return array_slice($changes, 0, 500);
    }

    /**
     * @param  array<int, array{path: string, group: string, before: mixed, after: mixed}>  $changes
     */
    private function walk(mixed $before, mixed $after, string $path, array &$changes): void
    {
        if (count($changes) >= 500 || $before === $after) {
            return;
        }

        if (is_array($before) && is_array($after)) {
            foreach (array_unique([...array_keys($before), ...array_keys($after)]) as $key) {
                $nextPath = $path === '' ? (string) $key : "{$path}.{$key}";
                $this->walk($before[$key] ?? null, $after[$key] ?? null, $nextPath, $changes);
            }

            return;
        }

        $changes[] = [
            'path' => $path,
            'group' => $this->groupFor($path),
            'before' => $before,
            'after' => $after,
        ];
    }

    private function groupFor(string $path): string
    {
        return match (true) {
            str_contains($path, 'appearance') => 'appearance',
            str_contains($path, 'availability'), str_contains($path, 'price') => 'operations',
            str_contains($path, 'collections') => 'structure',
            default => 'content',
        };
    }
}
