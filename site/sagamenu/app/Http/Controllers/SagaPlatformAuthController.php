<?php

namespace App\Http\Controllers;

use App\Exceptions\SagaPlatformException;
use App\Models\SagaPlatformAccount;
use App\Services\SagaPlatform\LegacyLoginCompatibility;
use App\Services\SagaPlatform\SagaMenuProvisioner;
use App\Services\SagaPlatform\SagaPlatformAccessProjector;
use App\Services\SagaPlatform\SagaPlatformAssertionVerifier;
use App\Services\SagaPlatform\SagaPlatformClient;
use App\Services\SagaPlatform\SagaPlatformContract;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\View\View;

class SagaPlatformAuthController extends Controller
{
    public function __construct(
        private readonly SagaPlatformClient $platform,
        private readonly SagaPlatformAssertionVerifier $assertions,
        private readonly SagaMenuProvisioner $provisioner,
        private readonly SagaPlatformContract $contract,
        private readonly SagaPlatformAccessProjector $access,
        private readonly LegacyLoginCompatibility $legacyLogin,
    ) {}

    public function showSignup(Request $request): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect('/admin');
        }

        $idempotencyKey = $request->session()->get('saga_platform.signup_idempotency_key');
        if (! is_string($idempotencyKey)) {
            $idempotencyKey = 'sagamenu-signup-'.Str::lower((string) Str::ulid());
            $request->session()->put('saga_platform.signup_idempotency_key', $idempotencyKey);
        }

        return view('auth.signup', compact('idempotencyKey'));
    }

    public function signup(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'idempotency_key' => ['required', 'string', 'max:128'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:191'],
            'password' => ['required', 'confirmed', 'string', 'min:12', 'max:255'],
            'organization_name' => ['required', 'string', 'max:191'],
            'business_type' => ['required', 'in:fnb,service,product'],
            'timezone' => ['required', 'timezone:all'],
            'terms' => ['accepted'],
        ]);
        abort_unless(hash_equals(
            (string) $request->session()->get('saga_platform.signup_idempotency_key'),
            $data['idempotency_key'],
        ), 419);

        try {
            $payload = [
                'idempotencyKey' => $data['idempotency_key'],
                'email' => Str::lower(trim($data['email'])),
                'password' => $data['password'],
                'name' => trim($data['name']),
                'organizationName' => trim($data['organization_name']),
                'locale' => 'id',
                'timezone' => $data['timezone'],
                'termsVersion' => config('sagamenu.saga_platform.terms_version'),
            ];
            if (filled(config('sagamenu.saga_platform.plan_code'))) {
                $payload['planCode'] = config('sagamenu.saga_platform.plan_code');
            }
            $central = $this->contract->signup($this->platform->signup($payload));
        } catch (SagaPlatformException $exception) {
            return back()->withInput($request->except(['password', 'password_confirmation']))
                ->withErrors(['email' => $this->safeMessage($exception)]);
        }

        $request->session()->put('saga_platform.signup_context', [
            'signupAttemptId' => $central['signupAttemptId'] ?? null,
            'platformUserId' => $central['platformUserId'] ?? null,
            'organizationId' => $central['organizationId'] ?? null,
            'workspaceId' => $central['workspaceId'] ?? null,
            'productAccountId' => $central['productAccountId'] ?? null,
            'subscriptionId' => $central['subscriptionId'] ?? null,
            'lifecycleVersion' => $central['lifecycleVersion'],
            'planCode' => $central['planCode'],
            'subscriptionStatus' => $central['subscriptionStatus'],
            'email' => Str::lower(trim($data['email'])),
            'name' => trim($data['name']),
            'organizationName' => trim($data['organization_name']),
            'businessType' => $data['business_type'],
            'locale' => 'id',
            'timezone' => $data['timezone'],
        ]);
        $request->session()->forget('saga_platform.signup_idempotency_key');

        return redirect()->route('saga-platform.verify.show')
            ->with('status', 'Periksa email untuk melanjutkan verifikasi akun Saga Menu.');
    }

    public function showVerify(Request $request): View
    {
        return view('auth.verify-email', [
            'token' => $request->string('token')->toString(),
            'canRetryProvisioning' => $request->session()->has('saga_platform.verification_data'),
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'verification_token' => ['required', 'string', 'min:32', 'max:255'],
        ]);
        $signup = $request->session()->get('saga_platform.signup_context');
        if (! is_array($signup)) {
            return back()->withErrors(['verification_token' => 'Sesi pendaftaran tidak ditemukan. Mulai kembali dari halaman daftar.']);
        }

        try {
            $verification = $this->contract->verification(
                $this->platform->verify($data['verification_token']),
            );
            $signup['productAccountId'] = $verification['productAccountId'];
            $signup['subscriptionId'] = $verification['subscriptionId'];
            $signup['lifecycleVersion'] = $verification['lifecycleVersion'];
            $signup['planCode'] = $verification['planCode'];
            $signup['subscriptionStatus'] = $verification['subscriptionStatus'];
            $request->session()->put('saga_platform.signup_context', $signup);
            $request->session()->put('saga_platform.verification_data', $verification);

            return $this->completeProvisioning($request, $signup, $verification);
        } catch (SagaPlatformException $exception) {
            return back()->withErrors(['verification_token' => $this->safeMessage($exception)]);
        }
    }

    public function retryProvisioning(Request $request): RedirectResponse
    {
        $signup = $request->session()->get('saga_platform.signup_context');
        $verification = $request->session()->get('saga_platform.verification_data');
        if (! is_array($signup) || ! is_array($verification)) {
            return redirect()->route('saga-platform.signup.show')
                ->withErrors(['email' => 'Sesi provisioning tidak tersedia.']);
        }

        try {
            return $this->completeProvisioning($request, $signup, $verification);
        } catch (SagaPlatformException $exception) {
            return back()->withErrors(['verification_token' => $this->safeMessage($exception)]);
        }
    }

    public function showLogin(): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect('/admin');
        }

        return view('auth.login');
    }

    public function showAccountStatus(Request $request): View
    {
        $status = (string) $request->session()->get('saga_platform.restricted_status', 'unavailable');
        if (! in_array($status, ['past_due', 'expired', 'suspended', 'cancelled', 'provisioning_failed'], true)) {
            $status = 'unavailable';
        }

        return view('auth.account-status', compact('status'));
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email:rfc', 'max:191'],
            'password' => ['required', 'string', 'max:255'],
        ]);
        $requestNonce = (string) Str::ulid();
        $account = null;

        try {
            $session = $this->contract->session(
                $this->platform->createSession(Str::lower(trim($data['email'])), $data['password'], $requestNonce),
            );
            $exchange = $this->contract->exchange(
                $this->platform->exchangeSession($session['opaqueExchangeCode'], $requestNonce),
            );
            $claims = $this->assertions->verify($exchange['signedAssertion']);
            $account = SagaPlatformAccount::query()
                ->where('central_product_account_id', $claims['product_account_id'])
                ->where('central_user_id', $claims['sub'])
                ->where('central_organization_id', $claims['organization_id'])
                ->with('user')
                ->first();
            if (! $account || ! $account->user?->is_active) {
                throw new SagaPlatformException('PRODUCT_ACCOUNT_NOT_PROVISIONED', 403);
            }
            if (! $this->access->canAuthenticate($account)) {
                throw new SagaPlatformException('PRODUCT_ACCOUNT_RESTRICTED', 403);
            }

            Auth::login($account->user);
            $request->session()->regenerate();
            $request->session()->put('saga_platform.session', [
                'central_user_id' => $claims['sub'],
                'central_organization_id' => $claims['organization_id'],
                'central_product_account_id' => $claims['product_account_id'],
                'assertion_jti_hash' => hash('sha256', $claims['jti']),
                'expires_at' => $claims['exp'],
            ]);
            $account->user->forceFill(['last_login_at' => now()])->save();

            return redirect()->intended('/admin');
        } catch (SagaPlatformException $exception) {
            if ($exception->safeCode === 'PRODUCT_ACCOUNT_RESTRICTED') {
                $request->session()->put('saga_platform.restricted_status', $account?->status ?? 'unavailable');

                return redirect()->route('saga-platform.account-status');
            }
            if ($exception->safeCode === 'PLT_AUTH_FAILED'
                && $this->legacyLogin->attempt($data['email'], $data['password'], $request)) {
                return redirect()->intended('/admin')
                    ->with('status', 'Anda masuk melalui masa kompatibilitas akun lama.');
            }

            return back()->withInput($request->only('email'))
                ->withErrors(['email' => $this->safeMessage($exception)]);
        }
    }

    private function completeProvisioning(Request $request, array $signup, array $verification): RedirectResponse
    {
        $account = $this->provisioner->provision($signup, $verification);
        try {
            $result = $this->contract->provisioning($this->platform->reportProvisioning([
                'productAccountId' => $account->central_product_account_id,
                'expectedLifecycleVersion' => $account->lifecycle_version,
                'status' => 'ready',
                'localSubjectId' => 'organization:'.$account->organization_id,
            ]));
        } catch (SagaPlatformException $exception) {
            $account->forceFill(['status' => 'provisioning_report_pending'])->save();
            throw $exception;
        }

        $account->forceFill([
            'status' => $signup['subscriptionStatus'],
            'lifecycle_version' => (int) $result['lifecycleVersion'],
            'last_synced_at' => now(),
        ])->save();
        $request->session()->forget(['saga_platform.signup_context', 'saga_platform.verification_data']);

        return redirect()->route('saga-platform.login.show')
            ->with('status', 'Akun terverifikasi. Silakan masuk untuk membuka dashboard.');
    }

    private function safeMessage(SagaPlatformException $exception): string
    {
        return match ($exception->safeCode) {
            'PLT_VERIFICATION_REQUIRED' => 'Verifikasi email diperlukan sebelum masuk.',
            'PLT_VERIFICATION_INVALID' => 'Tautan verifikasi tidak valid atau sudah kedaluwarsa.',
            'PLT_AUTH_FAILED' => 'Email atau password tidak sesuai.',
            'PLT_IDEMPOTENCY_CONFLICT' => 'Permintaan pendaftaran berubah. Muat ulang halaman dan coba lagi.',
            'PRODUCT_IDENTITY_REVIEW_REQUIRED', 'PRODUCT_IDENTITY_BINDING_CONFLICT', 'PRODUCT_ACCOUNT_BINDING_CONFLICT' => 'Akun membutuhkan pemeriksaan sebelum dapat ditautkan.',
            'PRODUCT_ACCOUNT_NOT_PROVISIONED', 'PLT_PRODUCT_ACCOUNT_UNAVAILABLE' => 'Akun produk belum siap digunakan.',
            'PRODUCT_ACCOUNT_RESTRICTED' => 'Akses dashboard sedang dibatasi oleh status langganan.',
            'PLT_CONTRACT_RESPONSE_INCOMPLETE' => 'Layanan identitas mengirim respons yang belum dapat diverifikasi.',
            default => 'Proses belum dapat diselesaikan. Coba lagi beberapa saat lagi.',
        };
    }
}
