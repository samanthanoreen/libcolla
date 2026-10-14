import { Link, router, useForm } from '@inertiajs/react';
import { GraduationCap, Pencil, Plus, Search, Trash2, TriangleAlert } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Field, Modal, ModalHeader, btnDanger, btnPrimary, btnSecondary, inputCls } from '@/components/crud-ui';
import { LEVELS, PROGRAM_CATALOG } from '@/lib/programCatalog';

export default function Index({ programs, filters = {} }) {
    // Search and filter (debounced)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, field, perPage]);

    // Add / edit modal
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const form = useForm({ college: '', program_name: '', major: '', level: 'Bachelor' });

    const closeForm = () => {
        setFormOpen(false);
        form.clearErrors();
    };

    const openAdd = () => {
        setEditing(null);
        form.setData({ college: '', program_name: '', major: '', level: 'Bachelor' });
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

    // Cascading dropdowns. A saved value missing from the catalog is kept so edits never blank it.
    const withCurrent = (list, current) => (current && !list.includes(current) ? [...list, current] : list);
    const colleges = withCurrent(Object.keys(PROGRAM_CATALOG), form.data.college);
    const programOptions = withCurrent(Object.keys(PROGRAM_CATALOG[form.data.college] || {}), form.data.program_name);
    const majorOptions = withCurrent(PROGRAM_CATALOG[form.data.college]?.[form.data.program_name] || [], form.data.major);

    // Delete modal
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
        <div className="p-6 md:p-10">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-8 py-6">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                        <GraduationCap className="size-6" />
                        Academic Programs
                    </h1>
                    <button type="button" onClick={openAdd} className={btnPrimary}>
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
                        className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 p-5"
                    >
                        <input
                            type="text"
                            placeholder="Search programs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputCls} min-w-[200px] flex-1`}
                        />
                        <select value={field} onChange={(e) => setField(e.target.value)} className={`${inputCls} w-40`}>
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
                                <tr className="border-b border-border bg-muted text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">College</th>
                                    <th className="px-4 py-3 font-bold">Program Name</th>
                                    <th className="px-4 py-3 font-bold">Major / Track</th>
                                    <th className="px-4 py-3 text-center font-bold">Level</th>
                                    <th className="px-4 py-3 text-center font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {rows.length > 0 ? (
                                    rows.map((p) => (
                                        <tr
                                            key={p.id}
                                            onClick={() => router.visit(`/programs/${p.id}/prospectus`)}
                                            className="cursor-pointer transition hover:bg-muted/50"
                                        >
                                            <td className="px-4 py-4 text-muted-foreground">{p.college}</td>
                                            <td className="px-4 py-4 font-semibold text-foreground">{p.program_name}</td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                {p.major || <span className="opacity-50">-</span>}
                                            </td>
                                            <td className="px-4 py-4 text-center text-muted-foreground">{p.level}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEdit(p);
                                                        }}
                                                        className="rounded-md bg-muted p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
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
                                                        className="rounded-md bg-muted p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                                            No programs found.{' '}
                                            <button type="button" onClick={openAdd} className="font-semibold text-foreground underline">
                                                Add one?
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            Rows per page
                            <select
                                value={perPage}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                                className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground"
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
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-md border px-3 py-1.5 text-xs transition ${
                                            link.active
                                                ? 'border-primary bg-primary font-bold text-primary-foreground'
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
                    <ModalHeader title={editing ? 'Edit Program' : 'Add Program'} onClose={closeForm} />

                    <div className="space-y-4 px-6 py-5">
                        <Field label="College" required error={form.errors.college}>
                            <select
                                value={form.data.college}
                                onChange={(e) => form.setData({ ...form.data, college: e.target.value, program_name: '', major: '' })}
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

                        <Field label="Program Name" required error={form.errors.program_name}>
                            <select
                                value={form.data.program_name}
                                disabled={!form.data.college}
                                onChange={(e) => form.setData({ ...form.data, program_name: e.target.value, major: '' })}
                                className={`${inputCls} w-full`}
                            >
                                <option value="">{form.data.college ? 'Select Program' : 'Select College first'}</option>
                                {programOptions.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Major / Specialization Track" error={form.errors.major}>
                            <select
                                value={form.data.major}
                                disabled={!form.data.program_name}
                                onChange={(e) => form.setData('major', e.target.value)}
                                className={`${inputCls} w-full`}
                            >
                                <option value="">{form.data.program_name ? 'No major / general' : 'Select Program first'}</option>
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
                                onChange={(e) => form.setData('level', e.target.value)}
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

                    <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
                        <button type="button" onClick={closeForm} className={btnSecondary}>
                            CANCEL
                        </button>
                        <button type="submit" disabled={form.processing} className={btnPrimary}>
                            {form.processing ? 'SAVING...' : 'SAVE PROGRAM'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal open={!!deleting} onClose={() => setDeleting(null)} size="max-w-sm">
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
                        <TriangleAlert className="size-7 text-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Delete Program?</h3>
                    <p className="mt-2 mb-6 text-sm text-muted-foreground">
                        This will permanently remove <strong className="text-foreground">{deleting?.program_name}</strong>{' '}
                        and its prospectus, subjects, and books.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button type="button" onClick={() => setDeleting(null)} className={btnSecondary}>
                            CANCEL
                        </button>
                        <button type="button" disabled={deleteBusy} onClick={confirmDelete} className={btnDanger}>
                            {deleteBusy ? 'DELETING...' : 'CONFIRM'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}