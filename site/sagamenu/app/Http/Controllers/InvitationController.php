<?php

namespace App\Http\Controllers;

use App\Services\OrganizationInvitationService;
use Illuminate\Http\RedirectResponse;

class InvitationController extends Controller
{
    public function accept(string $token, OrganizationInvitationService $invitations): RedirectResponse
    {
        $invitations->accept($token, auth()->user());

        return redirect('/admin')->with('status', 'Invitation accepted.');
    }
}
