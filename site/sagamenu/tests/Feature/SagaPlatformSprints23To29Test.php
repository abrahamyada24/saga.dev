<?php

namespace Tests\Feature;

use App\Exceptions\SagaPlatformException;
use App\Models\Organization;
use App\Models\SagaPlatformAccount;
use App\Models\SagaPlatformCheckoutAttempt;
use App\Models\SagaPlatformMigrationCandidate;
use App\Models\User;
use App\Services\SagaPlatform\SagaMenuProvisioner;
use App\Services\SagaPlatform\SagaPlatformAccessProjector;
use App\Services\SagaPlatform\SagaPlatformContract;
use App\Services\SagaPlatform\SagaPlatformMigrationAuditor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class SagaPlatformSprints23To29Test extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'sagamenu.saga_platform.enabled' => true,
            'sagamenu.saga_platform.base_url' => 'https://platform.test',
            'sagamenu.saga_platform.product_code' => 'sagamenu',
            'sagamenu.saga_platform.key_id' => 'sagamenu-local-test-key',
            'sagamenu.saga_platform.hmac_secret' => 'local-test-secret-never-used-outside-tests',
            'sagamenu.saga_platform.retry_attempts' => 1,
            'sagamenu.saga_platform.checkout_plans' => ['sagamenu_pro:monthly' => 199000],
        ]);
    }

    public function test_final_canonical_fields_are_required_and_no_status_is_defaulted(): void
    {
        $contract = app(SagaPlatformContract::class);

        try {
            $contract->verification([
                'productAccountId' => 'account',
                'subscriptionId' => 'subscription',
                'planCode' => 'sagamenu_trial',
                'subscriptionStatus' => 'trialing',
                'trialEndsAt' => now()->addDays(14)->toIso8601String(),
            ]);
            $this->fail('Missing lifecycleVersion must fail closed.');
        } catch (SagaPlatformException $exception) {
            $this->assertSame('PLT_CONTRACT_RESPONSE_INCOMPLETE', $exception->safeCode);
        }

        $this->expectException(SagaPlatformException::class);
        $contract->verification([
            'productAccountId' => 'account',
            'subscriptionId' => 'subscription',
            'planCode' => 'sagamenu_trial',
            'subscriptionStatus' => 'invented_default',
            'lifecycleVersion' => 2,
            'trialEndsAt' => now()->addDays(14)->toIso8601String(),
        ]);
    }

    public function test_local_contract_rehearsal_exercises_all_canonical_calls_without_domain_writes(): void
    {
        $this->artisan('sagamenu:saga-platform-rehearse')
            ->expectsOutputToContain('"status": "passed"')
            ->assertSuccessful();

        $this->assertCount(8, Http::recorded());
        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseCount('organizations', 0);
    }

    public function test_versioned_access_projection_applies_new_state_and_rejects_stale_state(): void
    {
        $account = $this->provisionAccount();
        $projector = app(SagaPlatformAccessProjector::class);
        $applied = $projector->applyAccessSnapshot([
            'productAccountId' => $account->central_product_account_id,
            'subscriptionId' => $account->central_subscription_id,
            'planCode' => 'sagamenu_pro',
            'subscriptionStatus' => 'active',
            'lifecycleVersion' => 3,
            'trialEndsAt' => now()->addDays(30)->utc()->toIso8601ZuluString(),
            'entitlementVersion' => 7,
            'entitlements' => ['catalog.limit' => 10],
            'quotaPolicy' => ['media.storage_mb' => 2048],
            'licenseStatus' => 'valid',
        ], 'event-access-003');

        $this->assertSame(['status' => 'applied', 'appliedVersion' => 3], $applied);
        $this->assertDatabaseHas('saga_platform_accounts', [
            'id' => $account->id,
            'plan_code' => 'sagamenu_pro',
            'status' => 'active',
            'lifecycle_version' => 3,
            'entitlement_version' => 7,
        ]);

        $stale = $projector->applyAccessSnapshot([
            'productAccountId' => $account->central_product_account_id,
            'subscriptionId' => $account->central_subscription_id,
            'planCode' => 'sagamenu_trial',
            'subscriptionStatus' => 'trialing',
            'lifecycleVersion' => 2,
            'trialEndsAt' => now()->addDays(1)->utc()->toIso8601ZuluString(),
        ], 'event-access-002');
        $this->assertSame(['status' => 'stale', 'appliedVersion' => 3], $stale);
        $this->assertSame('sagamenu_pro', $account->fresh()->plan_code);
    }

    public function test_checkout_is_owner_only_and_uses_a_persistent_idempotency_ledger(): void
    {
        $account = $this->provisionAccount();
        $manager = User::factory()->create(['email_verified_at' => now(), 'is_active' => true]);
        $account->organization->users()->attach($manager->id, [
            'role' => 'manager',
            'status' => 'active',
            'is_primary' => true,
            'accepted_at' => now(),
        ]);
        $this->actingAs($manager)->postJson('/billing/subscription-checkout', [
            'plan_code' => 'sagamenu_pro',
            'billing_cycle' => 'monthly',
        ])->assertForbidden()->assertJsonPath('error.code', 'PRODUCT_OWNER_REQUIRED');

        Http::fakeSequence()
            ->push(['error' => ['code' => 'PLT_DEPENDENCY_UNAVAILABLE', 'retryable' => true]], 503)
            ->push(['data' => [
                'status' => 'pending',
                'reference' => 'LOCAL-RETRY',
                'checkoutUrl' => 'https://checkout.example.test/local-retry',
                'gatewayMode' => 'dry_run',
            ]], 201);
        $payload = ['plan_code' => 'sagamenu_pro', 'billing_cycle' => 'monthly'];
        $this->actingAs($account->user)->postJson('/billing/subscription-checkout', $payload)
            ->assertServiceUnavailable();
        $this->actingAs($account->user)->postJson('/billing/subscription-checkout', $payload)
            ->assertCreated()->assertJsonPath('data.reference', 'LOCAL-RETRY');

        $this->assertDatabaseCount('saga_platform_checkout_attempts', 1);
        $attempt = SagaPlatformCheckoutAttempt::query()->firstOrFail();
        $this->assertSame('pending', $attempt->status);
        $requests = Http::recorded();
        $this->assertSame(
            $requests[0][0]->header('Idempotency-Key')[0],
            $requests[1][0]->header('Idempotency-Key')[0],
        );
        $this->assertSame(199000, $requests[1][0]->data()['amount']);
    }

    public function test_subscription_lifecycle_is_applied_only_from_canonical_central_response(): void
    {
        $account = $this->provisionAccount();
        Http::fake(fn () => Http::response(['data' => [
            'subscriptionId' => $account->central_subscription_id,
            'status' => 'suspended',
            'version' => 3,
            'idempotentReplay' => false,
        ]]));

        $this->actingAs($account->user)->postJson('/billing/subscription/suspend')
            ->assertOk()
            ->assertJsonPath('data.status', 'suspended')
            ->assertJsonPath('data.version', 3);
        $this->assertSame('suspended', $account->fresh()->status);
        $this->assertDatabaseHas('subscriptions', [
            'organization_id' => $account->organization_id,
            'status' => 'suspended',
            'central_version' => 3,
        ]);
    }

    public function test_legacy_migration_inventory_is_pii_safe_and_write_is_explicit(): void
    {
        $legacy = $this->legacyOwner('legacy-owner@example.test');

        $summary = app(SagaPlatformMigrationAuditor::class)->inventory();
        $this->assertSame(1, $summary['eligible']);
        $this->artisan('sagamenu:saga-platform-migration-audit')
            ->expectsOutputToContain('"mode": "dry_run"')
            ->assertSuccessful();
        $this->assertDatabaseCount('saga_platform_migration_candidates', 0);

        $this->artisan('sagamenu:saga-platform-migration-audit --write')
            ->expectsOutputToContain('"mode": "write_local_candidates"')
            ->assertSuccessful();
        $candidate = SagaPlatformMigrationCandidate::query()->firstOrFail();
        $this->assertSame('eligible', $candidate->state);
        $this->assertNotSame(hash('sha256', strtolower($legacy->email)), $candidate->email_fingerprint);
    }

    public function test_legacy_login_fallback_is_bounded_and_never_used_for_central_accounts(): void
    {
        $legacy = $this->legacyOwner('compatibility@example.test');
        config([
            'sagamenu.saga_platform.legacy_login_compatibility_enabled' => true,
            'sagamenu.saga_platform.legacy_login_compatibility_ends_at' => now()->addDay()->toIso8601String(),
        ]);
        Http::fake(fn () => Http::response([
            'error' => ['code' => 'PLT_AUTH_FAILED', 'retryable' => false],
        ], 401));

        $this->post('/login', [
            'email' => $legacy->email,
            'password' => 'legacy-password-123',
        ])->assertRedirect('/admin');
        $this->assertAuthenticatedAs($legacy);
        $this->assertSame('legacy_compatibility', session('saga_platform.session_origin'));

        auth()->logout();
        config(['sagamenu.saga_platform.legacy_login_compatibility_ends_at' => now()->subMinute()->toIso8601String()]);
        $this->post('/login', [
            'email' => $legacy->email,
            'password' => 'legacy-password-123',
        ])->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_restricted_central_account_cannot_keep_an_admin_session(): void
    {
        $account = $this->provisionAccount();
        $account->update(['status' => 'expired']);

        $this->actingAs($account->user)
            ->withSession(['saga_platform.session' => [
                'central_user_id' => $account->central_user_id,
                'central_organization_id' => $account->central_organization_id,
                'central_product_account_id' => $account->central_product_account_id,
            ]])
            ->get('/admin')
            ->assertRedirect(route('saga-platform.account-status'));
        $this->assertGuest();
        $this->get('/account-status')
            ->assertOk()
            ->assertSee('Masa akses telah berakhir')
            ->assertSee('Konten menu lokal tetap tersimpan');
    }

    public function test_branded_auth_screens_expose_accessible_states_on_mobile_safe_markup(): void
    {
        $this->get('/signup')
            ->assertOk()
            ->assertSee('aria-labelledby="auth-title"', false)
            ->assertSee('autocomplete="organization"', false)
            ->assertSee('id="password-hint"', false)
            ->assertSee('kebijakan privasi');
        $this->get('/login')
            ->assertOk()
            ->assertSee('autocomplete="current-password"', false);
        $this->withSession(['saga_platform.restricted_status' => 'suspended'])
            ->get('/account-status')
            ->assertOk()
            ->assertSee('Akun sedang ditangguhkan');
    }

    public function test_filament_login_cannot_bypass_branded_central_or_legacy_compatibility_flow(): void
    {
        $this->get('/admin/login')->assertRedirect(route('saga-platform.login.show'));

        $legacy = $this->legacyOwner('blocked-local-login@example.test');
        $this->actingAs($legacy)->get('/admin')->assertForbidden();

        config([
            'sagamenu.saga_platform.legacy_login_compatibility_enabled' => true,
            'sagamenu.saga_platform.legacy_login_compatibility_ends_at' => now()->addDay()->toIso8601String(),
        ]);
        $this->actingAs($legacy)
            ->withSession(['saga_platform.session_origin' => 'legacy_compatibility'])
            ->get('/admin')
            ->assertOk();
    }

    private function provisionAccount(): SagaPlatformAccount
    {
        $subscriptionId = (string) Str::ulid();
        $accountId = (string) Str::ulid();

        return app(SagaMenuProvisioner::class)->provision([
            'signupAttemptId' => (string) Str::ulid(),
            'platformUserId' => (string) Str::ulid(),
            'organizationId' => (string) Str::ulid(),
            'workspaceId' => (string) Str::ulid(),
            'productAccountId' => $accountId,
            'subscriptionId' => $subscriptionId,
            'planCode' => 'sagamenu_trial',
            'subscriptionStatus' => 'trialing',
            'lifecycleVersion' => 1,
            'email' => 'owner-'.Str::lower(Str::random(8)).'@example.test',
            'name' => 'Central Owner',
            'organizationName' => 'Saga Test '.Str::upper(Str::random(5)),
            'businessType' => 'fnb',
            'locale' => 'id',
            'timezone' => 'Asia/Jakarta',
        ], [
            'productAccountId' => $accountId,
            'subscriptionId' => $subscriptionId,
            'planCode' => 'sagamenu_trial',
            'subscriptionStatus' => 'trialing',
            'lifecycleVersion' => 2,
            'trialEndsAt' => now()->addDays(14)->utc()->toIso8601ZuluString(),
        ])->load(['user', 'organization.subscription']);
    }

    private function legacyOwner(string $email): User
    {
        $user = User::factory()->create([
            'central_user_id' => null,
            'email' => $email,
            'email_verified_at' => now(),
            'password' => Hash::make('legacy-password-123'),
            'is_active' => true,
        ]);
        $organization = Organization::query()->create([
            'name' => 'Legacy Organization '.Str::upper(Str::random(4)),
            'slug' => 'legacy-'.Str::lower(Str::random(8)),
            'business_type' => 'fnb',
        ]);
        $organization->users()->attach($user->id, [
            'role' => 'owner',
            'status' => 'active',
            'is_primary' => true,
            'accepted_at' => now(),
        ]);

        return $user;
    }
}
