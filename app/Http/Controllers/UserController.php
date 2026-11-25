<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $canAccess = ($currentUser->role === 'admin') || $currentUser->hasPermission('can_access_users');

        if (!$canAccess) {
            return Inertia::render('Users/ManageUsers', [
                'users' => [],
                'totalUsersCount' => 0,
                'accessRestricted' => true,
            ]);
        }

        $users = User::orderBy('created_at', 'desc')->get();

        return Inertia::render('Users/ManageUsers', [
            'users' => $users,
            'totalUsersCount' => User::count(),
            'accessRestricted' => false,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $role = $validated['role'];
        if ($role === 'admin') {
            $permissions = [
                'can_add' => true,
                'can_edit' => true,
                'can_delete' => true,
                'can_access_users' => true,
            ];
        } else {
            $raw = $request->input('permissions', []);
            $permissions = [
                'can_add' => !empty($raw['can_add'] ?? $raw['add'] ?? false),
                'can_edit' => !empty($raw['can_edit'] ?? $raw['edit'] ?? false),
                'can_delete' => !empty($raw['can_delete'] ?? $raw['delete'] ?? false),
                'can_access_users' => !empty($raw['can_access_users'] ?? $raw['access_users'] ?? false),
            ];
        }

        User::create([
            'name'        => $validated['full_name'],
            'full_name'   => $validated['full_name'],
            'username'    => $validated['username'],
            'email'       => $validated['email'],
            'role'        => $role,
            'password'    => Hash::make($validated['password']),
            'permissions' => $permissions,
        ]);

        return back()->with('status', 'User created successfully.');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $role = $validated['role'];
        $data = [
            'name'      => $validated['full_name'],
            'full_name' => $validated['full_name'],
            'username'  => $validated['username'],
            'email'     => $validated['email'],
            'role'      => $role,
        ];

        if ($role === 'admin') {
            $data['permissions'] = [
                'can_add' => true,
                'can_edit' => true,
                'can_delete' => true,
                'can_access_users' => true,
            ];
        } elseif ($request->has('permissions')) {
            $raw = $request->input('permissions', []);
            $data['permissions'] = [
                'can_add' => !empty($raw['can_add'] ?? $raw['add'] ?? false),
                'can_edit' => !empty($raw['can_edit'] ?? $raw['edit'] ?? false),
                'can_delete' => !empty($raw['can_delete'] ?? $raw['delete'] ?? false),
                'can_access_users' => !empty($raw['can_access_users'] ?? $raw['access_users'] ?? false),
            ];
        }

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return back()->with('status', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $currentUser = auth()->user();
        if ($currentUser->role !== 'admin' && !$currentUser->hasPermission('can_delete')) {
            abort(403, 'You do not have permission to delete users.');
        }

        // Prevent self-deletion
        if ($user->id === $currentUser->id) {
            return back()->withErrors(['delete' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return back()->with('status', 'User deleted successfully.');
    }

    public function requestAccess(Request $request)
    {
        $currentUser = $request->user();
        $requested = $request->input('permissions', ['Access User Section']);
        $reason = trim((string) $request->input('reason', ''));

        $permList = is_array($requested) ? implode(', ', $requested) : (string) $requested;

        $admins = User::where('role', 'admin')->get();
        if ($admins->isEmpty()) {
            $admins = User::limit(1)->get();
        }

        $subject = "Permission Request: {$currentUser->name} ({$currentUser->role})";
        $messageBody = "User {$currentUser->name} ({$currentUser->email}, role: " . ucfirst($currentUser->role) . ") has requested the following system permissions:\n\n"
            . "• Permissions Requested: {$permList}\n"
            . ($reason !== '' ? "• Reason / Note: {$reason}\n\n" : "\n")
            . "You can grant or update these permissions in Manage Users.";

        foreach ($admins as $admin) {
            Message::create([
                'sender_id' => $currentUser->id,
                'recipient_id' => $admin->id,
                'subject' => $subject,
                'message' => $messageBody,
                'is_read' => false,
            ]);
        }

        return back()->with('status', 'Your request has been submitted to the Administrator.');
    }
}
