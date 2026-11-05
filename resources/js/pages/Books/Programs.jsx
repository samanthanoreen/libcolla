import { Link, router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    BookPlus,
    ChevronDown,
    CircleCheck,
    Download,
    FileSpreadsheet,
    FolderOpen,
    Plus,
    SquarePen,
    Trash2,
} from "lucide-react";
import React, { useState } from "react";
import {
    Field,
    Modal,
    ModalHeader,
    btnPrimary,
    btnSecondary,
    inputCls,
} from "@/components/crud-ui";
import { libcollaTheme } from "@/lib/libcollaTheme";

const th =
    "px-3 py-2 text-left text-[0.65rem] font-bold tracking-wide text-[#64748b] uppercase border-b border-[#e2e8f0]";

// A table cell that looks like plain text and edits in place, committing on blur / Enter.
function EditableCell({
    book,
    field,
    onCommit,
    align = "left",
    className = "",
}) {
    const original = String(book[field] ?? "");
    return (
        <input
            key={`${book.id}-${field}-${original}`}
            defaultValue={original}
            onBlur={(e) => {
                const value = e.target.value.trim();
                if (value !== original)
                    onCommit({ book, field, original, value, input: e.target });
            }}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className={`min-w-10 rounded border border-dashed border-transparent bg-transparent px-1.5 py-1 outline-none hover:cursor-text hover:border-[#cbd5e1] hover:bg-white focus:border-[#9f1239] focus:bg-white focus:ring-2 focus:ring-[#9f1239]/10 ${
                align === "center" ? "text-center" : ""
            } ${className}`}
        />
    );
}

export default function Program({ program, subjects = [], books = [] }) {
    const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
    const subject = subjects.find((s) => String(s.id) === String(subjectId));
    const rows = books.filter(
        (b) => String(b.subject_id) === String(subjectId),
    );

    // ---- Add record (with confirmation) ----
    const [addOpen, setAddOpen] = useState(false);
    const [confirmAdd, setConfirmAdd] = useState(false);
    const form = useForm({
        program_id: program.id,
        subject_id: "",
        title: "",
        call_no: "",
        author: "",
        year: "",
        copies: "",
    });

    const openAdd = () => {
        form.setData({
            program_id: program.id,
            subject_id: subjectId || "",
            title: "",
            call_no: "",
            author: "",
            year: "",
            copies: "",
        });
        form.clearErrors();
        setAddOpen(true);
    };
    const closeAdd = () => {
        setAddOpen(false);
        setConfirmAdd(false);
        form.clearErrors();
    };
    const requestAdd = (e) => {
        e.preventDefault();
        const d = form.data;
        if (
            !d.subject_id ||
            !d.title.trim() ||
            !d.call_no.trim() ||
            !d.author.trim() ||
            !d.year ||
            !d.copies
        ) {
            form.setError("title", "Please fill in all fields");
            return;
        }
        setConfirmAdd(true);
    };
    const executeAdd = () => {
        form.post("/books", {
            preserveScroll: true,
            onSuccess: () => {
                setSubjectId(form.data.subject_id);
                closeAdd();
            },
            onError: () => setConfirmAdd(false),
        });
    };

    // ---- Inline edit (with confirmation) ----
    const [edit, setEdit] = useState(null);
    const [editBusy, setEditBusy] = useState(false);
    const [editError, setEditError] = useState("");

    const cancelEdit = () => {
        if (edit) edit.input.value = edit.original;
        setEdit(null);
        setEditError("");
    };
    const executeEdit = () => {
        const { book, field, value } = edit;
        const payload = {
            call_no: book.call_no,
            title: book.title,
            author: book.author,
            year: book.year,
            copies: book.copies,
            [field]: value,
        };
        router.put(`/books/${book.id}`, payload, {
            preserveScroll: true,
            onStart: () => setEditBusy(true),
            onSuccess: () => setEdit(null),
            onError: (errors) =>
                setEditError(Object.values(errors)[0] || "Update failed."),
            onFinish: () => setEditBusy(false),
        });
    };

    // ---- Delete ----
    const [deleting, setDeleting] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const executeDelete = () => {
        router.delete(`/books/${deleting.id}`, {
            preserveScroll: true,
            onStart: () => setDeleteBusy(true),
            onFinish: () => {
                setDeleteBusy(false);
                setDeleting(null);
            },
        });
    };

    // ---- Download ----
    const [menuOpen, setMenuOpen] = useState(false);
    const downloadCsv = () => {
        setMenuOpen(false);
        if (!rows.length) return;
        const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const csv = [
            "Call No,Title,Author,Year,Copies",
            ...rows.map((b) =>
                [b.call_no, b.title, b.author, b.year, b.copies]
                    .map(esc)
                    .join(","),
            ),
        ].join("\n");
        const url = URL.createObjectURL(
            new Blob([csv], { type: "text/csv;charset=utf-8;" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = `books_${subject?.subject_code ?? "subject"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const light = `${inputCls} w-full`;

    return (
        <div
            style={libcollaTheme}
            className="mx-auto w-full max-w-7xl space-y-5 p-4"
        >
            <Link
                href="/books"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 transition hover:text-white"
            >
                <ArrowLeft className="size-3.5" /> Back to Program Library
            </Link>

            {/* Program info */}
            <div className="overflow-hidden rounded-[10px] border border-[#eef2f6] bg-white shadow-sm">
                <div className="border-b border-[#eef2f6] bg-[#fafbfc] px-4 py-2.5">
                    <h2 className="flex items-center text-[0.85rem] font-bold tracking-wider text-[#1e293b] uppercase">
                        <FolderOpen className="mr-2 size-4 text-[#9f1239]" />{" "}
                        Academic Program Details
                    </h2>
                </div>
                <table className="w-full border-collapse text-[0.8rem]">
                    <thead>
                        <tr>
                            {["College", "Program Name", "Major"].map(
                                (h, i) => (
                                    <th
                                        key={h}
                                        className={`border-b border-[#eef2f6] bg-[#f8fafc] px-4 py-2 text-[0.65rem] font-bold text-[#64748b] uppercase ${i === 2 ? "text-center" : "text-left"}`}
                                    >
                                        {h}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-b border-[#f1f5f9] px-4 py-2.5 text-[#334155]">
                                {program.college}
                            </td>
                            <td className="border-b border-[#f1f5f9] px-4 py-2.5 font-semibold text-[#334155]">
                                {program.program_name}
                            </td>
                            <td className="border-b border-[#f1f5f9] px-4 py-2.5 text-center text-[#334155]">
                                {program.major || "—"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1">
                    <label className="mb-1 block text-[0.65rem] font-bold text-white/80 uppercase">
                        Course Subject
                    </label>
                    <select
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-[0.8rem] text-[#1e293b] outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10"
                    >
                        {subjects.length === 0 && (
                            <option value="">No subjects yet</option>
                        )}
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.subject_code} - {s.subject_title}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={openAdd}
                    disabled={subjects.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#9f1239] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#7e0f2e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="size-3.5" /> Add Record
                </button>
            </div>

            {/* Books of the selected subject */}
            <div className="overflow-hidden rounded-[10px] border border-[#eef2f6] bg-white shadow-sm">
                <div className="bg-[#9f1239] px-4 py-2">
                    <h3 className="text-[0.8rem] font-semibold text-white">
                        Course Subject:{" "}
                        <span className="font-bold">
                            {subject
                                ? `${subject.subject_code} - ${subject.subject_title}`
                                : "Select a Subject"}
                        </span>
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-xs">
                        <thead>
                            <tr className="bg-[#f8fafc]">
                                <th className={th}>Call No</th>
                                <th className={th}>Title of Book</th>
                                <th className={th}>Author</th>
                                <th className={`${th} text-center`}>Year</th>
                                <th className={`${th} text-center`}>Copies</th>
                                <th className={th} />
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-8 text-center text-[#94a3b8]"
                                    >
                                        <FolderOpen className="mx-auto mb-2 size-8 opacity-50" />
                                        No books assigned to this subject
                                    </td>
                                </tr>
                            ) : (
                                rows.map((b) => (
                                    <tr
                                        key={b.id}
                                        className="border-b border-[#f1f5f9] text-[#334155] hover:bg-[#fef2f8]"
                                    >
                                        <td className="px-3 py-2">
                                            <EditableCell
                                                book={b}
                                                field="call_no"
                                                onCommit={setEdit}
                                                className="w-28 font-mono text-[0.7rem] font-semibold text-[#64748b]"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <EditableCell
                                                book={b}
                                                field="title"
                                                onCommit={setEdit}
                                                className="w-full font-semibold text-[#1e293b]"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <EditableCell
                                                book={b}
                                                field="author"
                                                onCommit={setEdit}
                                                className="w-full"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <EditableCell
                                                book={b}
                                                field="year"
                                                onCommit={setEdit}
                                                align="center"
                                                className="w-20"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <EditableCell
                                                book={b}
                                                field="copies"
                                                onCommit={setEdit}
                                                align="center"
                                                className="w-16 bg-[#f1f5f9] text-[0.7rem] font-bold text-[#475569]"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => setDeleting(b)}
                                                className="size-7 rounded-md bg-[#fee2e2] text-[#ef4444] transition hover:bg-[#fecaca] hover:text-[#dc2626]"
                                                title="Delete"
                                            >
                                                <Trash2 className="mx-auto size-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Download */}
            <div className="flex justify-end">
                <div className="relative inline-block">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((o) => !o)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#1e293b] px-[18px] py-2 text-xs font-semibold text-white transition hover:bg-[#0f172a]"
                    >
                        <Download className="size-3.5" /> Download{" "}
                        <ChevronDown className="size-3" />
                    </button>
                    {menuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setMenuOpen(false)}
                            />
                            <div className="absolute right-0 bottom-full z-50 mb-2 w-52 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white shadow-lg">
                                <button
                                    type="button"
                                    onClick={downloadCsv}
                                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b]"
                                >
                                    <FileSpreadsheet className="size-4 text-[#059669]" />{" "}
                                    Download as CSV
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add record modal */}
            <Modal
                open={addOpen && !confirmAdd}
                onClose={closeAdd}
                size="max-w-[550px]"
            >
                <form onSubmit={requestAdd}>
                    <ModalHeader
                        title="Add New Book Record"
                        onClose={closeAdd}
                    />
                    <div className="space-y-4 px-6 py-5">
                        <Field
                            label="Subject"
                            required
                            error={form.errors.subject_id}
                        >
                            <select
                                value={form.data.subject_id}
                                onChange={(e) =>
                                    form.setData("subject_id", e.target.value)
                                }
                                className={light}
                            >
                                <option value="">-- Select Subject --</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.subject_code} - {s.subject_title}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field
                            label="Book Title"
                            required
                            error={form.errors.title}
                        >
                            <input
                                type="text"
                                placeholder="Enter book title"
                                value={form.data.title}
                                onChange={(e) =>
                                    form.setData("title", e.target.value)
                                }
                                className={light}
                            />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field
                                label="Call Number"
                                required
                                error={form.errors.call_no}
                            >
                                <input
                                    type="text"
                                    placeholder="e.g., QA 76.9"
                                    value={form.data.call_no}
                                    onChange={(e) =>
                                        form.setData("call_no", e.target.value)
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
                                    placeholder="Author name"
                                    value={form.data.author}
                                    onChange={(e) =>
                                        form.setData("author", e.target.value)
                                    }
                                    className={light}
                                />
                            </Field>
                            <Field
                                label="Year"
                                required
                                error={form.errors.year}
                            >
                                <input
                                    type="number"
                                    placeholder="YYYY"
                                    value={form.data.year}
                                    onChange={(e) =>
                                        form.setData("year", e.target.value)
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
                                    placeholder="1"
                                    value={form.data.copies}
                                    onChange={(e) =>
                                        form.setData("copies", e.target.value)
                                    }
                                    className={light}
                                />
                            </Field>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
                        <button
                            type="button"
                            onClick={closeAdd}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button type="submit" className={btnPrimary}>
                            <BookPlus className="size-4" /> SAVE BOOK
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm addition */}
            <Modal
                open={addOpen && confirmAdd}
                onClose={() => setConfirmAdd(false)}
                size="max-w-[380px]"
            >
                <div className="p-6 text-center">
                    <CircleCheck className="mx-auto mb-3 size-10 text-[#10b981]" />
                    <h3 className="mb-2 text-lg font-semibold">
                        Confirm Addition
                    </h3>
                    <p className="mb-5 text-sm text-[#64748b]">
                        Are you sure you want to add this book to the selected
                        subject?
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setConfirmAdd(false)}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            disabled={form.processing}
                            onClick={executeAdd}
                            className="inline-flex items-center justify-center rounded-lg bg-[#10b981] px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-[#059669] disabled:cursor-wait disabled:opacity-60"
                        >
                            {form.processing ? "SAVING..." : "CONFIRM"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Confirm inline edit */}
            <Modal open={!!edit} onClose={cancelEdit} size="max-w-[380px]">
                <div className="p-6 text-center">
                    <SquarePen className="mx-auto mb-3 size-9 text-[#9f1239]" />
                    <h3 className="mb-2 text-lg font-semibold">
                        Save Changes?
                    </h3>
                    <p className="mb-4 text-sm text-[#64748b]">
                        Do you want to permanently save this edit?
                    </p>
                    <div className="mb-5 space-y-2 rounded-lg bg-[#f8fafc] p-3 text-left text-sm">
                        <div>
                            <strong>Original:</strong>{" "}
                            {edit?.original === "" ? "(Empty)" : edit?.original}
                        </div>
                        <div>
                            <strong>New:</strong>{" "}
                            {edit?.value === "" ? "(Empty)" : edit?.value}
                        </div>
                    </div>
                    {editError && (
                        <p className="mb-4 text-xs text-[#dc2626]">
                            {editError}
                        </p>
                    )}
                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            disabled={editBusy}
                            onClick={executeEdit}
                            className={btnPrimary}
                        >
                            {editBusy ? "SAVING..." : "UPDATE"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete */}
            <Modal
                open={!!deleting}
                onClose={() => setDeleting(null)}
                size="max-w-[380px]"
            >
                <div className="p-6 text-center">
                    <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[#fee2e2]">
                        <Trash2 className="size-6 text-[#ef4444]" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">Delete Book?</h3>
                    <p className="mb-3 text-sm text-[#64748b]">
                        Are you sure you want to permanently delete this book?
                    </p>
                    <div className="mb-5 rounded-lg bg-[#fef2f2] p-3 text-sm font-semibold text-[#1e293b]">
                        {deleting?.title}
                    </div>
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
                            onClick={executeDelete}
                            className="inline-flex items-center justify-center rounded-lg bg-[#dc2626] px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-[#b91c1c] disabled:cursor-wait disabled:opacity-60"
                        >
                            {deleteBusy ? "DELETING..." : "DELETE"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
