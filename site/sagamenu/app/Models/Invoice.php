<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;

#[Guarded([])]
class Invoice extends Model
{
    protected function casts(): array
    {
        return ['due_date' => 'date', 'paid_at' => 'datetime'];
    }
}
