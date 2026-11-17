<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_access_the_dashboard_but_not_admin_pages(): void
    {
        $this->actingAs(User::factory()->create(['role' => User::ROLE_USER]));

        $this->get('/dashboard')->assertOk()->assertInertia(
            fn (Assert $page) => $page->where('recentPayouts', [])
        );
        $this->get('/artists')->assertForbidden();
        $this->get('/music-tracks')->assertForbidden();
        $this->get('/royalty-payouts')->assertForbidden();
        $this->get('/settings/profile')->assertForbidden();
    }

    public function test_login_role_must_match_the_account_role(): void
    {
        $user = User::factory()->create(['role' => User::ROLE_USER]);

        $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'role' => User::ROLE_ADMIN,
        ])->assertRedirect('/login')->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_users_can_log_in_with_the_user_role_selected(): void
    {
        $user = User::factory()->create(['role' => User::ROLE_USER]);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'role' => User::ROLE_USER,
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
    }

    public function test_admins_can_log_in_with_a_username(): void
    {
        $admin = User::factory()->create([
            'username' => 'admin',
            'role' => User::ROLE_ADMIN,
        ]);

        $this->post('/login', [
            'email' => 'admin',
            'password' => 'password',
            'role' => User::ROLE_ADMIN,
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($admin);
    }
}
