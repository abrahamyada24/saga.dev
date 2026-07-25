<?php

namespace App\Filament\Widgets;

use App\Models\Organization;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class NeedsAttention extends TableWidget
{
    protected static ?string $heading = 'Needs Attention';

    protected static ?int $sort = -5;

    public static function canView(): bool
    {
        return auth()->user()?->isSagaDevAdmin() ?? false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(Organization::query()
                ->withCount(['supportIssues as open_support_issues_count' => fn (Builder $query) => $query->whereIn('status', ['open', 'in_progress'])])
                ->where(function (Builder $query): void {
                    $query->where('attention_status', 'open')
                        ->orWhere('onboarding_status', '!=', 'complete')
                        ->orWhere('pilot_status', '!=', 'approved')
                        ->orWhereHas('supportIssues', fn (Builder $issues) => $issues->whereIn('status', ['open', 'in_progress']));
                }))
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('onboarding_status')->label('Onboarding')->badge(),
                TextColumn::make('pilot_status')->label('Pilot')->badge(),
                TextColumn::make('open_support_issues_count')->label('Open support')->badge(),
                TextColumn::make('attention_reason')->label('Reason')->limit(60)->placeholder('Review setup or pilot status'),
            ])
            ->paginated([5]);
    }
}
