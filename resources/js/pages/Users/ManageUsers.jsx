import React, { useEffect, useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import {
    Users,
    Eye,
    EyeOff,
    UserPlus,
    Pencil,
    Trash2,
    CheckCircle2,
    X,
    ShieldCheck,
    ShieldAlert,
    Lock,
    KeyRound,
    UserCheck,
} from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import AccessRestricted from '@/components/access-restricted';

export default function ManageUsers({ users = [], totalUsersCount = 0, accessRestricted = false }) {
    const { user: currentUser, isAdmin, canAdd, canEdit, canDelete, canAccessUsers } = usePermissions();

    // If access is restricted by server or client permissions check
    if (accessRestricted || (!isAdmin && !canAccessUsers)) {
        return (
            <div className="w-full">
                <Head title="Access Restricted • LibColla" />
                <AccessRestricted
                    title="Access Restricted"
                    message="Only authorized users or Admins can access the Manage Users section."
                    missingPermission="Access User Section"
                />
            </div>
        );
    }

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
        role: 'staff',
        password: '',
        permissions: {
            can_add: false,
            can_edit: false,
            can_delete: false,
            can_access_users: false,
        },
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
        role: 'staff',
        password: '',
        permissions: {
            can_add: false,
            can_edit: false,
            can_delete: false,
            can_access_users: false,
        },
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
        const perms = user.permissions || {};
        setEditData({
            full_name: user.full_name || user.name || '',
            username: user.username || '',
            email: user.email || '',
            role: user.role || 'staff',
            password: '',
            permissions: {
                can_add: Boolean(user.can_add ?? perms.can_add ?? false),
                can_edit: Boolean(user.can_edit ?? perms.can_edit ?? false),
                can_delete: Boolean(user.can_delete ?? perms.can_delete ?? false),
                can_access_users: Boolean(user.can_access_users ?? perms.can_access_users ?? false),
            },
        });
    };

    useEffect(() => {
        if (typeof window === 'undefined' || users.length === 0 || !canEdit) return;
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('edit');
        if (!editId) return;
        const targetUser = users.find((u) => String(u.id) === String(editId));
        if (targetUser) {
            openEditModal(targetUser);
        }
    }, [users, canEdit]);

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

    const toggleCreatePerm = (key) => {
        setCreateData('permissions', {
            ...createData.permissions,
            [key]: !createData.permissions[key],
        });
    };

    const toggleEditPerm = (key) => {
        setEditData('permissions', {
            ...editData.permissions,
            [key]: !editData.permissions[key],
        });
    };

    return (
        <div className="w-full space-y-8">
            <Head title="Manage Users • LibColla" />

            {/* Header Stats Banner */}
            <div className="users-stats flex justify-between items-center bg-white p-8 rounded-3xl text-[#4B5563] border border-[#E5E5E5] border-t-[3px] border-t-[#E9A12B] shadow-sm dark:bg-white/[0.06] dark:border-white/10 dark:text-white">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 font-['Quicksand',system-ui,sans-serif] text-[#4B5563] dark:text-white">
                        <Users className="size-6 text-[#A04040] dark:text-[#E9A12B]" /> User Management
                    </h2>
                    <p className="text-[#4B5563] dark:text-white/70 mt-1.5 text-sm">
                        Add, view and manage library staff accounts & role-based permissions
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-wider font-semibold text-[#4B5563] dark:text-white/60">
                        Total Users
                    </div>
                    <div className="stat-number text-5xl font-bold text-[#4B5563] dark:text-white font-['Quicksand',system-ui,sans-serif] mt-1">
                        {totalUsersCount}
                    </div>
                </div>
            </div>

            {/* Success Notification Alert */}
            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-400 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-sm dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-sm">{successMessage}</span>
                    </div>
                    <button
                        onClick={() => setSuccessMessage(null)}
                        className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 cursor-pointer"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            )}

            {/* Create User Form Card (Only if user has Add permission or is Admin) */}
            {canAdd ? (
                <div className="user-form-card bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] dark:bg-white/[0.06] dark:border-white/10">
                    <div className="mb-6 flex items-center justify-between border-b border-[#E5E5E5] pb-4 dark:border-white/10">
                        <h3 className="font-bold text-lg text-[#4B5563] dark:text-white flex items-center gap-2">
                            <UserPlus className="size-5 text-[#A04040] dark:text-[#E9A12B]" />
                            Create New User Account
                        </h3>
                    </div>

                    <form onSubmit={handleCreateSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                    Full Name
                                </label>
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
                                <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                    Username
                                </label>
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
                                <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="user@gmail.com"
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
                                <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                    Role
                                </label>
                                <select
                                    value={createData.role}
                                    onChange={(e) => setCreateData('role', e.target.value)}
                                    className="form-input form-select w-full border border-[#E5E5E5] bg-white rounded-lg p-2.5 outline-none transition focus:border-[#A04040] text-[#4B5563] dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#E9A12B]"
                                    required
                                >
                                    <option value="admin" className="dark:bg-[#161616]">Administrator</option>
                                    <option value="librarian" className="dark:bg-[#161616]">Librarian</option>
                                    <option value="staff" className="dark:bg-[#161616]">Staff</option>
                                </select>
                                {createErrors.role && (
                                    <p className="text-[#C44545] text-xs mt-1">{createErrors.role}</p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group w-full md:w-1/2 pr-0 md:pr-3">
                            <label className="form-label font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                Password
                            </label>
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

                        {/* Permissions Section */}
                        {createData.role === 'admin' ? (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 flex items-center gap-2.5 font-medium">
                                <ShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <span>
                                    Administrator accounts automatically have full access to all permissions (Add, Edit, Delete, and Access User Section) by default.
                                </span>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-5 dark:border-white/10 dark:bg-white/[0.03]">
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="text-sm font-bold text-[#4B5563] dark:text-white flex items-center gap-2">
                                        <KeyRound className="size-4 text-[#A04040] dark:text-[#E9A12B]" />
                                        Permissions for {createData.role === 'librarian' ? 'Librarian' : 'Staff'}
                                    </label>
                                    <span className="text-[0.7rem] font-medium text-[#6B7280] dark:text-white/60">
                                        Select permitted actions
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E5E5] bg-white dark:border-white/10 dark:bg-black/20 cursor-pointer hover:border-[#A04040]/50 transition">
                                        <input
                                            type="checkbox"
                                            checked={createData.permissions.can_add}
                                            onChange={() => toggleCreatePerm('can_add')}
                                            className="mt-0.5 size-4 rounded accent-[#A04040] cursor-pointer"
                                        />
                                        <div>
                                            <span className="block text-xs font-bold text-[#4B5563] dark:text-white">Add</span>
                                            <span className="text-[0.65rem] text-[#6B7280] dark:text-white/60">Create records</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E5E5] bg-white dark:border-white/10 dark:bg-black/20 cursor-pointer hover:border-[#A04040]/50 transition">
                                        <input
                                            type="checkbox"
                                            checked={createData.permissions.can_edit}
                                            onChange={() => toggleCreatePerm('can_edit')}
                                            className="mt-0.5 size-4 rounded accent-[#A04040] cursor-pointer"
                                        />
                                        <div>
                                            <span className="block text-xs font-bold text-[#4B5563] dark:text-white">Edit</span>
                                            <span className="text-[0.65rem] text-[#6B7280] dark:text-white/60">Modify records</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E5E5] bg-white dark:border-white/10 dark:bg-black/20 cursor-pointer hover:border-[#A04040]/50 transition">
                                        <input
                                            type="checkbox"
                                            checked={createData.permissions.can_delete}
                                            onChange={() => toggleCreatePerm('can_delete')}
                                            className="mt-0.5 size-4 rounded accent-[#A04040] cursor-pointer"
                                        />
                                        <div>
                                            <span className="block text-xs font-bold text-[#4B5563] dark:text-white">Delete</span>
                                            <span className="text-[0.65rem] text-[#6B7280] dark:text-white/60">Delete records</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E5E5] bg-white dark:border-white/10 dark:bg-black/20 cursor-pointer hover:border-[#A04040]/50 transition">
                                        <input
                                            type="checkbox"
                                            checked={createData.permissions.can_access_users}
                                            onChange={() => toggleCreatePerm('can_access_users')}
                                            className="mt-0.5 size-4 rounded accent-[#A04040] cursor-pointer"
                                        />
                                        <div>
                                            <span className="block text-xs font-bold text-[#4B5563] dark:text-white">Access Users</span>
                                            <span className="text-[0.65rem] text-[#6B7280] dark:text-white/60">Manage Users area</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

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
            ) : null}

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
                                <th className="py-3 px-4 font-bold">Permissions</th>
                                <th className="py-3 px-4 font-bold">Joined Date</th>
                                <th className="py-3 px-4 text-center font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9] dark:divide-white/10">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-[#4B5563] dark:text-white/60">
                                        No users found in database.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const userIsAdmin = String(u.role || '').toLowerCase() === 'admin';
                                    const p = u.permissions || {};
                                    const hasAdd = userIsAdmin || Boolean(u.can_add ?? p.can_add);
                                    const hasEdit = userIsAdmin || Boolean(u.can_edit ?? p.can_edit);
                                    const hasDelete = userIsAdmin || Boolean(u.can_delete ?? p.can_delete);
                                    const hasUsers = userIsAdmin || Boolean(u.can_access_users ?? p.can_access_users);
                                    const noPerms = !userIsAdmin && !hasAdd && !hasEdit && !hasDelete && !hasUsers;

                                    return (
                                        <tr key={u.id} className="hover:bg-[#F9EDEF] dark:hover:bg-white/[0.05] transition-colors">
                                            <td className="py-4 px-4 font-medium text-[#4B5563] dark:text-white">
                                                {u.full_name || u.name}
                                            </td>
                                            <td className="py-4 px-4 text-[#4B5563] dark:text-white/70">
                                                @{u.username || 'user'}
                                            </td>
                                            <td className="py-4 px-4 text-[#4B5563] dark:text-white/70">
                                                {u.email}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                                    userIsAdmin
                                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                                        : u.role === 'librarian'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                        : 'bg-[#F9EDEF] text-[#A04040] dark:bg-white/10 dark:text-white'
                                                }`}>
                                                    {u.role || 'staff'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                {userIsAdmin ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                        <ShieldCheck className="size-3" /> Full Access
                                                    </span>
                                                ) : noPerms ? (
                                                    <span className="text-[0.7rem] text-[#9CA3AF] italic">
                                                        No permissions
                                                    </span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {hasAdd && (
                                                            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[0.62rem] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                                                                +Add
                                                            </span>
                                                        )}
                                                        {hasEdit && (
                                                            <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[0.62rem] font-bold text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800">
                                                                ✎Edit
                                                            </span>
                                                        )}
                                                        {hasDelete && (
                                                            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[0.62rem] font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                                                                ✕Del
                                                            </span>
                                                        )}
                                                        {hasUsers && (
                                                            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[0.62rem] font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                                                                👤Users
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-[#4B5563] dark:text-white/60 text-sm">
                                                {u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                            </td>
                                            <td className="py-4 px-4 text-center space-x-3">
                                                {canEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(u)}
                                                        className="inline-flex items-center gap-1 text-[#3478B9] hover:text-[#255e94] dark:text-sky-400 dark:hover:text-sky-300 transition-colors font-medium text-sm cursor-pointer"
                                                    >
                                                        <Pencil className="size-3.5" /> Edit
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingUserId(u.id)}
                                                        className="inline-flex items-center gap-1 text-[#C44545] hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors font-medium text-sm cursor-pointer"
                                                    >
                                                        <Trash2 className="size-3.5" /> Delete
                                                    </button>
                                                )}
                                                {!canEdit && !canDelete && (
                                                    <span className="text-xs text-[#9CA3AF] italic">View Only</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-[#E5E5E5] dark:bg-[#161616] dark:border-white/10 dark:text-white my-8">
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
                                <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                    Full Name
                                </label>
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
                                    <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                        Username
                                    </label>
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
                                    <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                        Role
                                    </label>
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
                                <label className="font-medium text-[#4B5563] dark:text-white block mb-2 text-sm">
                                    Email Address
                                </label>
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

                            {/* Permissions in Edit Modal */}
                            {editData.role === 'admin' ? (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 flex items-center gap-2 font-medium">
                                    <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    <span>Administrator accounts automatically have full access to all permissions by default.</span>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                    <div className="mb-2.5 flex items-center justify-between">
                                        <label className="text-xs font-bold text-[#4B5563] dark:text-white flex items-center gap-1.5">
                                            <KeyRound className="size-3.5 text-[#A04040] dark:text-[#E9A12B]" />
                                            Permissions ({editData.role === 'librarian' ? 'Librarian' : 'Staff'})
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:border-white/10 dark:bg-black/20 cursor-pointer text-xs font-medium">
                                            <input
                                                type="checkbox"
                                                checked={editData.permissions.can_add}
                                                onChange={() => toggleEditPerm('can_add')}
                                                className="size-4 rounded accent-[#A04040] cursor-pointer"
                                            />
                                            <span>Add Records</span>
                                        </label>

                                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:border-white/10 dark:bg-black/20 cursor-pointer text-xs font-medium">
                                            <input
                                                type="checkbox"
                                                checked={editData.permissions.can_edit}
                                                onChange={() => toggleEditPerm('can_edit')}
                                                className="size-4 rounded accent-[#A04040] cursor-pointer"
                                            />
                                            <span>Edit Records</span>
                                        </label>

                                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:border-white/10 dark:bg-black/20 cursor-pointer text-xs font-medium">
                                            <input
                                                type="checkbox"
                                                checked={editData.permissions.can_delete}
                                                onChange={() => toggleEditPerm('can_delete')}
                                                className="size-4 rounded accent-[#A04040] cursor-pointer"
                                            />
                                            <span>Delete Records</span>
                                        </label>

                                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E5E5E5] bg-white dark:border-white/10 dark:bg-black/20 cursor-pointer text-xs font-medium">
                                            <input
                                                type="checkbox"
                                                checked={editData.permissions.can_access_users}
                                                onChange={() => toggleEditPerm('can_access_users')}
                                                className="size-4 rounded accent-[#A04040] cursor-pointer"
                                            />
                                            <span>Access User Section</span>
                                        </label>
                                    </div>
                                </div>
                            )}

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
                                    className="px-5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#4B5563] hover:bg-[#F8F8F8] font-medium dark:border-white/10 dark:text-white dark:hover:bg-white/10 cursor-pointer text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editing}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D66C6C] to-[#A04040] text-white font-medium hover:brightness-95 cursor-pointer disabled:opacity-50 text-sm shadow-sm"
                                >
                                    {editing ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingUserId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#E5E5E5] dark:bg-[#161616] dark:border-white/10 dark:text-white text-center">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-100 text-[#C44545] dark:bg-red-500/10">
                            <Trash2 className="size-6" />
                        </div>
                        <h4 className="font-bold text-lg text-[#4B5563] dark:text-white mb-2">Delete User Account?</h4>
                        <p className="text-[#4B5563] dark:text-white/70 text-sm mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingUserId(null)}
                                className="px-4 py-2 rounded-lg border border-[#E5E5E5] text-[#4B5563] hover:bg-[#F8F8F8] font-medium dark:border-white/10 dark:text-white text-xs cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={executeDeleteUser}
                                className="px-5 py-2 rounded-lg bg-[#C44545] text-white font-semibold hover:bg-red-700 text-xs shadow-sm cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
