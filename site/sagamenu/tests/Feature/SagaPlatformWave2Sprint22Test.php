<?php

namespace Tests\Feature;

use App\Exceptions\SagaPlatformException;
use App\Models\AnalyticsEvent;
use App\Models\Catalog;
use App\Models\QrRoute;
use App\Models\SagaPlatformAccount;
use App\Models\User;
use App\Services\SagaPlatform\SagaMenuProvisioner;
use App\Services\SagaPlatform\SagaMenuUsageSnapshotBuilder;
use App\Services\SagaPlatform\SagaPlatformAssertionVerifier;
use App\Services\SagaPlatform\SagaPlatformClient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class SagaPlatformWave2Sprint22Test extends TestCase
{
    use RefreshDatabase;

    private string $secret = 'local-test-secret-that-never-leaves-the-server';

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'sagamenu.saga_platform.enabled' => true,
            'sagamenu.saga_platform.base_url' => 'https://platform.test',
            'sagamenu.saga_platform.product_code' => 'sagamenu',
            'sagamenu.saga_platform.key_id' => 'sagamenu-local-test-key',
            'sagamenu.saga_platform.hmac_secret' => $this->secret,
            'sagamenu.saga_platform.contract_version' => '1.0',
            'sagamenu.saga_platform.issuer' => 'saga-platform',
            'sagamenu.saga_platform.audience' => 'sagamenu-web',
            'sagamenu.saga_platform.retry_attempts' => 1,
            'sagamenu.saga_platform.checkout_plans' => [
                'sagamenu_pro:monthly' => 100000,
                'sagamenu_pro:annual' => 1000000,
            ],
        ]);
    }

    public function test_feature_flag_is_off_by_default_and_hides_branded_routes(): void
    {
        config(['sagamenu.saga_platform.enabled' => false]);

        $this->get('/signup')->assertNotFound();
        $this->get('/login')->assertNotFound();
        $this->post('/billing/subscription-checkout')->assertNotFound();
    }

    public function test_rollback_flag_invalidates_central_session_but_not_local_domain_data(): void
    {
        $account = $this->provisionFixture($this->centralIds());
        $this->actingAs($account->user);
        config(['sagamenu.saga_platform.enabled' => false]);

        $this->get('/privacy')->assertOk();

        $this->assertGuest();
        $this->assertDatabaseHas('saga_platform_accounts', [
            'central_product_account_id' => $account->central_product_account_id,
        ]);
        $this->assertDatabaseCount('organizations', 1);
        $this->assertDatabaseCount('catalogs', 1);
    }

    public function test_signup_fails_closed_when_central_contract_fields_are_missing(): void
    {
        Http::fake(fn () => Http::response(['data' => [
            'signupAttemptId' => (string) Str::ulid(),
            'platformUserId' => (string) Str::ulid(),
            'organizationId' => (string) Str::ulid(),
            'workspaceId' => (string) Str::ulid(),
            'productAccountId' => (string) Str::ulid(),
        ]], 201));

        $this->get('/signup')->assertOk();
        $this->post('/signup', [
            'idempotency_key' => session('saga_platform.signup_idempotency_key'),
            'name' => 'Owner Test',
            'email' => 'owner@example.test',
            'organization_name' => 'Saga Coffee Test',
            'business_type' => 'fnb',
            'timezone' => 'Asia/Jakarta',
            'password' => 'correct-horse-battery-staple',
            'password_confirmation' => 'correct-horse-battery-staple',
            'terms' => '1',
        ])->assertSessionHasErrors('email');

        $this->assertNull(session('saga_platform.signup_context'));
        $this->assertDatabaseCount('users', 0);
    }

    public function test_client_uses_central_baseline_paths_and_canonical_hmac_headers(): void
    {
        Http::fake(fn () => Http::response(['data' => ['accepted' => true]], 200));
        $client = app(SagaPlatformClient::class);
        $client->signup(['idempotencyKey' => 'signup-1']);
        $client->verify('verification-token-that-is-long-enough');
        $client->createSession('owner@example.test', 'not-stored-here', (string) Str::ulid());
        $client->exchangeSession('opaque-code-that-is-long-enough-for-central', (string) Str::ulid());
        $client->reportProvisioning(['productAccountId' => (string) Str::ulid()]);
        $client->createSubscriptionCheckout(['subscriptionId' => (string) Str::ulid()]);
        $client->putUsageSnapshot(['productAccountId' => (string) Str::ulid(), 'metrics' => []]);

        $recorded = Http::recorded();
        $this->assertSame([
            'POST /internal/v1/products/sagamenu/signups',
            'POST /internal/v1/products/sagamenu/verifications',
            'POST /internal/v1/products/sagamenu/sessions',
            'POST /internal/v1/products/sagamenu/sessions/exchange',
            'POST /internal/v1/products/sagamenu/provisioning-results',
            'POST /internal/v1/products/sagamenu/subscription-checkouts',
            'PUT /internal/v1/products/sagamenu/usage-snapshots',
        ], collect($recorded)->map(function (array $entry): string {
            $request = $entry[0];
            $path = (string) parse_url($request->url(), PHP_URL_PATH);
            $timestamp = $request->header('X-Saga-Timestamp')[0];
            $nonce = $request->header('X-Saga-Nonce')[0];
            $keyId = $request->header('X-Saga-Key-Id')[0];
            $canonical = implode("\n", [$timestamp, $nonce, $keyId, $request->method(), $path, hash('sha256', $request->body())]);
            $this->assertSame('v1='.hash_hmac('sha256', $canonical, $this->secret), $request->header('X-Saga-Signature')[0]);
            $this->assertSame('1.0', $request->header('X-Saga-Contract-Version')[0]);
            $this->assertStringNotContainsString($this->secret, $request->body());

            return $request->method().' '.$path;
        })->all());
    }

    public function test_retry_uses_fresh_hmac_nonce_with_the_same_idempotent_body(): void
    {
        config(['sagamenu.saga_platform.retry_attempts' => 2]);
        Http::fakeSequence()
            ->push(['error' => ['code' => 'PLT_DEPENDENCY_UNAVAILABLE', 'retryable' => true]], 503)
            ->push(['data' => ['accepted' => true]], 200);

        app(SagaPlatformClient::class)->signup(['idempotencyKey' => 'stable-signup-key']);

        $requests = Http::recorded();
        $this->assertCount(2, $requests);
        $this->assertNotSame(
            $requests[0][0]->header('X-Saga-Nonce')[0],
            $requests[1][0]->header('X-Saga-Nonce')[0],
        );
        $this->assertSame($requests[0][0]->body(), $requests[1][0]->body());
        $this->assertSame(
            $requests[0][0]->header('X-Correlation-Id')[0],
            $requests[1][0]->header('X-Correlation-Id')[0],
        );
    }

    public function test_branded_signup_verification_and_local_provisioning_are_idempotent(): void
    {
        $ids = $this->centralIds();
        $subscriptionId = (string) Str::ulid();
        Http::fakeSequence()
            ->push(['data' => [
                'signupAttemptId' => (string) Str::ulid(),
                'status' => 'pending_verification',
                'platformUserId' => $ids['user'],
                'organizationId' => $ids['organization'],
                'workspaceId' => $ids['workspace'],
                'productAccountId' => $ids['account'],
                'subscriptionId' => $subscriptionId,
                'planCode' => 'sagamenu_trial',
                'subscriptionStatus' => 'pending_verification',
                'lifecycleVersion' => 1,
                'verificationRequired' => true,
            ]], 201)
            ->push(['data' => [
                'status' => 'provisioning_pending',
                'productAccountId' => $ids['account'],
                'subscriptionId' => $subscriptionId,
                'planCode' => 'sagamenu_trial',
                'subscriptionStatus' => 'trialing',
                'lifecycleVersion' => 2,
                'trialEndsAt' => now()->addDays(14)->utc()->toIso8601ZuluString(),
            ]], 200)
            ->push(['data' => [
                'productAccountId' => $ids['account'],
                'status' => 'linked',
                'lifecycleVersion' => 3,
            ]], 200);

        $this->get('/signup')->assertOk();
        $idempotencyKey = session('saga_platform.signup_idempotency_key');
        $this->post('/signup', [
            'idempotency_key' => $idempotencyKey,
            'name' => 'Owner Test',
            'email' => 'Owner@Example.Test',
            'organization_name' => 'Saga Coffee Test',
            'business_type' => 'fnb',
            'timezone' => 'Asia/Jakarta',
            'password' => 'correct-horse-battery-staple',
            'password_confirmation' => 'correct-horse-battery-staple',
            'terms' => '1',
        ])->assertRedirect('/verify-email');

        $signupContext = session('saga_platform.signup_context');
        $this->assertIsArray($signupContext);
        $this->assertArrayNotHasKey('password', $signupContext);
        $this->assertDatabaseCount('users', 0);

        $this->post('/verify-email', ['verification_token' => str_repeat('v', 64)])
            ->assertRedirect('/login');

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('organizations', 1);
        $this->assertDatabaseCount('locations', 1);
        $this->assertDatabaseCount('catalogs', 1);
        $this->assertDatabaseCount('saga_platform_accounts', 1);
        $this->assertDatabaseHas('organizations', ['central_organization_id' => $ids['organization']]);
        $this->assertDatabaseHas('locations', ['central_workspace_id' => $ids['workspace']]);
        $this->assertDatabaseHas('catalogs', ['slug' => 'main-menu', 'status' => 'draft']);
        $this->assertDatabaseHas('subscriptions', [
            'central_subscription_id' => $subscriptionId,
            'plan_key' => 'sagamenu_trial',
            'status' => 'trialing',
        ]);
        $this->assertNull(User::query()->firstOrFail()->password);

        $account = SagaPlatformAccount::query()->firstOrFail();
        $signupContext['subscriptionStatus'] = 'trialing';
        $replayed = app(SagaMenuProvisioner::class)->provision($signupContext, [
            'productAccountId' => $account->central_product_account_id,
            'subscriptionId' => $account->central_subscription_id,
            'planCode' => 'sagamenu_trial',
            'subscriptionStatus' => 'trialing',
            'trialEndsAt' => $account->trial_ends_at?->utc()->toIso8601ZuluString(),
            'lifecycleVersion' => 2,
        ]);
        $this->assertTrue($account->is($replayed));
        $this->assertDatabaseCount('organizations', 1);
        $this->assertDatabaseCount('locations', 1);
        $this->assertDatabaseCount('catalogs', 1);

        $provisionRequest = Http::recorded(fn (ClientRequest $request) => str_ends_with($request->url(), '/provisioning-results'))->first()[0];
        $this->assertSame(2, $provisionRequest->data()['expectedLifecycleVersion']);
        $this->assertSame('organization:'.$account->organization_id, $provisionRequest->data()['localSubjectId']);
    }

    public function test_signed_assertion_creates_local_session_and_replay_is_rejected(): void
    {
        $ids = $this->centralIds();
        $account = $this->provisionFixture($ids);
        $jti = (string) Str::ulid();
        $assertion = $this->signedAssertion($ids, $jti);
        Http::fakeSequence()
            ->push(['data' => ['status' => 'exchange_required', 'opaqueExchangeCode' => str_repeat('c', 64)]], 200)
            ->push(['data' => ['signedAssertion' => $assertion, 'expiresIn' => 300]], 200)
            ->push(['data' => ['status' => 'exchange_required', 'opaqueExchangeCode' => str_repeat('d', 64)]], 200)
            ->push(['data' => ['signedAssertion' => $assertion, 'expiresIn' => 300]], 200);

        $response = $this->post('/login', ['email' => $account->user->email, 'password' => 'central-only-password']);
        $response->assertRedirect('/admin');
        $this->assertAuthenticatedAs($account->user);
        $this->assertSame($ids['account'], session('saga_platform.session.central_product_account_id'));
        $this->assertStringNotContainsString($assertion, json_encode(session()->all(), JSON_THROW_ON_ERROR));
        $this->assertTrue((bool) config('session.http_only'));

        auth()->logout();
        $this->post('/login', ['email' => $account->user->email, 'password' => 'central-only-password'])
            ->assertSessionHasErrors('email');

        $wrongAudience = $this->signedAssertion($ids, (string) Str::ulid(), 'other-product-web');
        $this->expectException(SagaPlatformException::class);
        app(SagaPlatformAssertionVerifier::class)->verify($wrongAudience);
    }

    public function test_checkout_uses_server_side_price_and_stable_idempotency_key(): void
    {
        $ids = $this->centralIds();
        $account = $this->provisionFixture($ids, (string) Str::ulid());
        Http::fake(fn () => Http::response(['data' => [
            'status' => 'pending',
            'reference' => 'SGD-SUB-LOCAL-TEST',
            'checkoutUrl' => null,
            'gatewayMode' => 'dry_run',
        ]], 201));

        $payload = ['plan_code' => 'sagamenu_pro', 'billing_cycle' => 'monthly', 'amount' => 1];
        $this->actingAs($account->user)->postJson('/billing/subscription-checkout', $payload)
            ->assertCreated()->assertJsonPath('data.gateway_mode', 'dry_run');
        $this->actingAs($account->user)->postJson('/billing/subscription-checkout', $payload)->assertCreated();

        $requests = Http::recorded();
        $this->assertCount(2, $requests);
        $this->assertSame(100000, $requests[0][0]->data()['amount']);
        $this->assertSame($requests[0][0]->data()['idempotencyKey'], $requests[1][0]->data()['idempotencyKey']);
    }

    public function test_usage_snapshot_allows_only_safe_aggregate_metrics(): void
    {
        $ids = $this->centralIds();
        $account = $this->provisionFixture($ids);
        $catalog = Catalog::query()->firstOrFail();
        $catalog->update(['hero_title' => 'FORBIDDEN CATALOG CONTENT']);
        QrRoute::query()->create([
            'organization_id' => $account->organization_id,
            'catalog_id' => $catalog->id,
            'code' => 'safe-qr-test',
            'label' => 'Private QR Label',
            'status' => 'active',
        ]);
        AnalyticsEvent::query()->create([
            'event_id' => (string) Str::uuid(),
            'organization_id' => $account->organization_id,
            'catalog_id' => $catalog->id,
            'event_name' => 'search_performed',
            'surface' => 'mobile',
            'session_key' => hash('sha256', 'visitor-level-session'),
            'search_term' => 'FORBIDDEN VISITOR SEARCH',
            'occurred_at' => now(),
        ]);

        $metrics = app(SagaMenuUsageSnapshotBuilder::class)->build($account->fresh(['organization.subscription']));
        $this->assertSame(SagaMenuUsageSnapshotBuilder::ALLOWED_KEYS, array_keys($metrics));
        $serialized = json_encode($metrics, JSON_THROW_ON_ERROR);
        foreach (['catalog content', 'visitor', 'search', 'media', 'session'] as $forbidden) {
            $this->assertStringNotContainsString($forbidden, Str::lower($serialized));
        }

        Http::fake(fn () => Http::response(['data' => ['accepted' => true]], 200));
        $this->artisan('sagamenu:saga-platform-usage --period=2026-07-16')->assertSuccessful();
        $request = Http::recorded()->first()[0];
        $this->assertSame('/internal/v1/products/sagamenu/usage-snapshots', parse_url($request->url(), PHP_URL_PATH));
        $this->assertSame(SagaMenuUsageSnapshotBuilder::ALLOWED_KEYS, array_keys($request->data()['metrics']));
        $this->assertStringNotContainsString('FORBIDDEN', $request->body());
    }

    private function centralIds(): array
    {
        return [
            'user' => (string) Str::ulid(),
            'organization' => (string) Str::ulid(),
            'workspace' => (string) Str::ulid(),
            'account' => (string) Str::ulid(),
        ];
    }

    private function provisionFixture(array $ids, ?string $subscriptionId = null): SagaPlatformAccount
    {
        $subscriptionId ??= (string) Str::ulid();

        return app(SagaMenuProvisioner::class)->provision([
            'signupAttemptId' => (string) Str::ulid(),
            'platformUserId' => $ids['user'],
            'organizationId' => $ids['organization'],
            'workspaceId' => $ids['workspace'],
            'productAccountId' => $ids['account'],
            'subscriptionId' => $subscriptionId,
            'planCode' => 'sagamenu_trial',
            'subscriptionStatus' => 'trialing',
            'lifecycleVersion' => 1,
            'email' => 'owner-'.Str::lower(Str::random(6)).'@example.test',
            'name' => 'Owner Test',
            'organizationName' => 'Saga Coffee '.Str::upper(Str::random(4)),
            'businessType' => 'fnb',
            'locale' => 'id',
            'timezone' => 'Asia/Jakarta',
        ], [
            'productAccountId' => $ids['account'],
            'subscriptionId' => $subscriptionId,
            'planCode' => 'sagamenu_trial',
            'subscriptionStatus' => 'trialing',
            'trialEndsAt' => now()->addDays(14)->utc()->toIso8601ZuluString(),
            'lifecycleVersion' => 2,
        ])->load(['user', 'organization.subscription']);
    }

    private function signedAssertion(array $ids, string $jti, string $audience = 'sagamenu-web'): string
    {
        $claims = [
            'iss' => 'saga-platform',
            'sub' => $ids['user'],
            'aud' => $audience,
            'product' => 'sagamenu',
            'organization_id' => $ids['organization'],
            'product_account_id' => $ids['account'],
            'jti' => $jti,
            'iat' => now()->timestamp,
            'exp' => now()->addMinutes(5)->timestamp,
        ];
        $encoded = rtrim(strtr(base64_encode(json_encode($claims, JSON_THROW_ON_ERROR)), '+/', '-_'), '=');
        $signature = rtrim(strtr(base64_encode(hash_hmac('sha256', 'v1.'.$encoded, $this->secret, true)), '+/', '-_'), '=');

        return 'v1.'.$encoded.'.'.$signature;
    }
}
