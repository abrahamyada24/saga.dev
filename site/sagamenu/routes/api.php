<?php

use App\Http\Controllers\AnalyticsEventController;
use Illuminate\Support\Facades\Route;

Route::post('/events', AnalyticsEventController::class)
    ->middleware('throttle:analytics')
    ->name('analytics.events');
