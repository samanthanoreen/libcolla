import { router, useForm } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    FolderTree,
    Plus,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    btnPrimary,
    btnSecondary,
    Field,
    inputCls,
    Modal,
    ModalHeader,
} from '@/components/crud-ui';
import { libcollaTheme, serif } from '@/lib/libcollaTheme';
import { collegeCode } from '@/lib/college';

const programLabel = (p) =>
    `${p.program_code} - ${p.program_name}${p.major ? ` (${p.major})` : ''}`;

export default function Index({
    programs,
    filters = {},
    allPrograms = [],
    subjects = [],
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [field, setField] = useState(filters.field || 'all');
    const perPage = filters.per_page || 15;

    const visit = (extra = {}) =>
        router.get(
            '/books',
            { search, field, per_page: perPage, ...extra },
            { preserveState: true, preserveScroll: true, replace: true },
        );

    const rows = programs?.data ?? [];
    const total = programs?.total ?? 0;
    const page = programs?.current_page ?? 1;
    const lastPage = programs?.last_page ?? 1;

    // Add Book modal
    const [addOpen, setAddOpen] = useState(false);
    const form = useForm({
        program_id: '',
        subject_id: '',
        title: '',
        call_no: '',
        author: '',
        year: '',
        copies: '',
    });

    const programSubjects = useMemo(
        () =>
            subjects.filter(
                (s) => String(s.program_id) === String(form.data.program_id),
            ),
        [subjects, form.data.program_id],
    );

    const closeAdd = () => {
        setAddOpen(false);
        form.reset();
        form.clearErrors();
    };

    const submitAdd = (e) => {
        e.preventDefault();
        form.post('/books', { preserveScroll: true, onSuccess: closeAdd });
    };

    const light = `${inputCls} w-full`;

    return (
        <div style={libcollaTheme} className="w-full">
            <div className="overflow-hidden rounded-[2rem] bg-white text-[#4B5563] shadow-2xl dark:border dark:border-white/10 dark:bg-white/[0.06] dark:text-[#F9EDEF]">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-[#E9A12B] bg-[#F8F8F8] px-8 py-6 dark:bg-white/[0.04]">
                    <h1
                        className="flex items-center gap-3 text-xl font-bold sm:text-2xl text-[#4B5563] dark:text-white"
                        style={serif}
                    >
                        <FolderTree className="size-6 text-[#A04040] dark:text-[#E9A12B]" />
                        Books by Program
                    </h1>
                    <button
                        type="button"
                        onClick={() => setAddOpen(true)}
                        className={`${btnPrimary} shrink-0 whitespace-nowrap`}
                    >
                        <Plus className="size-4" />
                        ADD BOOK
                    </button>
                </div>

                <div className="p-8">
                    {/* Search */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            visit({ page: 1 });
                        }}
                        className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#F8F8F8] p-5 ring-1 ring-[#f1f5f9] dark:bg-white/[0.03] dark:ring-white/10"
                    >
                        <input
                            type="text"
                            placeholder="Search programs or colleges..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputCls} min-w-[200px] flex-1 rounded-xl py-3`}
                        />
                        <select
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                            className={`${inputCls} w-44 rounded-xl py-3`}
                        >
                            <option value="all">All Fields</option>
                            <option value="program">Program Name</option>
                            <option value="college">College</option>
                        </select>
                        <button type="submit" className={btnPrimary}>
                            <Search className="size-4" />
                            SEARCH
                        </button>
                    </form>

                    {/* Table */}
                    <div className="mt-6 overflow-hidden rounded-xl border border-[#E5E5E5] dark:border-white/10">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b-2 border-[#E9A12B] bg-[#F8F8F8] text-xs tracking-wide text-[#334155] uppercase dark:bg-white/[0.04] dark:text-white">
                                        <th className="p-4 font-bold">
                                            College
                                        </th>
                                        <th className="p-4 font-bold">
                                            Program Name
                                        </th>
                                        <th className="p-4 font-bold">
                                            Major / Track
                                        </th>
                                        <th className="p-4 text-center font-bold">
                                            Subjects
                                        </th>
                                        <th className="p-4 text-center font-bold">
                                            Titles
                                        </th>
                                        <th className="p-4 text-center font-bold">
                                            Copies
                                        </th>
                                        <th className="p-4 text-center font-bold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9] bg-white dark:divide-white/10 dark:bg-transparent">
                                    {rows.length > 0 ? (
                                        rows.map((p) => (
                                            <tr
                                                key={p.id}
                                                onClick={() =>
                                                    router.visit(
                                                        `/books/program/${p.id}`,
                                                    )
                                                }
                                                className="group cursor-pointer transition-colors hover:bg-[#fef2f2] dark:hover:bg-white/[0.05]"
                                            >
                                                <td className="p-4 text-[#4B5563] dark:text-white/60">
                                                    {collegeCode(p.college)}
                                                </td>
                                                <td className="p-4 font-bold text-[#4B5563] dark:text-white">
                                                    {p.program_name}
                                                </td>
                                                <td className="p-4 text-[#4B5563] dark:text-white/60">
                                                    {p.major || '—'}
                                                </td>
                                                <td className="p-4 text-center text-[#4B5563]">
                                                    {p.course_subjects_count ??
                                                        0}
                                                </td>
                                                <td className="p-4 text-center font-semibold">
                                                    {p.books_count ?? 0}
                                                </td>
                                                <td className="p-4 text-center text-[#4B5563]">
                                                    {p.books_sum_total_copies ??
                                                        0}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F8F8] px-4 py-1.5 text-xs font-semibold tracking-wider whitespace-nowrap text-[#4B5563] uppercase transition-colors group-hover:bg-gradient-to-r from-[#D66C6C] to-[#A04040] group-hover:text-white dark:bg-white/10 dark:text-white/80">
                                                        <FolderOpen className="size-3.5" />
                                                        View Books
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-12 text-center text-[#4B5563] dark:text-white/60"
                                            >
                                                <FolderOpen className="mx-auto mb-4 size-12 opacity-30" />
                                                No active academic programs
                                                found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-[#f1f5f9] px-6 py-8 text-sm text-[#4B5563] dark:border-white/10 dark:text-white/60">
                            <span>
                                Showing{' '}
                                {total === 0
                                    ? 0
                                    : `${programs?.from ?? 0}–${programs?.to ?? 0}`}{' '}
                                of {total}
                            </span>
                            <label className="flex items-center gap-2">
                                Show
                                <select
                                    value={perPage}
                                    onChange={(e) =>
                                        visit({
                                            per_page: Number(e.target.value),
                                            page: 1,
                                        })
                                    }
                                    className="rounded-md border border-[#E5E5E5] bg-white px-2 py-1 text-sm font-semibold text-[#A04040] dark:border-white/10 dark:bg-black/30 dark:text-[#E9A12B]"
                                >
                                    {[10, 15, 25, 50].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                                per page
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => visit({ page: page - 1 })}
                                    className="flex size-9 items-center justify-center rounded-full border border-[#E5E5E5] text-[#A04040] transition hover:bg-[#F9EDEF] disabled:cursor-not-allowed disabled:text-[#cbd5e1] disabled:hover:bg-transparent dark:border-white/10 dark:text-white dark:hover:bg-white/10 dark:disabled:text-white/20"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <span className="font-semibold text-[#4B5563] dark:text-white">
                                    Page {page} of {lastPage}
                                </span>
                                <button
                                    type="button"
                                    disabled={page >= lastPage}
                                    onClick={() => visit({ page: page + 1 })}
                                    className="flex size-9 items-center justify-center rounded-full border border-[#E5E5E5] text-[#A04040] transition hover:bg-[#F9EDEF] disabled:cursor-not-allowed disabled:text-[#cbd5e1] disabled:hover:bg-transparent dark:border-white/10 dark:text-white dark:hover:bg-white/10 dark:disabled:text-white/20"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Book modal */}
            <Modal open={addOpen} onClose={closeAdd}>
                <form onSubmit={submitAdd}>
                    <ModalHeader title="Add New Book" onClose={closeAdd} />

                    <div className="space-y-4 px-6 py-5">
                        <Field
                            label="Assign to Academic Program"
                            required
                            error={form.errors.program_id}
                        >
                            <select
                                value={form.data.program_id}
                                onChange={(e) =>
                                    form.setData({
                                        ...form.data,
                                        program_id: e.target.value,
                                        subject_id: '',
                                    })
                                }
                                className={light}
                            >
                                <option value="">Select Program...</option>
                                {allPrograms.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {programLabel(p)}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label="Assign to Subject"
                            required
                            error={form.errors.subject_id}
                        >
                            <select
                                value={form.data.subject_id}
                                disabled={
                                    !form.data.program_id ||
                                    programSubjects.length === 0
                                }
                                onChange={(e) =>
                                    form.setData('subject_id', e.target.value)
                                }
                                className={light}
                            >
                                <option value="">
                                    {!form.data.program_id
                                        ? 'Select a Program First...'
                                        : programSubjects.length === 0
                                          ? 'No subjects found for this program'
                                          : 'Select Subject...'}
                                </option>
                                {programSubjects.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.subject_code} - {s.subject_title}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            label="Title of Book"
                            required
                            error={form.errors.title}
                        >
                            <input
                                type="text"
                                value={form.data.title}
                                onChange={(e) =>
                                    form.setData('title', e.target.value)
                                }
                                className={light}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field
                                label="Call No."
                                required
                                error={form.errors.call_no}
                            >
                                <input
                                    type="text"
                                    value={form.data.call_no}
                                    onChange={(e) =>
                                        form.setData('call_no', e.target.value)
                                    }
                                    className={light}
                                />
                            </Field>
                            <Field
                                label="Author"
                                required
                                error={form.errors.author}
                            >
                                <input
                                    type="text"
                                    value={form.data.author}
                                    onChange={(e) =>
                                        form.setData('author', e.target.value)
                                    }
                                    className={light}
                                />
                            </Field>
                            <Field
                                label="Year of Pub"
                                required
                                error={form.errors.year}
                            >
                                <input
                                    type="number"
                                    value={form.data.year}
                                    onChange={(e) =>
                                        form.setData('year', e.target.value)
                                    }
                                    className={light}
                                />
                            </Field>
                            <Field
                                label="Copies"
                                required
                                error={form.errors.copies}
                            >
                                <input
                                    type="number"
                                    min="1"
                                    value={form.data.copies}
                                    onChange={(e) =>
                                        form.setData('copies', e.target.value)
                                    }
                                    className={light}
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
                        <button
                            type="button"
                            onClick={closeAdd}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className={btnPrimary}
                        >
                            {form.processing ? 'SAVING...' : 'SAVE BOOK'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}