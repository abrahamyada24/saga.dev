<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;

#[Guarded([])]
class AnalyticsDailyRollup extends Model
{
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'top_collections' => 'array',
            'top_offerings' => 'array',
            'top_searches' => 'array',
            'qr_sources' => 'array',
            'video_plays' => 'integer',
            'sold_out_opens' => 'integer',
        ];
    }
}
