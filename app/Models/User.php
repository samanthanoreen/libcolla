<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $full_name
 * @property string $username
 * @property string $email
 * @property string $role
 * @property array|null $permissions
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'full_name', 'username', 'email', 'role', 'password', 'permissions'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $appends = [
        'can_add',
        'can_edit',
        'can_delete',
        'can_access_users',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'permissions' => 'array',
        ];
    }

    /**
     * Normalize permissions attribute. Admins always have full permissions.
     */
    public function getPermissionsAttribute($value): array
    {
        if (strtolower((string) $this->role) === 'admin') {
            return [
                'can_add' => true,
                'can_edit' => true,
                'can_delete' => true,
                'can_access_users' => true,
            ];
        }

        $decoded = is_array($value) ? $value : (json_decode($value ?? '', true) ?: []);

        return [
            'can_add' => !empty($decoded['can_add'] ?? $decoded['add'] ?? false),
            'can_edit' => !empty($decoded['can_edit'] ?? $decoded['edit'] ?? false),
            'can_delete' => !empty($decoded['can_delete'] ?? $decoded['delete'] ?? false),
            'can_access_users' => !empty($decoded['can_access_users'] ?? $decoded['access_users'] ?? false),
        ];
    }

    public function getCanAddAttribute(): bool
    {
        return $this->hasPermission('can_add');
    }

    public function getCanEditAttribute(): bool
    {
        return $this->hasPermission('can_edit');
    }

    public function getCanDeleteAttribute(): bool
    {
        return $this->hasPermission('can_delete');
    }

    public function getCanAccessUsersAttribute(): bool
    {
        return $this->hasPermission('can_access_users');
    }

    public function hasPermission(string $perm): bool
    {
        if (strtolower((string) $this->role) === 'admin') {
            return true;
        }

        $perms = $this->permissions;
        $map = [
            'add' => 'can_add',
            'edit' => 'can_edit',
            'delete' => 'can_delete',
            'access_users' => 'can_access_users',
        ];
        $key = $map[$perm] ?? $perm;

        return (bool) ($perms[$key] ?? false);
    }
}
