<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NotificationVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_sees_unread_badge_only_when_messaged_and_other_users_cannot_see_it(): void
    {
        $adminRecipient = User::factory()->create(['role' => 'admin']);
        $otherAdmin = User::factory()->create(['role' => 'admin']);
        $librarianSender = User::factory()->create(['role' => 'librarian']);
        $staffSender = User::factory()->create(['role' => 'staff']);
        $bystanderStaff = User::factory()->create(['role' => 'staff']);

        // Librarian sends message specifically to $adminRecipient
        $this->actingAs($librarianSender)
            ->post('/support/contact', [
                'subject' => 'Catalog Update',
                'message' => 'Please review the new books.',
                'recipients' => [$adminRecipient->email],
            ])
            ->assertRedirect();

        // Staff sends message specifically to $adminRecipient
        $this->actingAs($staffSender)
            ->post('/support/contact', [
                'subject' => 'Missing Call Number',
                'message' => 'Need help fixing a record.',
                'recipients' => [$adminRecipient->email],
            ])
            ->assertRedirect();

        // Targeted Admin sees unreadCount = 2 and both items
        $this->actingAs($adminRecipient)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('notifications.unreadCount', 2)
                ->has('notifications.items', 2)
                ->where('notifications.items.0.subject', 'Missing Call Number')
                ->where('notifications.items.1.subject', 'Catalog Update')
            );

        // Other Admin, senders, and bystander Staff see unreadCount = 0 and 0 items
        foreach ([$otherAdmin, $librarianSender, $staffSender, $bystanderStaff] as $otherUser) {
            $this->actingAs($otherUser)
                ->get('/dashboard')
                ->assertInertia(fn (Assert $page) => $page
                    ->where('notifications.unreadCount', 0)
                    ->has('notifications.items', 0)
                );
        }
    }

    public function test_message_to_specific_staff_or_librarian_is_visible_only_to_that_recipient(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $targetLibrarian = User::factory()->create(['role' => 'librarian']);
        $otherLibrarian = User::factory()->create(['role' => 'librarian']);
        $targetStaff = User::factory()->create(['role' => 'staff']);

        $this->actingAs($admin)
            ->post('/support/contact', [
                'subject' => 'For Target Librarian Only',
                'message' => 'Confidential task.',
                'recipients' => [$targetLibrarian->email],
            ])
            ->assertRedirect();

        $this->actingAs($targetLibrarian)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('notifications.unreadCount', 1)
                ->has('notifications.items', 1)
                ->where('notifications.items.0.subject', 'For Target Librarian Only')
            );

        foreach ([$admin, $otherLibrarian, $targetStaff] as $nonRecipient) {
            $this->actingAs($nonRecipient)
                ->get('/dashboard')
                ->assertInertia(fn (Assert $page) => $page
                    ->where('notifications.unreadCount', 0)
                    ->has('notifications.items', 0)
                );
        }

        // Marking read clears only $targetLibrarian's unread badge
        $this->actingAs($targetLibrarian)
            ->post('/support/contact/mark-read')
            ->assertRedirect();

        $this->actingAs($targetLibrarian)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('notifications.unreadCount', 0)
                ->has('notifications.items', 1)
                ->where('notifications.items.0.is_read', true)
            );
    }

    public function test_permission_request_notifies_only_admins(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $requester = User::factory()->create(['role' => 'staff']);
        $otherStaff = User::factory()->create(['role' => 'staff']);

        $this->actingAs($requester)
            ->post('/users/request-access', [
                'permissions' => ['can_add'],
                'reason' => 'Need to add new books',
            ])
            ->assertRedirect();

        $this->actingAs($admin)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('notifications.unreadCount', 1)
                ->has('notifications.items', 1)
                ->where('notifications.items.0.is_permission_request', true)
                ->where('notifications.items.0.sender_id', $requester->id)
                ->where('notifications.items.0.href', "/users?edit={$requester->id}")
            );

        $this->actingAs($admin)
            ->get("/users?edit={$requester->id}")
            ->assertOk();

        foreach ([$requester, $otherStaff] as $nonAdmin) {
            $this->actingAs($nonAdmin)
                ->get('/dashboard')
                ->assertInertia(fn (Assert $page) => $page
                    ->where('notifications.unreadCount', 0)
                    ->has('notifications.items', 0)
                );
        }
    }
}
