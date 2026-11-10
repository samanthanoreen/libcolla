import { Link, router, useForm } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Search,
    Trash2,
    TriangleAlert,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    btnDanger,
    btnPrimary,
    btnSecondary,
    Field,
    inputCls,
    Modal,
    ModalHeader,
} from '@/components/crud-ui';
import { libcollaTheme, serif } from '@/lib/libcollaTheme';

export default function Index({ users, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [field, setField] = useState(filters.field || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const mounted = useRef(false);

    const visit = () =>
        router.get(
            '/users',
            { search, field, per_page: perPage },
            { preserveState: true, preserveScroll: true, replace: true },
        );

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        const t = setTimeout(visit, 300);
        return () => clearTimeout(t);
    }, [visit]);

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const form = useForm({
        name: '',
        email: '',
        password: '',
    });

    const closeForm = () => {
        setFormOpen(false);
        form.clearErrors();
    };

    const openAdd = () => {
        setEditing(null);
        form.setData({ name: '', email: '', password: '' });
        form.clearErrors();
        setFormOpen(true);
    };

    const openEdit = (u) => {
        setEditing(u);
        form.setData({
            name: u.name || '',
            email: u.email || '',
            password: '',
        });
        form.clearErrors();
        setFormOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: closeForm };
        if (editing) form.put(`/users/${editing.id}`, opts);
        else form.post('/users', opts);
    };

    const [deleting, setDeleting] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    const confirmDelete = () => {
        if (!deleting) return;
        router.delete(`/users/${deleting.id}`, {
            preserveScroll: true,
            onStart: () => setDeleteBusy(true),
            onFinish: () => {
                setDeleteBusy(false);
                setDeleting(null);
            },
        });
    };

    const rows = users?.data ?? [];

    return (
        <div style={libcollaTheme} className="mx-auto w-full max-w-5xl">
            <div className="mt-4 overflow-hidden rounded-[2rem] bg-white text-[#1e293b] shadow-2xl">
                <div className="flex items-center justify-between border-b-2 border-[#d4a017] bg-[#f8fafc] px-8 py-6">
                    <h1
                        className="flex items-center gap-3 text-xl font-bold sm:text-2xl"
                        style={serif}
                    >
                        <Users className="size-6" />
                        Manage Users
                    </h1>
                    <button
                        type="button"
                        onClick={openAdd}
                        className={`${btnPrimary} shrink-0 whitespace-nowrap`}
                    >
                        <Plus className="size-4" />
                        ADD USER
                    </button>
                </div>

                <div className="space-y-5 p-8">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            visit();
                        }}
                        className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#f8fafc] p-5 ring-1 ring-[#f1f5f9]"
                    >
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputCls} min-w-[200px] flex-1 rounded-xl py-3`}
                        />
                        <select
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                            className={`${inputCls} w-40 rounded-xl py-3`}
                        >
                            <option value="all">All Fields</option>
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                        </select>
                        <button type="submit" className={btnPrimary}>
                            <Search className="size-4" />
                            SEARCH
                        </button>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b-2 border-[#d4a017] bg-[#f1f5f9] text-xs tracking-wide text-[#334155] uppercase">
                                    <th className="w-1/3 px-5 py-4 font-bold">
                                        Name
                                    </th>
                                    <th className="px-5 py-4 font-bold">
                                        Email
                                    </th>
                                    <th className="w-44 px-5 py-4 font-bold">
                                        Created
                                    </th>
                                    <th className="w-20 px-5 py-4 text-center font-bold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {rows.length > 0 ? (
                                    rows.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="transition hover:bg-[#fdf2f8]"
                                        >
                                            <td className="px-5 py-3 font-semibold text-[#1e293b]">
                                                {u.name}
                                            </td>
                                            <td className="px-5 py-3 text-sm text-[#475569]">
                                                {u.email}
                                            </td>
                                            <td className="px-5 py-3 text-sm text-[#64748b]">
                                                {u.created_at
                                                    ? new Date(
                                                          u.created_at,
                                                      ).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEdit(u)
                                                        }
                                                        className="rounded-md bg-[#f1f5f9] p-2 text-[#475569] transition hover:bg-[#fef3c7] hover:text-[#d97706]"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        onClick={() =>
                                                            setDeleting(u)
                                                        }
                                                        className="rounded-md bg-[#f1f5f9] p-2 text-[#475569] transition hover:bg-[#fee2e2] hover:text-[#ef4444]"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            No users found.{' '}
                                            <button
                                                type="button"
                                                onClick={openAdd}
                                                className="text-foreground font-semibold underline"
                                            >
                                                Add one?
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <label className="text-muted-foreground flex items-center gap-2 text-xs">
                            Rows per page
                            <select
                                value={perPage}
                                onChange={(e) =>
                                    setPerPage(Number(e.target.value))
                                }
                                className="border-input bg-background text-foreground rounded-md border px-2 py-1 text-xs"
                            >
                                {[10, 15, 25, 50].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {users?.links && users.links.length > 3 && (
                            <div className="flex items-center gap-1">
                                {users.links.map((link, i) => {
                                    const cls = `rounded-md border px-3 py-1.5 text-xs transition ${
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground font-bold'
                                            : 'bg-background text-foreground hover:bg-muted'
                                    }`;

                                    return link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={cls}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={`${cls} opacity-40`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal open={formOpen} onClose={closeForm}>
                <form onSubmit={submit}>
                    <ModalHeader
                        title={editing ? 'Edit User' : 'Add User'}
                        onClose={closeForm}
                    />

                    <div className="space-y-4 px-6 py-5">
                        <Field
                            label="Name"
                            required
                            error={form.errors.name}
                        >
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                className={`${inputCls} w-full`}
                                placeholder="Full name"
                            />
                        </Field>

                        <Field
                            label="Email"
                            required
                            error={form.errors.email}
                        >
                            <input
                                type="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                className={`${inputCls} w-full`}
                                placeholder="user@example.com"
                            />
                        </Field>

                        <Field
                            label={editing ? 'New Password (leave blank to keep)' : 'Password'}
                            required={!editing}
                            error={form.errors.password}
                        >
                            <input
                                type="password"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                className={`${inputCls} w-full`}
                                placeholder={editing ? '••••••••' : 'Enter password'}
                            />
                        </Field>
                    </div>

                    <div className="border-border flex justify-end gap-3 border-t px-6 py-4">
                        <button
                            type="button"
                            onClick={closeForm}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className={btnPrimary}
                        >
                            {form.processing ? 'SAVING...' : 'SAVE USER'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={!!deleting}
                onClose={() => setDeleting(null)}
                size="max-w-sm"
            >
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#fee2e2]">
                        <TriangleAlert className="size-7 text-[#ef4444]" />
                    </div>
                    <h3 className="text-lg font-semibold">Delete User?</h3>
                    <p className="text-muted-foreground mt-2 mb-6 text-sm">
                        This will permanently remove{' '}
                        <strong className="text-foreground">
                            {deleting?.name}
                        </strong>{' '}
                        ({deleting?.email}).
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setDeleting(null)}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            disabled={deleteBusy}
                            onClick={confirmDelete}
                            className={btnDanger}
                        >
                            {deleteBusy ? 'DELETING...' : 'CONFIRM'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
