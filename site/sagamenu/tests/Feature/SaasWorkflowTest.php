<?php

namespace Tests\Feature;

use App\Models\AnalyticsDailyRollup;
use App\Models\AnalyticsEvent;
use App\Models\Catalog;
use App\Models\Offering;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\User;
use App\Services\AdminAssistService;
use App\Services\MediaUploadValidator;
use App\Services\OrganizationInvitationService;
use App\Services\Publishing\CatalogPublisher;
use App\Services\TenantContext;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class SaasWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_owner_cannot_access_another_organization_catalog(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $other = Organization::query()->create(['name' => 'Other', 'slug' => 'other', 'business_type' => 'fnb']);
        $catalog = Catalog::query()->create(['organization_id' => $other->id, 'name' => 'Other Menu', 'slug' => 'menu']);

        $this->assertFalse(Gate::forUser($owner)->allows('view', $catalog));
        $this->assertFalse(Gate::forUser($owner)->allows('update', $catalog));
    }

    public function test_editor_can_edit_but_cannot_publish(): void
    {
        $organization = Organization::query()->where('slug', 'saga-coffee')->firstOrFail();
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $editor = User::factory()->create(['email_verified_at' => now(), 'is_active' => true]);
        $organization->users()->attach($editor->id, ['role' => 'editor', 'is_primary' => true, 'accepted_at' => now()]);

        $this->assertTrue(Gate::forUser($editor)->allows('update', $catalog));
        $this->assertFalse(Gate::forUser($editor)->allows('publish', $catalog));
    }

    public function test_restore_creates_a_new_snapshot_and_audit_log(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $admin = User::query()->where('email', 'admin@sagamenu.local')->firstOrFail();
        $initial = $catalog->activeSnapshot;

        $restored = app(CatalogPublisher::class)->restore($catalog, $initial, $admin);

        $this->assertNotSame($initial->id, $restored->id);
        $this->assertSame(2, $restored->version);
        $this->assertDatabaseHas('audit_logs', ['action' => 'catalog.restored', 'organization_id' => $catalog->organization_id]);
    }

    public function test_invitation_is_email_bound_and_one_time(): void
    {
        Notification::fake();
        $organization = Organization::query()->where('slug', 'saga-coffee')->firstOrFail();
        $admin = User::query()->where('email', 'admin@sagamenu.local')->firstOrFail();
        $invitee = User::factory()->create(['email' => 'editor@example.test', 'email_verified_at' => now()]);

        $plainToken = Str::random(64);
        OrganizationInvitation::query()->create([
            'organization_id' => $organization->id,
            'invited_by_user_id' => $admin->id,
            'email' => $invitee->email,
            'role' => 'editor',
            'token_hash' => hash('sha256', $plainToken),
            'expires_at' => now()->addDay(),
        ]);

        app(OrganizationInvitationService::class)->accept($plainToken, $invitee);
        $this->assertSame('editor', $invitee->fresh()->roleFor($organization));

        $this->expectException(ModelNotFoundException::class);
        app(OrganizationInvitationService::class)->accept($plainToken, $invitee);
    }

    public function test_admin_assist_requires_reason_and_scopes_session(): void
    {
        $admin = User::query()->where('email', 'admin@sagamenu.local')->firstOrFail();
        $organization = Organization::query()->where('slug', 'saga-coffee')->firstOrFail();

        try {
            app(AdminAssistService::class)->start($admin, $organization, 'short');
            $this->fail('Short assist reason should be rejected.');
        } catch (ValidationException) {
            $assist = app(AdminAssistService::class)->start($admin, $organization, 'Customer requested content correction.');
            $this->assertSame($organization->id, session('assist_organization_id'));
            $this->assertSame($assist->id, session('assist_session_id'));
            $this->assertDatabaseHas('audit_logs', ['action' => 'admin_assist.started', 'organization_id' => $organization->id]);
        }
    }

    public function test_expired_admin_assist_context_is_removed(): void
    {
        $admin = User::query()->where('email', 'admin@sagamenu.local')->firstOrFail();
        $organization = Organization::query()->where('slug', 'saga-coffee')->firstOrFail();
        $assist = app(AdminAssistService::class)->start($admin, $organization, 'Investigating a customer support issue.');
        $assist->update(['expires_at' => now()->subMinute()]);

        $this->assertNull(app(TenantContext::class)->organizationId($admin));
        $this->assertNull(session('assist_session_id'));
        $this->assertNull(session('assist_organization_id'));
    }

    public function test_qr_redirect_tracks_scan_and_resolves_mobile_catalog(): void
    {
        $response = $this->get('/q/saga-coffee-main');

        $response->assertRedirect('/m/saga-coffee/main-menu');
        $this->assertDatabaseHas('analytics_events', ['event_name' => 'qr_scanned', 'surface' => 'mobile']);
    }

    public function test_analytics_endpoint_allowlists_events_and_rollup_is_idempotent(): void
    {
        $payload = [
            'event_id' => (string) Str::uuid(),
            'brand' => 'saga-coffee',
            'catalog' => 'main-menu',
            'event_name' => 'offering_opened',
            'surface' => 'mobile',
            'session_key' => 'anonymous-session',
            'offering_slug' => 'iced-aren-latte',
        ];

        $this->postJson('/api/events', $payload)->assertAccepted();
        $this->postJson('/api/events', $payload)->assertAccepted();
        $this->postJson('/api/events', [...$payload, 'event_id' => (string) Str::uuid(), 'event_name' => 'payment_completed'])->assertUnprocessable();

        $this->artisan('sagamenu:analytics-rollup', ['date' => today()->toDateString()])->assertSuccessful();
        $this->artisan('sagamenu:analytics-rollup', ['date' => today()->toDateString()])->assertSuccessful();

        $rollup = AnalyticsDailyRollup::query()->where('surface', 'mobile')->firstOrFail();
        $this->assertSame(1, $rollup->offering_opens);
        $this->assertSame(1, AnalyticsEvent::query()->where('event_name', 'offering_opened')->count());
    }

    public function test_public_pages_send_security_headers(): void
    {
        $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    }

    public function test_fake_font_file_is_rejected_by_signature(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('fake.woff2', 'not-a-real-font');

        $this->expectException(ValidationException::class);
        app(MediaUploadValidator::class)->validateStored('public', 'fake.woff2', 'font');
    }

    public function test_unsafe_external_action_url_is_rejected(): void
    {
        $offering = Offering::query()->firstOrFail();
        $offering->external_action_label = 'Tanya Staf';
        $offering->external_action_url = 'javascript:alert(1)';

        $this->expectException(ValidationException::class);
        $offering->save();
    }
}
