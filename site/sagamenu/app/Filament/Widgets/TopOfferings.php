<?php

namespace App\Filament\Widgets;

use App\Models\AnalyticsEvent;
use App\Services\TenantContext;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class TopOfferings extends TableWidget
{
    protected static ?string $heading = 'Recent catalog interactions';

    public function table(Table $table): Table
    {
        $organizationId = app(TenantContext::class)->organizationId(auth()->user());

        return $table
            ->query(AnalyticsEvent::query()->when($organizationId, fn ($query) => $query->where('organization_id', $organizationId))->latest('occurred_at'))
            ->columns([
                TextColumn::make('event_name')->label('Event')->badge(),
                TextColumn::make('offering_slug')->label('Offering')->placeholder('-'),
                TextColumn::make('surface')->badge(),
                TextColumn::make('occurred_at')->label('Time')->since(),
            ])
            ->paginated([5]);
    }
}
