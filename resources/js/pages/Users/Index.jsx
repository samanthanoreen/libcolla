import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

export default function ManageUsers({ users = [], totalUsersCount = 0 }) {
    const [showPassword, setShowPassword] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Inertia form helper for CREATE
    const {
        data: createData,
        setData: setCreateData,
        post: postCreate,
        processing: creating,
        reset: resetCreate,
        errors: createErrors,
    } = useForm({
        full_name: '',
        username: '',
        email: '',
        role: '',
        password: '',
    });

    // Inertia form helper for EDIT
    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: editing,
        reset: resetEdit,
        errors: editErrors,
    } = useForm({
        full_name: '',
        username: '',
        email: '',
        role: '',
        password: '',
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        postCreate('/users', {
            onSuccess: () => {
                const name = createData.full_name;
                resetCreate();
                setSuccessMessage(`User "${name}" has been created successfully!`);
            },
        });
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditData({
            full_name: user.full_name || user.name || '',
            username: user.username || '',
            email: user.email || '',
            role: user.role || 'staff',
            password: '',
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        putEdit(`/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
                resetEdit();
                setSuccessMessage('User account has been updated successfully!');
            },
        });
    };

    const executeDeleteUser = () => {
        if (!deletingUserId) return;
        router.delete(`/users/${deletingUserId}`, {
            onSuccess: () => {
                setDeletingUserId(null);
                setSuccessMessage('User account has been permanently deleted.');
            },
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            <Head title="Manage Users" />

            {/* Header Stats Banner */}
            <div className="users-stats flex justify-between items-center bg-slate-800 p-6 rounded-2xl text-white border border-white/10">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-[#c8102e]">👥</span> User Management
                    </h2>
                    <p className="text-white/70 mt-1">Add, view and manage library staff accounts</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-white/60">Total Users</div>
                    <div id="totalUsers" className="stat-number text-4xl font-bold text-white">
                        {totalUsersCount}
                    </div>
                </div>
            </div>

            {/* Create User Form Card */}
            <div className="user-form-card bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label font-medium text-slate-700 block mb-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="User Name"
                                value={createData.full_name}
                                onChange={(e) => setCreateData('full_name', e.target.value)}
                                className="form-input w-full border border-slate-300 rounded-lg p-2.5 focus:border-[#c8102e] outline-none text-slate-800"
                                required
                            />
                            {createErrors.full_name && (
                                <p className="text-red-500 text-xs mt-1">{createErrors.full_name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label font-medium text-slate-700 block mb-2">Username</label>
                            <input
                                type="text"
                                placeholder="username"
                                value={createData.username}
                                onChange={(e) => setCreateData('username', e.target.value)}
                                className="form-input w-full border border-slate-300 rounded-lg p-2.5 focus:border-[#c8102e] outline-none text-slate-800"
                                required
                            />
                            {createErrors.username && (
                                <p className="text-red-500 text-xs mt-1">{createErrors.username}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label font-medium text-slate-700 block mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="user@libcolla.ph"
                                value={createData.email}
                                onChange={(e) => setCreateData('email', e.target.value)}
                                className="form-input w-full border border-slate-300 rounded-lg p-2.5 focus:border-[#c8102e] outline-none text-slate-800"
                                required
                            />
                            {createErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{createErrors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label font-medium text-slate-700 block mb-2">Role</label>
                            <select
                                value={createData.role}
                                onChange={(e) => setCreateData('role', e.target.value)}
                                className="form-input form-select w-full border border-slate-300 rounded-lg p-2.5 focus:border-[#c8102e] outline-none bg-white text-slate-800"
                                required
                            >
                                <option value="">Select role...</option>
                                <option value="admin">Administrator</option>
                                <option value="librarian">Librarian</option>
                                <option value="staff">Staff</option>
                            </select>
                            {createErrors.role && (
                                <p className="text-red-500 text-xs mt-1">{createErrors.role}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-group w-full md:w-1/2 pr-0 md:pr-3">
                        <label className="form-label font-medium text-slate-700 block mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={createData.password}
                                onChange={(e) => setCreateData('password', e.target.value)}
                                className="form-input pr-12 w-full border border-slate-300 rounded-lg p-2.5 focus:border-[#c8102e] outline-none text-slate-800"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                            >
                                {showPassword ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                        {createErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{createErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={creating}
                        className="btn-primary w-full justify-center bg-[#c8102e] text-white p-3.5 rounded-lg hover:bg-red-800 transition-colors font-medium flex items-center gap-2"
                    >
                        {creating ? 'Creating...' : '+ Create New User'}
                    </button>
                </form>
            </div>

            {/* Existing Users Table Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-xl text-slate-800">Existing Users</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="data-table w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                                <th className="py-3 px-4">Full Name</th>
                                <th className="py-3 px-4">Username</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Joined Date</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-slate-400">
                                        No users found in database.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 font-medium text-slate-800">{u.full_name || u.name}</td>
                                        <td className="py-4 px-4 text-slate-600">@{u.username || 'user'}</td>
                                        <td className="py-4 px-4 text-slate-600">{u.email}</td>
                                        <td className="py-4 px-4">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                                                {u.role || 'staff'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-500 text-sm">
                                            {u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                        </td>
                                        <td className="py-4 px-4 text-center space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(u)}
                                                className="text-blue-500 hover:text-blue-700 transition-colors font-medium text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingUserId(u.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors font-medium text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-xl text-slate-800">Edit User Account</h3>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="text-slate-400 hover:text-slate-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="font-medium text-slate-700 block mb-2 text-sm">Full Name</label>
                                <input
                                    type="text"
                                    value={editData.full_name}
                                    onChange={(e) => setEditData('full_name', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#c8102e] text-slate-800"
                                    required
                                />
                                {editErrors.full_name && (
                                    <p className="text-red-500 text-xs mt-1">{editErrors.full_name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-medium text-slate-700 block mb-2 text-sm">Username</label>
                                    <input
                                        type="text"
                                        value={editData.username}
                                        onChange={(e) => setEditData('username', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#c8102e] text-slate-800"
                                        required
                                    />
                                    {editErrors.username && (
                                        <p className="text-red-500 text-xs mt-1">{editErrors.username}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="font-medium text-slate-700 block mb-2 text-sm">Role</label>
                                    <select
                                        value={editData.role}
                                        onChange={(e) => setEditData('role', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#c8102e] bg-white text-slate-800"
                                        required
                                    >
                                        <option value="admin">Administrator</option>
                                        <option value="librarian">Librarian</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                    {editErrors.role && (
                                        <p className="text-red-500 text-xs mt-1">{editErrors.role}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="font-medium text-slate-700 block mb-2 text-sm">Email Address</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData('email', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#c8102e] text-slate-800"
                                    required
                                />
                                {editErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{editErrors.email}</p>
                                )}
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <label className="font-medium text-slate-700 block mb-2 text-sm">
                                    Reset Password <span className="font-normal text-xs text-slate-400 ml-1">(Leave blank to keep current)</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={editData.password}
                                    onChange={(e) => setEditData('password', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#c8102e] text-slate-800"
                                />
                                {editErrors.password && (
                                    <p className="text-red-500 text-xs mt-1">{editErrors.password}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editing}
                                    className="px-5 py-2.5 bg-[#c8102e] hover:bg-red-800 text-white rounded-xl font-medium"
                                >
                                    {editing ? 'Updating...' : 'Update User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingUserId && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            🗑️
                        </div>
                        <h3 className="font-bold text-2xl text-slate-800 mb-2">Delete User?</h3>
                        <p className="text-slate-500 mb-6 text-sm">
                            Are you sure you want to permanently delete this user account? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingUserId(null)}
                                className="w-full border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDeleteUser}
                                className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup Modal */}
            {successMessage && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-100">
                            ✓
                        </div>
                        <h3 className="font-bold text-2xl text-slate-800 mb-2">Success!</h3>
                        <p className="text-slate-500 mb-6 text-sm">{successMessage}</p>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="w-full bg-[#c8102e] text-white font-semibold py-3 rounded-xl hover:bg-red-800"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
