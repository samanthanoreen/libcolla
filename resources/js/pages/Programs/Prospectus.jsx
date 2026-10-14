import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react';
import React, { useState } from 'react';
import { Field, Modal, ModalHeader, btnDanger, btnPrimary, btnSecondary, inputCls } from '@/components/crud-ui';

const SECTIONS = [
    ['FIRST YEAR — 1st Semester', '1st Year — 1st Sem'],
    ['FIRST YEAR — 2nd Semester', '1st Year — 2nd Sem'],
    ['SECOND YEAR — 1st Semester', '2nd Year — 1st Sem'],
    ['SECOND YEAR — 2nd Semester', '2nd Year — 2nd Sem'],
    ['THIRD YEAR — 1st Semester', '3rd Year — 1st Sem'],
    ['THIRD YEAR — 2nd Semester', '3rd Year — 2nd Sem'],
    ['THIRD YEAR — Summer', '3rd Year — Summer'],
    ['FOURTH YEAR — 1st Semester', '4th Year — 1st Sem'],
    ['FOURTH YEAR — 2nd Semester', '4th Year — 2nd Sem'],
];
const SECTION_ORDER = SECTIONS.map(([value]) => value);
const YEAR_TABS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// Works for "FIRST YEAR — 1st Semester" and similar labels.
function yearIndex(label = '') {
    const head = label.split(/[—-]/)[0].toLowerCase();
    if (/first|1st/.test(head)) return 0;
    if (/second|2nd/.test(head)) return 1;
    if (/third|3rd/.test(head)) return 2;
    if (/fourth|4th/.test(head)) return 3;
    return 0;
}

const COLLEGE_ABBR = {
    'College of Information and Computing': 'CIC',
    'College of Business Administration': 'CBA',
    'College of Arts and Sciences': 'CAS',
    'College of Engineering': 'CoE',
    'College of Education': 'CED',
    'College of Technology': 'CT',
    'College of Applied Economics': 'CAEc',
};
const abbr = (college = '') =>
    COLLEGE_ABBR[college] ||
    college
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase();

const num = (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? 0 : n;
};

const emptySubject = {
    year_semester: SECTION_ORDER[0],
    subject_code: '',
    subject_title: '',
    lec_hours: '',
    lab_hours: '',
    credit_units: '',
    pre_requisite: 'None',
};

export default function Prospectus({ program, prospectus, subjects = [] }) {
    const base = `/programs/${program.id}/prospectus`;
    const [yearIdx, setYearIdx] = useState(0);

    // Subject modal
    const [subjectOpen, setSubjectOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const subjectForm = useForm(emptySubject);

    const closeSubject = () => {
        setSubjectOpen(false);
        subjectForm.clearErrors();
    };

    const openAddSubject = () => {
        setEditingSubject(null);
        subjectForm.setData({ ...emptySubject, year_semester: SECTION_ORDER[yearIdx * 2] || SECTION_ORDER[0] });
        subjectForm.clearErrors();
        setSubjectOpen(true);
    };

    const openEditSubject = (s) => {
        setEditingSubject(s);
        subjectForm.setData({
            year_semester: s.year_semester || SECTION_ORDER[0],
            subject_code: s.subject_code || '',
            subject_title: s.subject_title || '',
            lec_hours: s.lec_hours ?? '',
            lab_hours: s.lab_hours ?? '',
            credit_units: s.credit_units !== null ? String(num(s.credit_units)) : '',
            pre_requisite: s.pre_requisite || 'None',
        });
        subjectForm.clearErrors();
        setSubjectOpen(true);
    };

    const submitSubject = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: closeSubject };
        if (editingSubject) subjectForm.put(`${base}/subjects/${editingSubject.id}`, opts);
        else subjectForm.post(`${base}/subjects`, opts);
    };

    // Delete subject modal
    const [deletingSubject, setDeletingSubject] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    const confirmDeleteSubject = () => {
        if (!deletingSubject) return;
        router.delete(`${base}/subjects/${deletingSubject.id}`, {
            preserveScroll: true,
            onStart: () => setDeleteBusy(true),
            onFinish: () => {
                setDeleteBusy(false);
                setDeletingSubject(null);
            },
        });
    };

    // Prospectus (title and academic year) modal
    const [prospectusOpen, setProspectusOpen] = useState(false);
    const prospectusForm = useForm({ title: '', academic_year: '' });

    const openProspectus = () => {
        const year = new Date().getFullYear();
        prospectusForm.setData({
            title: prospectus?.title || `${program.program_name} Prospectus`,
            academic_year: prospectus?.academic_year || `${year}-${year + 1}`,
        });
        prospectusForm.clearErrors();
        setProspectusOpen(true);
    };

    const submitProspectus = (e) => {
        e.preventDefault();
        prospectusForm.put(base, { preserveScroll: true, onSuccess: () => setProspectusOpen(false) });
    };

    // Group the active year's subjects by semester
    const groups = {};
    subjects.forEach((s) => {
        (groups[s.year_semester] ||= []).push(s);
    });
    const sections = [
        ...SECTION_ORDER.filter((s) => groups[s]),
        ...Object.keys(groups).filter((s) => !SECTION_ORDER.includes(s)),
    ].filter((s) => yearIndex(s) === yearIdx);

    const title = prospectus?.title || `${program.program_name} Prospectus`;

    return (
        <div className="p-6 md:p-10">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                {/* Program band */}
                <div className="flex items-stretch border-b border-border">
                    <div className="flex min-w-[100px] items-center justify-center border-r border-border bg-muted px-5 py-4 text-lg font-extrabold">
                        {abbr(program.college)}
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4">
                        <div className="text-lg font-bold">{program.program_name}</div>
                        <div className="text-sm text-muted-foreground">
                            {program.major ? `Major: ${program.major}` : program.college}
                        </div>
                    </div>
                    <div className="flex items-center border-l border-border px-5">
                        <span className="rounded-md bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
                            {program.level || 'Bachelor'}
                        </span>
                    </div>
                </div>

                {/* Prospectus subheader */}
                <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
                    <div>
                        <div className="text-xl font-extrabold tracking-wide uppercase">Prospectus</div>
                        <div className="mt-1 text-sm text-muted-foreground italic">
                            {title}
                            {prospectus?.academic_year ? ` (SY ${prospectus.academic_year})` : ''}
                        </div>
                    </div>
                    <button type="button" onClick={openAddSubject} className={btnPrimary}>
                        <Plus className="size-4" />
                        ADD SUBJECT
                    </button>
                </div>

                {/* Year tabs */}
                <div className="flex gap-2 overflow-x-auto border-b border-border bg-muted/40 px-6 py-3">
                    {YEAR_TABS.map((label, i) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => setYearIdx(i)}
                            className={`rounded-lg border px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                                i === yearIdx
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Subjects table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted text-xs tracking-wide text-muted-foreground uppercase">
                                <th className="w-28 px-4 py-3 font-bold">Code</th>
                                <th className="px-4 py-3 font-bold">Course Subject Name</th>
                                <th className="w-16 px-4 py-3 text-center font-bold">Lec</th>
                                <th className="w-16 px-4 py-3 text-center font-bold">Lab</th>
                                <th className="w-20 px-4 py-3 text-center font-bold">Units</th>
                                <th className="w-36 px-4 py-3 font-bold">Pre/Co-Req</th>
                                <th className="w-24 px-4 py-3 text-center font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                        No subjects yet for {YEAR_TABS[yearIdx]}.{' '}
                                        <button type="button" onClick={openAddSubject} className="font-semibold text-foreground underline">
                                            Add one?
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                sections.map((section) => {
                                    const items = groups[section];
                                    const total = items.reduce((sum, s) => sum + num(s.credit_units), 0);
                                    return (
                                        <React.Fragment key={section}>
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="border-b border-border bg-muted/60 px-4 py-2 text-xs font-bold tracking-widest uppercase"
                                                >
                                                    {section}
                                                </td>
                                            </tr>
                                            {items.map((s) => (
                                                <tr key={s.id} className="border-b border-border transition hover:bg-muted/50">
                                                    <td className="px-4 py-3 font-mono text-xs font-semibold">{s.subject_code}</td>
                                                    <td className="px-4 py-3">{s.subject_title}</td>
                                                    <td className="px-4 py-3 text-center text-muted-foreground">{s.lec_hours ?? 0}</td>
                                                    <td className="px-4 py-3 text-center text-muted-foreground">{s.lab_hours ?? 0}</td>
                                                    <td className="px-4 py-3 text-center font-bold">{num(s.credit_units)}</td>
                                                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.pre_requisite || 'None'}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                title="Edit"
                                                                onClick={() => openEditSubject(s)}
                                                                className="rounded-md bg-muted p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                title="Delete"
                                                                onClick={() => setDeletingSubject(s)}
                                                                className="rounded-md bg-muted p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="border-b-2 border-border bg-muted/30 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                                <td colSpan={4} className="px-4 py-2 text-right">
                                                    Total Units
                                                </td>
                                                <td className="px-4 py-2 text-center text-sm text-foreground">{total}</td>
                                                <td colSpan={2} />
                                            </tr>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
                    <Link href="/programs" className={btnSecondary}>
                        <ArrowLeft className="size-4" />
                        BACK
                    </Link>
                    <button type="button" onClick={openProspectus} className={btnSecondary}>
                        <Pencil className="size-4" />
                        EDIT PROSPECTUS
                    </button>
                </div>
            </div>

            {/* Add / edit subject */}
            <Modal open={subjectOpen} onClose={closeSubject}>
                <form onSubmit={submitSubject}>
                    <ModalHeader title={editingSubject ? 'Edit Subject' : 'Add Subject'} onClose={closeSubject} />
                    <div className="space-y-4 px-6 py-5">
                        <Field label="Year & Semester" error={subjectForm.errors.year_semester}>
                            <select
                                value={subjectForm.data.year_semester}
                                onChange={(e) => subjectForm.setData('year_semester', e.target.value)}
                                className={`${inputCls} w-full`}
                            >
                                {SECTIONS.map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Subject Code" required error={subjectForm.errors.subject_code}>
                                <input
                                    value={subjectForm.data.subject_code}
                                    onChange={(e) => subjectForm.setData('subject_code', e.target.value)}
                                    placeholder="e.g. IC 111"
                                    className={`${inputCls} w-full`}
                                />
                            </Field>
                            <Field label="Units" required error={subjectForm.errors.credit_units}>
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    step="0.5"
                                    value={subjectForm.data.credit_units}
                                    onChange={(e) => subjectForm.setData('credit_units', e.target.value)}
                                    placeholder="3"
                                    className={`${inputCls} w-full`}
                                />
                            </Field>
                        </div>

                        <Field label="Course Title" required error={subjectForm.errors.subject_title}>
                            <input
                                value={subjectForm.data.subject_title}
                                onChange={(e) => subjectForm.setData('subject_title', e.target.value)}
                                placeholder="e.g. Programming Paradigm 1"
                                className={`${inputCls} w-full`}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Lec Hours" error={subjectForm.errors.lec_hours}>
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    value={subjectForm.data.lec_hours}
                                    onChange={(e) => subjectForm.setData('lec_hours', e.target.value)}
                                    placeholder="3"
                                    className={`${inputCls} w-full`}
                                />
                            </Field>
                            <Field label="Lab Hours" error={subjectForm.errors.lab_hours}>
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    value={subjectForm.data.lab_hours}
                                    onChange={(e) => subjectForm.setData('lab_hours', e.target.value)}
                                    placeholder="0"
                                    className={`${inputCls} w-full`}
                                />
                            </Field>
                        </div>

                        <Field label="Pre / Co-Requisite" error={subjectForm.errors.pre_requisite}>
                            <input
                                value={subjectForm.data.pre_requisite}
                                onChange={(e) => subjectForm.setData('pre_requisite', e.target.value)}
                                placeholder="None"
                                className={`${inputCls} w-full`}
                            />
                        </Field>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
                        <button type="button" onClick={closeSubject} className={btnSecondary}>
                            CANCEL
                        </button>
                        <button type="submit" disabled={subjectForm.processing} className={btnPrimary}>
                            {subjectForm.processing ? 'SAVING...' : 'SAVE SUBJECT'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete subject */}
            <Modal open={!!deletingSubject} onClose={() => setDeletingSubject(null)} size="max-w-sm">
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                        <TriangleAlert className="size-6 text-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Remove Subject?</h3>
                    <p className="mt-2 mb-6 text-sm text-muted-foreground">
                        Remove <strong className="text-foreground">{deletingSubject?.subject_title}</strong> from the
                        prospectus? Books linked to it will be removed too.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button type="button" onClick={() => setDeletingSubject(null)} className={btnSecondary}>
                            CANCEL
                        </button>
                        <button type="button" disabled={deleteBusy} onClick={confirmDeleteSubject} className={btnDanger}>
                            {deleteBusy ? 'REMOVING...' : 'REMOVE'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit prospectus */}
            <Modal open={prospectusOpen} onClose={() => setProspectusOpen(false)}>
                <form onSubmit={submitProspectus}>
                    <ModalHeader title="Edit Prospectus" onClose={() => setProspectusOpen(false)} />
                    <div className="space-y-4 px-6 py-5">
                        <Field label="Prospectus Title" required error={prospectusForm.errors.title}>
                            <input
                                value={prospectusForm.data.title}
                                onChange={(e) => prospectusForm.setData('title', e.target.value)}
                                placeholder="e.g. BSIT Prospectus"
                                className={`${inputCls} w-full`}
                            />
                        </Field>
                        <Field label="Academic Year" required error={prospectusForm.errors.academic_year}>
                            <input
                                value={prospectusForm.data.academic_year}
                                onChange={(e) => prospectusForm.setData('academic_year', e.target.value)}
                                placeholder="2024-2025"
                                className={`${inputCls} w-full`}
                            />
                        </Field>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
                        <button type="button" onClick={() => setProspectusOpen(false)} className={btnSecondary}>
                            CANCEL
                        </button>
                        <button type="submit" disabled={prospectusForm.processing} className={btnPrimary}>
                            {prospectusForm.processing ? 'SAVING...' : 'SAVE'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}