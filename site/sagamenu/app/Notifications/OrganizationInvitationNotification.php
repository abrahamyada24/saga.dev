<?php

namespace App\Notifications;

use App\Models\Organization;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrganizationInvitationNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly Organization $organization, private readonly string $token) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Invitation to {$this->organization->name} on Saga Menu")
            ->line("You were invited to manage {$this->organization->name} on Saga Menu.")
            ->action('Accept invitation', route('invitations.accept', ['token' => $this->token]))
            ->line('This invitation expires in seven days and can only be accepted once.');
    }
}
