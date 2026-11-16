import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ShieldAlert,
    Send,
    ArrowLeft,
    CheckCircle2,
    Lock,
    KeyRound,
    UserCheck,
    Loader2,
} from 'lucide-react';

export default function AccessRestricted({
    title = 'Access Restricted',
    message = 'Only authorized staff, librarians, or Administrators can access the Manage Users section.',
    missingPermission = 'Access User Section',
}) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [sent, setSent] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        permissions: [missingPermission],
        reason: '',
    });

    const togglePermission = (perm) => {
        if (data.permissions.includes(perm)) {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== perm)
            );
        } else {
            setData('permissions', [...data.permissions, perm]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/users/request-access', {
            preserveScroll: true,
            onSuccess: () => {
                setSent(true);
                reset('reason');
            },
        });
    };

    return (
        <div className="mx-auto max-w-2xl py-12 px-4 sm:px-6">
            <div className="overflow-hidden rounded-3xl border border-red-200 border-t-4 border-t-[#C44545] bg-white shadow-xl dark:border-white/10 dark:border-t-[#E9A12B] dark:bg-[#161616]">
                <div className="p-8 sm:p-10 text-center">
                    {/* Header Icon */}
                    <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-2xl bg-red-100 text-[#C44545] dark:bg-red-500/10 dark:text-[#E9A12B]">
                        <ShieldAlert className="size-10" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#4B5563] sm:text-3xl dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-[#6B7280] dark:text-white/70 max-w-lg mx-auto">
                        {message}
                    </p>

                    {/* Account Status Pill */}
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F8F8F8] px-4 py-1.5 text-xs font-semibold text-[#4B5563] dark:border-white/10 dark:bg-white/[0.05] dark:text-white/80">
                        <Lock className="size-3.5 text-[#C44545] dark:text-[#E9A12B]" />
                        <span>Signed in as:</span>
                        <span className="font-bold">{user?.name || user?.full_name}</span>
                        <span className="rounded bg-[#A04040]/10 px-2 py-0.5 text-[0.65rem] font-bold text-[#A04040] uppercase dark:bg-[#E9A12B]/20 dark:text-[#E9A12B]">
                            {user?.role || 'Staff'}
                        </span>
                    </div>

                    {sent || flash?.status ? (
                        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
                            <CheckCircle2 className="mx-auto mb-2 size-8 text-emerald-600 dark:text-emerald-400" />
                            <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-200">
                                Request Sent to Administrator
                            </h3>
                            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                                An admin has been notified in their message inbox. You will be able to access this section once approved.
                            </p>
                            <div className="mt-5 flex justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSent(false)}
                                    className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 dark:bg-black/30 dark:border-white/10 dark:text-white"
                                >
                                    Send Another Request
                                </button>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                                >
                                    <ArrowLeft className="size-3.5" /> Return to Dashboard
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Request Access Form */
                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-6 text-left dark:border-white/10 dark:bg-white/[0.03]"
                        >
                            <div className="mb-4 flex items-center gap-2 border-b border-[#E5E5E5] pb-3 dark:border-white/10">
                                <KeyRound className="size-4 text-[#A04040] dark:text-[#E9A12B]" />
                                <h3 className="text-sm font-bold text-[#4B5563] dark:text-white">
                                    Request Access from Admin
                                </h3>
                            </div>

                            <label className="mb-2 block text-xs font-semibold text-[#6B7280] dark:text-white/70">
                                Select Permissions to Request:
                            </label>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {[
                                    { id: 'Access User Section', label: 'Access User Section' },
                                    { id: 'Add', label: 'Add Records' },
                                    { id: 'Edit', label: 'Edit Records' },
                                    { id: 'Delete', label: 'Delete Records' },
                                ].map((perm) => (
                                    <label
                                        key={perm.id}
                                        className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white p-2.5 text-xs font-medium text-[#4B5563] hover:border-[#A04040]/40 dark:border-white/10 dark:bg-black/30 dark:text-white cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.includes(perm.id)}
                                            onChange={() => togglePermission(perm.id)}
                                            className="size-4 rounded accent-[#A04040] cursor-pointer"
                                        />
                                        <span>{perm.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="mb-4">
                                <label className="mb-1 block text-xs font-semibold text-[#6B7280] dark:text-white/70">
                                    Reason / Note (Optional):
                                </label>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    placeholder="Briefly explain why you need these permissions..."
                                    rows={2}
                                    className="w-full rounded-xl border border-[#E5E5E5] bg-white p-3 text-xs text-[#4B5563] outline-none transition focus:border-[#A04040] dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-[#E9A12B]"
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#4B5563] dark:text-white/60 dark:hover:text-white"
                                >
                                    <ArrowLeft className="size-3.5" /> Back to Dashboard
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing || data.permissions.length === 0}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D66C6C] to-[#A04040] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="size-3.5 animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-3.5" />
                                            <span>Send Request to Admin</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
