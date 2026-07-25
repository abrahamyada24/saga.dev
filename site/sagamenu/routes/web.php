<?php

use App\Http\Controllers\InvitationController;
use App\Http\Controllers\PublicCatalogController;
use App\Http\Controllers\QrRedirectController;
use App\Http\Controllers\SagaPlatformAuthController;
use App\Http\Controllers\SagaPlatformBillingController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/admin');

Route::middleware(['saga-platform.enabled', 'throttle:20,1'])->group(function (): void {
    Route::get('/signup', [SagaPlatformAuthController::class, 'showSignup'])->name('saga-platform.signup.show');
    Route::post('/signup', [SagaPlatformAuthController::class, 'signup'])->name('saga-platform.signup');
    Route::get('/login', [SagaPlatformAuthController::class, 'showLogin'])->name('saga-platform.login.show');
    Route::post('/login', [SagaPlatformAuthController::class, 'login'])->name('saga-platform.login');
    Route::get('/account-status', [SagaPlatformAuthController::class, 'showAccountStatus'])->name('saga-platform.account-status');
    Route::get('/verify-email', [SagaPlatformAuthController::class, 'showVerify'])->name('saga-platform.verify.show');
    Route::post('/verify-email', [SagaPlatformAuthController::class, 'verify'])->name('saga-platform.verify');
    Route::post('/provisioning/retry', [SagaPlatformAuthController::class, 'retryProvisioning'])->name('saga-platform.provisioning.retry');
});

Route::post('/billing/subscription-checkout', [SagaPlatformBillingController::class, 'checkout'])
    ->middleware(['saga-platform.enabled:auth', 'throttle:10,1'])
    ->name('saga-platform.billing.checkout');
Route::post('/billing/subscription/{action}', [SagaPlatformBillingController::class, 'lifecycle'])
    ->whereIn('action', ['suspend', 'resume', 'cancel'])
    ->middleware(['saga-platform.enabled:auth', 'throttle:10,1'])
    ->name('saga-platform.billing.lifecycle');

Route::get('/invitations/{token}/accept', [InvitationController::class, 'accept'])
    ->middleware(['auth', 'throttle:10,1'])
    ->name('invitations.accept');

Route::middleware('public.security')->group(function (): void {
    Route::get('/s/{brand}/{catalog}', [PublicCatalogController::class, 'store'])->name('public.store-display');
    Route::get('/m/{brand}/{catalog}', [PublicCatalogController::class, 'mobile'])->name('public.mobile-catalog');
    Route::get('/preview/{token}', [PublicCatalogController::class, 'preview'])->middleware('throttle:preview')->name('public.preview');
    Route::view('/privacy', 'public.privacy')->name('privacy');
});

Route::get('/q/{code}', [QrRedirectController::class, 'redirect'])
    ->middleware(['throttle:qr', 'public.security'])
    ->name('qr.redirect');
Route::get('/q/{code}/download', [QrRedirectController::class, 'download'])
    ->middleware('auth')
    ->name('qr.download');
