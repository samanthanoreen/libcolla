import { Link, router, useForm } from '@inertiajs/react';
import {
    GraduationCap,
    Pencil,
    Plus,
    Search,
    Trash2,
    TriangleAlert,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
    Field,
    Modal,
    ModalHeader,
    btnDanger,
    btnPrimary,
    btnSecondary,
    inputCls,
} from '@/components/crud-ui';
import { LEVELS, PROGRAM_CATALOG } from '@/lib/programCatalog';

const libcollaTheme = {
    colorScheme: 'light',
    color: '#1e293b',
    '--color-background': '#ffffff',
    '--color-foreground': '#1e293b',
    '--color-card': '#ffffff',
    '--color-card-foreground': '#1e293b',
    '--color-popover': '#ffffff',
    '--color-popover-foreground': '#1e293b',
    '--color-primary': '#9f1239',
    '--color-primary-foreground': '#ffffff',
    '--color-muted': '#f1f5f9',
    '--color-muted-foreground': '#64748b',
    '--color-accent': '#e2e8f0',
    '--color-accent-foreground': '#1e293b',
    '--color-destructive': '#dc2626',
    '--color-border': '#e2e8f0',
    '--color-input': '#cbd5e1',
    '--color-ring': '#9f1239',
};

const serif = {
    fontFamily: '"Source Serif 4", "Playfair Display", Georgia, serif',
};

export default function Index({ programs, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [field, setField] = useState(filters.field || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const mounted = useRef(false);

    const visit = () =>
        router.get(
            '/programs',
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
    }, [search, field, perPage]);

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const form = useForm({
        college: '',
        program_name: '',
        major: '',
        level: 'Bachelor',
    });

    const closeForm = () => {
        setFormOpen(false);
        form.clearErrors();
    };

    const openAdd = () => {
        setEditing(null);
        form.setData({
            college: '',
            program_name: '',
            major: '',
            level: 'Bachelor',
        });
        form.clearErrors();
        setFormOpen(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        form.setData({
            college: p.college || '',
            program_name: p.program_name || '',
            major: p.major || '',
            level: p.level || 'Bachelor',
        });
        form.clearErrors();
        setFormOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: closeForm };
        if (editing) form.put(`/programs/${editing.id}`, opts);
        else form.post('/programs', opts);
    };

    const withCurrent = (list, current) =>
        current && !list.includes(current) ? [...list, current] : list;
    const colleges = withCurrent(
        Object.keys(PROGRAM_CATALOG),
        form.data.college,
    );
    const programOptions = withCurrent(
        Object.keys(PROGRAM_CATALOG[form.data.college] || {}),
        form.data.program_name,
    );
    const majorOptions = withCurrent(
        PROGRAM_CATALOG[form.data.college]?.[form.data.program_name] || [],
        form.data.major,
    );

    const [deleting, setDeleting] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    const confirmDelete = () => {
        if (!deleting) return;
        router.delete(`/programs/${deleting.id}`, {
            preserveScroll: true,
            onStart: () => setDeleteBusy(true),
            onFinish: () => {
                setDeleteBusy(false);
                setDeleting(null);
            },
        });
    };

    const rows = programs?.data ?? [];

    return (
        <div style={libcollaTheme} className="mx-auto w-full max-w-5xl">
            <div className="mt-4 overflow-hidden rounded-[2rem] bg-white text-[#1e293b] shadow-2xl">
                <div className="flex items-center justify-between border-b-2 border-[#d4a017] bg-[#f8fafc] px-8 py-6">
                    <h1
                        className="flex items-center gap-3 text-2xl font-bold"
                        style={serif}
                    >
                        <GraduationCap className="size-6" />
                        Academic Programs
                    </h1>
                    <button
                        type="button"
                        onClick={openAdd}
                        className={btnPrimary}
                    >
                        <Plus className="size-4" />
                        ADD PROGRAM
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
                            placeholder="Search programs..."
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
                            <option value="college">College</option>
                            <option value="name">Program Name</option>
                            <option value="major">Major / Track</option>
                        </select>
                        <button type="submit" className={btnPrimary}>
                            <Search className="size-4" />
                            SEARCH
                        </button>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b-2 border-[#d4a017] bg-[#f1f5f9] text-xs tracking-wide text-[#334155] uppercase">
                                    <th className="w-32 px-5 py-4 font-bold">
                                        College
                                    </th>
                                    <th className="px-5 py-4 font-bold">
                                        Program Name
                                    </th>
                                    <th className="w-1/4 px-5 py-4 font-bold">
                                        Major / Track
                                    </th>
                                    <th className="w-20 px-5 py-4 text-center font-bold">
                                        Level
                                    </th>
                                    <th className="w-20 px-5 py-4 text-center font-bold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {rows.length > 0 ? (
                                    rows.map((p) => (
                                        <tr
                                            key={p.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/programs/${p.id}/prospectus`,
                                                )
                                            }
                                            className="cursor-pointer transition hover:bg-[#fdf2f8]"
                                        >
                                            <td className="px-5 py-3 text-sm text-[#475569]">
                                                {p.college}
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-[#1e293b]">
                                                {p.program_name}
                                            </td>
                                            <td className="px-5 py-3 text-sm text-[#64748b]">
                                                {p.major || (
                                                    <span className="opacity-50">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-center text-sm text-[#64748b]">
                                                {p.level}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEdit(p);
                                                        }}
                                                        className="rounded-md bg-[#f1f5f9] p-2 text-[#475569] transition hover:bg-[#fef3c7] hover:text-[#d97706]"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleting(p);
                                                        }}
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
                                            colSpan={5}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            No programs found.{' '}
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

                        {programs?.links && programs.links.length > 3 && (
                            <div className="flex items-center gap-1">
                                {programs.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`rounded-md border px-3 py-1.5 text-xs transition ${
                                            link.active
                                                ? 'border-primary bg-primary text-primary-foreground font-bold'
                                                : 'bg-background text-foreground hover:bg-muted'
                                        } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal open={formOpen} onClose={closeForm}>
                <form onSubmit={submit}>
                    <ModalHeader
                        title={editing ? 'Edit Program' : 'Add Program'}
                        onClose={closeForm}
                    />

                    <div className="space-y-4 px-6 py-5">
                        <Field
                            label="College"
                            required
                            error={form.errors.college}
                        >
                            <select
                                value={form.data.college}
                                onChange={(e) =>
                                    form.setData({
                                        ...form.data,
                                        college: e.target.value,
                                        program_name: '',
                                        major: '',
                                    })
                                }
                                className={`${inputCls} w-full`}
                            >
                                <option value="">Select College</option>
                                {colleges.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label="Program Name"
                            required
                            error={form.errors.program_name}
                        >
                            <select
                                value={form.data.program_name}
                                disabled={!form.data.college}
                                onChange={(e) =>
                                    form.setData({
                                        ...form.data,
                                        program_name: e.target.value,
                                        major: '',
                                    })
                                }
                                className={`${inputCls} w-full`}
                            >
                                <option value="">
                                    {form.data.college
                                        ? 'Select Program'
                                        : 'Select College first'}
                                </option>
                                {programOptions.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label="Major / Specialization Track"
                            error={form.errors.major}
                        >
                            <select
                                value={form.data.major}
                                disabled={!form.data.program_name}
                                onChange={(e) =>
                                    form.setData('major', e.target.value)
                                }
                                className={`${inputCls} w-full`}
                            >
                                <option value="">
                                    {form.data.program_name
                                        ? 'No major / general'
                                        : 'Select Program first'}
                                </option>
                                {majorOptions.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Level" error={form.errors.level}>
                            <select
                                value={form.data.level}
                                onChange={(e) =>
                                    form.setData('level', e.target.value)
                                }
                                className={`${inputCls} w-full`}
                            >
                                {LEVELS.map((l) => (
                                    <option key={l} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </select>
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
                            {form.processing ? 'SAVING...' : 'SAVE PROGRAM'}
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
                    <h3 className="text-lg font-semibold">Delete Program?</h3>
                    <p className="text-muted-foreground mt-2 mb-6 text-sm">
                        This will permanently remove{' '}
                        <strong className="text-foreground">
                            {deleting?.program_name}
                        </strong>{' '}
                        and its prospectus, subjects, and books.
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
