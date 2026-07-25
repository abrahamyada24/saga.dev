<?php

namespace App\Console\Commands;

use App\Services\SagaPlatform\SagaMenuUsageSnapshotBuilder;
use App\Services\SagaPlatform\SagaPlatformClient;
use App\Services\SagaPlatform\SagaPlatformContract;
use Illuminate\Console\Command;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class RehearseSagaPlatformIntegration extends Command
{
    protected $signature = 'sagamenu:saga-platform-rehearse {--json}';

    protected $description = 'Run the canonical Saga Platform contract locally without network or domain writes.';

    public function handle(SagaPlatformClient $client, SagaPlatformContract $contract): int
    {
        if (! app()->environment(['local', 'testing'])) {
            $this->error('Local contract rehearsal is disabled outside local/testing.');

            return self::FAILURE;
        }

        $ids = [
            'signup' => (string) Str::ulid(),
            'user' => (string) Str::ulid(),
            'organization' => (string) Str::ulid(),
            'workspace' => (string) Str::ulid(),
            'account' => (string) Str::ulid(),
            'subscription' => (string) Str::ulid(),
        ];
        config()->set('sagamenu.saga_platform.enabled', true);
        config()->set('sagamenu.saga_platform.base_url', 'https://saga-platform.invalid');
        config()->set('sagamenu.saga_platform.key_id', 'sagamenu-local-rehearsal');
        config()->set('sagamenu.saga_platform.hmac_secret', Str::random(64));
        config()->set('sagamenu.saga_platform.retry_attempts', 1);

        Http::fake(function (Request $request) use ($ids) {
            $path = (string) parse_url($request->url(), PHP_URL_PATH);

            return match (true) {
                str_ends_with($path, '/signups') => Http::response(['data' => [
                    'signupAttemptId' => $ids['signup'],
                    'status' => 'pending_verification',
                    'platformUserId' => $ids['user'],
                    'organizationId' => $ids['organization'],
                    'workspaceId' => $ids['workspace'],
                    'productAccountId' => $ids['account'],
                    'subscriptionId' => $ids['subscription'],
                    'planCode' => 'sagamenu_trial',
                    'subscriptionStatus' => 'pending_verification',
                    'lifecycleVersion' => 1,
                ]], 201),
                str_ends_with($path, '/verifications') => Http::response(['data' => [
                    'status' => 'provisioning_pending',
                    'productAccountId' => $ids['account'],
                    'subscriptionId' => $ids['subscription'],
                    'planCode' => 'sagamenu_trial',
                    'subscriptionStatus' => 'trialing',
                    'lifecycleVersion' => 2,
                    'trialEndsAt' => '2099-01-15T00:00:00Z',
                ]]),
                str_ends_with($path, '/sessions') => Http::response(['data' => [
                    'status' => 'exchange_required',
                    'opaqueExchangeCode' => str_repeat('x', 64),
                ]]),
                str_ends_with($path, '/sessions/exchange') => Http::response(['data' => [
                    'signedAssertion' => 'v1.'.str_repeat('a', 32).'.'.str_repeat('b', 43),
                ]]),
                str_ends_with($path, '/provisioning-results') => Http::response(['data' => [
                    'productAccountId' => $ids['account'],
                    'status' => 'linked',
                    'lifecycleVersion' => 3,
                ]]),
                str_ends_with($path, '/subscription-checkouts') => Http::response(['data' => [
                    'status' => 'pending',
                    'reference' => 'LOCAL-REHEARSAL',
                    'checkoutUrl' => null,
                    'gatewayMode' => 'dry_run',
                ]], 201),
                str_ends_with($path, '/subscriptions/'.$ids['subscription'].'/resume') => Http::response(['data' => [
                    'subscriptionId' => $ids['subscription'],
                    'status' => 'active',
                    'version' => 4,
                    'idempotentReplay' => false,
                ]]),
                str_ends_with($path, '/usage-snapshots') => Http::response(['data' => ['accepted' => true]]),
                default => throw new RuntimeException("Unexpected rehearsal request: {$path}"),
            };
        });

        $signup = $contract->signup($client->signup([
            'idempotencyKey' => 'sagamenu-rehearsal-signup',
            'email' => 'rehearsal@example.test',
            'password' => str_repeat('p', 16),
            'name' => 'Local Rehearsal',
            'organizationName' => 'Local Rehearsal',
            'termsVersion' => 'local',
        ]));
        $verification = $contract->verification($client->verify(str_repeat('v', 64)));
        $requestNonce = (string) Str::ulid();
        $session = $contract->session($client->createSession('rehearsal@example.test', str_repeat('p', 16), $requestNonce));
        $exchange = $contract->exchange($client->exchangeSession($session['opaqueExchangeCode'], $requestNonce));
        $provisioning = $contract->provisioning($client->reportProvisioning([
            'productAccountId' => $ids['account'],
            'expectedLifecycleVersion' => 2,
            'status' => 'ready',
            'localSubjectId' => 'organization:local-rehearsal',
        ]));
        $checkout = $contract->checkout($client->createSubscriptionCheckout([
            'idempotencyKey' => 'sagamenu-rehearsal-checkout',
            'subscriptionId' => $ids['subscription'],
            'planCode' => 'sagamenu_pro',
            'billingCycle' => 'monthly',
            'amount' => 199000,
            'customerName' => 'Local Rehearsal',
            'customerEmail' => 'rehearsal@example.test',
        ]));
        $lifecycle = $contract->lifecycle($client->changeSubscription($ids['subscription'], 'resume'));
        $usage = $contract->usageAcknowledgement($client->putUsageSnapshot([
            'productAccountId' => $ids['account'],
            'periodKey' => now()->toDateString(),
            'schemaVersion' => 1,
            'observedAt' => now()->utc()->toIso8601ZuluString(),
            'metrics' => array_fill_keys(SagaMenuUsageSnapshotBuilder::ALLOWED_KEYS, 0),
        ]));

        $requests = Http::recorded();
        foreach ($requests as [$request]) {
            foreach (['X-Saga-Key-Id', 'X-Saga-Timestamp', 'X-Saga-Nonce', 'X-Saga-Signature', 'X-Correlation-Id'] as $header) {
                if (blank($request->header($header))) {
                    throw new RuntimeException("Missing signed header: {$header}");
                }
            }
        }

        $result = [
            'status' => 'passed',
            'networkUsed' => false,
            'domainWrites' => false,
            'requests' => count($requests),
            'contractVersion' => config('sagamenu.saga_platform.contract_version'),
            'canonicalFieldsConsumed' => [
                $signup['subscriptionId'],
                $verification['planCode'],
                $verification['subscriptionStatus'],
                $verification['lifecycleVersion'],
                $verification['trialEndsAt'],
                $exchange['signedAssertion'] !== '',
                $provisioning['lifecycleVersion'],
                $checkout['reference'],
                $lifecycle['version'],
                $usage['accepted'],
            ],
        ];

        $this->line(json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));

        return self::SUCCESS;
    }
}
