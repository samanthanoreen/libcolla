<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // List users
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return Inertia::render('Users/ManageUsers', [
            'users' => $users,
            'totalUsersCount' => $users->count(),
        ]);
    }

    // Add user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'username'  => 'required|string|max:255|unique:users,username',
            'email'     => 'required|string|email|max:255|unique:users,email',
            'role'      => 'required|string|in:admin,librarian,staff',
            'password'  => 'required|string|min:6',
        ]);

        User::create([
            'name'      => $validated['full_name'],
            'full_name' => $validated['full_name'],
            'username'  => $validated['username'],
            'email'     => $validated['email'],
            'role'      => $validated['role'],
            'password'  => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'User created successfully.');
    }

    // Edit user
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'username'  => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'email'     => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role'      => 'required|string|in:admin,librarian,staff',
            'password'  => 'nullable|string|min:6',
        ]);

        $user->fill([
            'name'      => $validated['full_name'],
            'full_name' => $validated['full_name'],
            'username'  => $validated['username'],
            'email'     => $validated['email'],
            'role'      => $validated['role'],
        ]);

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', 'User updated successfully.');
    }

    // Delete user
    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'User deleted successfully.');
    }
}