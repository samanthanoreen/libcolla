import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Users,
    Eye,
    EyeOff,
    UserPlus,
    Pencil,
    Trash2,
    CheckCircle2,
    X,
} from 'lucide-react';

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
        <div className="w-full space-y-8">
            <Head title="Manage Users • LibColla" />

            {/* Header Stats Banner (Matches 1lib Design System) */}
            <div className="users-stats flex justify-between items-center bg-white p-8 rounded-3xl text-[#4B5563] border border-[#E5E5E5] border-t-[3px] border-t-[#E9A12B] shadow-sm dark:bg-white/[0.06] dark:border-white/10 dark:text-white">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 font-['Quicksand',system-ui,sans-serif] text-[#4B5563] dark:text-white">
                        <Users className="size-6 text-[#A04040] dark:text-[#E9A12B]" /> User Management
                    </h2>
                    <p className="text-[#4B5563] dark:text-white/70 mt-1.5 text-sm">Add, view and manage library staff accounts</p>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-wider font-semibold text-[#4B5563] dark:text-white/60">Total Users</div>
                    <div id="totalUsers" className="stat-number text-5xl font-bold text-[#4B5563] dark:text-white font-['Quicksand',system-ui,sans-serif] mt-1">
                        {totalUsersCount}
                    </div>
                </div>
            </div>

            {/* Create User Form Card */}
            <div className="user-form-card bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] dark:bg-white/[0.06] dark:border-white/10">
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Full Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={createData.full_name}
                                onChange={(e) => setCreateData('full_name', e.target.value)}
                                className="form-input w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                required
                            />
                            {createErrors.full_name && (
                                <p className="text-[#C44545] text-xs mt-1">{createErrors.full_name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Username</label>
                            <input
                                type="text"
                                placeholder="username"
                                value={createData.username}
                                onChange={(e) => setCreateData('username', e.target.value)}
                                className="form-input w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                required
                            />
                            {createErrors.username && (
                                <p className="text-[#C44545] text-xs mt-1">{createErrors.username}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Email Address</label>
                            <input
                                type="email"
                                placeholder="user@libcolla.ph"
                                value={createData.email}
                                onChange={(e) => setCreateData('email', e.target.value)}
                                className="form-input w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                required
                            />
                            {createErrors.email && (
                                <p className="text-[#C44545] text-xs mt-1">{createErrors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Role</label>
                            <select
                                value={createData.role}
                                onChange={(e) => setCreateData('role', e.target.value)}
                                className="form-input form-select w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                required
                            >
                                <option value="" className="dark:bg-[#161616]">Select role...</option>
                                <option value="admin" className="dark:bg-[#161616]">Administrator</option>
                                <option value="librarian" className="dark:bg-[#161616]">Librarian</option>
                                <option value="staff" className="dark:bg-[#161616]">Staff</option>
                            </select>
                            {createErrors.role && (
                                <p className="text-[#C44545] text-xs mt-1">{createErrors.role}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-group w-full md:w-1/2 pr-0 md:pr-3">
                        <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={createData.password}
                                onChange={(e) => setCreateData('password', e.target.value)}
                                className="form-input pr-12 w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#4B5563] dark:text-white/60 dark:hover:text-white text-xs font-semibold cursor-pointer"
                            >
                                {showPassword ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                        {createErrors.password && (
                            <p className="text-[#C44545] text-xs mt-1">{createErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={creating}
                        className="btn-primary w-full justify-center bg-gradient-to-r from-[#D66C6C] to-[#A04040] text-white p-3.5 rounded-lg hover:brightness-95 transition-colors font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                        <UserPlus className="size-4" />
                        <span>{creating ? 'Creating...' : 'Create New User'}</span>
                    </button>
                </form>
            </div>

            {/* Existing Users Table Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E5E5] dark:bg-white/[0.06] dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-xl text-[#4B5563] dark:text-white">Existing Users</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="data-table w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-[#E9A12B] bg-[#F8F8F8] text-[#4B5563] uppercase text-xs tracking-wider dark:bg-white/[0.04] dark:text-white">
                                <th className="py-3 px-4 font-bold">Full Name</th>
                                <th className="py-3 px-4 font-bold">Username</th>
                                <th className="py-3 px-4 font-bold">Email</th>
                                <th className="py-3 px-4 font-bold">Role</th>
                                <th className="py-3 px-4 font-bold">Joined Date</th>
                                <th className="py-3 px-4 text-center font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9] dark:divide-white/10">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-[#4B5563] dark:text-white/60">
                                        No users found in database.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-[#F9EDEF] dark:hover:bg-white/[0.05] transition-colors">
                                        <td className="py-4 px-4 font-medium text-[#4B5563] dark:text-white">{u.full_name || u.name}</td>
                                        <td className="py-4 px-4 text-[#4B5563] dark:text-white/70">@{u.username || 'user'}</td>
                                        <td className="py-4 px-4 text-[#4B5563] dark:text-white/70">{u.email}</td>
                                        <td className="py-4 px-4">
                                            <span className="bg-[#F9EDEF] text-[#A04040] px-3 py-1 rounded-full text-xs font-semibold uppercase dark:bg-white/10 dark:text-white">
                                                {u.role || 'staff'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-[#4B5563] dark:text-white/60 text-sm">
                                            {u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                        </td>
                                        <td className="py-4 px-4 text-center space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(u)}
                                                className="inline-flex items-center gap-1 text-[#3478B9] hover:text-[#255e94] dark:text-sky-400 dark:hover:text-sky-300 transition-colors font-medium text-sm cursor-pointer"
                                            >
                                                <Pencil className="size-3.5" /> Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingUserId(u.id)}
                                                className="inline-flex items-center gap-1 text-[#C44545] hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors font-medium text-sm cursor-pointer"
                                            >
                                                <Trash2 className="size-3.5" /> Delete
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
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-[#E5E5E5] dark:bg-[#161616] dark:border-white/10 dark:text-white">
                        <div className="flex justify-between items-center mb-6 border-b border-[#E5E5E5] pb-4 dark:border-white/10">
                            <h3 className="font-bold text-xl text-[#4B5563] dark:text-white flex items-center gap-2">
                                <Pencil className="size-5 text-[#A04040] dark:text-[#E9A12B]" /> Edit User Account
                            </h3>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="text-[#4B5563] hover:text-[#4B5563] dark:text-white/60 dark:hover:text-white text-xl cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Full Name</label>
                                <input
                                    type="text"
                                    value={editData.full_name}
                                    onChange={(e) => setEditData('full_name', e.target.value)}
                                    className="w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                    required
                                />
                                {editErrors.full_name && (
                                    <p className="text-[#C44545] text-xs mt-1">{editErrors.full_name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Username</label>
                                    <input
                                        type="text"
                                        value={editData.username}
                                        onChange={(e) => setEditData('username', e.target.value)}
                                        className="w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                        required
                                    />
                                    {editErrors.username && (
                                        <p className="text-[#C44545] text-xs mt-1">{editErrors.username}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Role</label>
                                    <select
                                        value={editData.role}
                                        onChange={(e) => setEditData('role', e.target.value)}
                                        className="w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                        required
                                    >
                                        <option value="admin">Administrator</option>
                                        <option value="librarian">Librarian</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                    {editErrors.role && (
                                        <p className="text-[#C44545] text-xs mt-1">{editErrors.role}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">Email Address</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData('email', e.target.value)}
                                    className="w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                    required
                                />
                                {editErrors.email && (
                                    <p className="text-[#C44545] text-xs mt-1">{editErrors.email}</p>
                                )}
                            </div>

                            <div className="bg-[#F8F8F8] p-4 rounded-xl border border-[#E5E5E5] dark:bg-white/[0.04] dark:border-white/10">
                                <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                    Reset Password <span className="font-normal text-xs text-[#4B5563] dark:text-white/60 ml-1">(Leave blank to keep current)</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={editData.password}
                                    onChange={(e) => setEditData('password', e.target.value)}
                                    className="w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                />
                                {editErrors.password && (
                                    <p className="text-[#C44545] text-xs mt-1">{editErrors.password}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#4B5563] hover:bg-[#F8F8F8] font-medium dark:border-white/10 dark:text-white dark:hover:bg-white/10 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editing}
                                    className="px-5 py-2.5 bg-gradient-to-r from-[#D66C6C] to-[#A04040] hover:brightness-95 text-white rounded-xl font-medium cursor-pointer shadow-sm"
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
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-[#E5E5E5] dark:bg-[#161616] dark:border-white/10 dark:text-white">
                        <div className="w-16 h-16 bg-[#fee2e2] text-[#C44545] rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-rose-950/40 dark:text-rose-400">
                            <Trash2 className="size-8" />
                        </div>
                        <h3 className="font-bold text-2xl text-[#4B5563] dark:text-white mb-2">Delete User?</h3>
                        <p className="text-[#4B5563] dark:text-white/60 mb-6 text-sm">
                            Are you sure you want to permanently delete this user account? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingUserId(null)}
                                className="w-full border border-[#E5E5E5] text-[#4B5563] font-semibold py-3 rounded-xl hover:bg-[#F8F8F8] dark:border-white/10 dark:text-white dark:hover:bg-white/10 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDeleteUser}
                                className="w-full bg-[#C44545] text-white font-semibold py-3 rounded-xl hover:bg-[#a73535] cursor-pointer shadow-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup Modal */}
            {successMessage && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-[#E5E5E5] dark:bg-[#161616] dark:border-white/10 dark:text-white">
                        <div className="w-16 h-16 bg-[#21865A]/10 text-[#21865A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#21865A]/20">
                            <CheckCircle2 className="size-8" />
                        </div>
                        <h3 className="font-bold text-2xl text-[#4B5563] dark:text-white mb-2">Success!</h3>
                        <p className="text-[#4B5563] dark:text-white/70 mb-6 text-sm">{successMessage}</p>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="w-full bg-gradient-to-r from-[#D66C6C] to-[#A04040] text-white font-semibold py-3 rounded-xl hover:brightness-95 cursor-pointer shadow-sm"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}