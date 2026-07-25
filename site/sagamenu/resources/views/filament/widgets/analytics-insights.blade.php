<x-filament-widgets::widget>
    <x-filament::section heading="Catalog insights (30 days)" description="Aggregated from privacy-minimal daily rollups.">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            @foreach ($insights as $title => $rows)
                <div class="rounded-lg border border-gray-200 p-4 dark:border-white/10">
                    <h3 class="text-sm font-semibold text-gray-950 dark:text-white">{{ $title }}</h3>
                    @if (count($rows))
                        <ol class="mt-3 space-y-2">
                            @foreach ($rows as $row)
                                <li class="flex items-center justify-between gap-3 text-sm">
                                    <span class="min-w-0 truncate text-gray-700 dark:text-gray-300">{{ $row['key'] }}</span>
                                    <span class="tabular-nums font-semibold text-gray-950 dark:text-white">{{ number_format($row['count']) }}</span>
                                </li>
                            @endforeach
                        </ol>
                    @else
                        <p class="mt-3 text-sm text-gray-500">Belum ada data.</p>
                    @endif
                </div>
            @endforeach
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
