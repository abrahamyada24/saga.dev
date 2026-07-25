<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('sagamenu:analytics-rollup')->dailyAt('00:15')->withoutOverlapping();
Schedule::command('sagamenu:heartbeat')->everyMinute()->withoutOverlapping();
Schedule::command('model:prune')->dailyAt('02:15');
Schedule::command('sagamenu:backup')->dailyAt('01:15')->withoutOverlapping();
Schedule::command('sagamenu:monitor')->everyFiveMinutes()->withoutOverlapping();
Schedule::command('sagamenu:saga-platform-usage')
    ->dailyAt('02:45')
    ->when(fn () => config('sagamenu.saga_platform.enabled'))
    ->withoutOverlapping();
