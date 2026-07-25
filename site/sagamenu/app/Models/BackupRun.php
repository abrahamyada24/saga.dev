<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;

#[Guarded([])]
class BackupRun extends Model
{
    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }
}
