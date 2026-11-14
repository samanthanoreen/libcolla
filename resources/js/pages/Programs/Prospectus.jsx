import { Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    FileDown,
    Pencil,
    Plus,
    Trash2,
    TriangleAlert,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    btnDanger,
    btnPrimary,
    btnSecondary,
    Field,
    inputCls,
    Modal,
    ModalHeader,
} from '@/components/crud-ui';
import { libcollaTheme } from '@/lib/libcollaTheme';

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

// Sums like 1.5 + 1.5 should not show floating point noise.
const fmtUnits = (n) => String(Math.round(n * 10) / 10);

const JSPDF_SRC =
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

// jsPDF is only needed when the PDF button is pressed, so it is loaded on demand.
function loadJsPdf() {
    if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    return new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = JSPDF_SRC;
        el.async = true;
        el.onload = () =>
            window.jspdf?.jsPDF
                ? resolve(window.jspdf.jsPDF)
                : reject(new Error('jsPDF is not available'));
        el.onerror = () =>
            reject(
                new Error(
                    'Could not load the PDF library. Check your internet connection.',
                ),
            );
        document.head.appendChild(el);
    });
}

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
        subjectForm.setData({
            ...emptySubject,
            year_semester:
                SECTION_ORDER.find((label) => yearIndex(label) === yearIdx) ||
                SECTION_ORDER[0],
        });
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
            credit_units:
                s.credit_units !== null ? String(num(s.credit_units)) : '',
            pre_requisite: s.pre_requisite || 'None',
        });
        subjectForm.clearErrors();
        setSubjectOpen(true);
    };

    const submitSubject = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: closeSubject };
        if (editingSubject)
            subjectForm.put(`${base}/subjects/${editingSubject.id}`, opts);
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
        prospectusForm.put(base, {
            preserveScroll: true,
            onSuccess: () => setProspectusOpen(false),
        });
    };

    // Delete the whole program (prospectus, subjects and books go with it)
    const [deleteProgramOpen, setDeleteProgramOpen] = useState(false);
    const [deleteProgramBusy, setDeleteProgramBusy] = useState(false);

    const confirmDeleteProgram = () => {
        router.delete(`/programs/${program.id}`, {
            onStart: () => setDeleteProgramBusy(true),
            onFinish: () => {
                setDeleteProgramBusy(false);
                setDeleteProgramOpen(false);
            },
        });
    };

    // Download the prospectus as a PDF
    const [pdfBusy, setPdfBusy] = useState(false);

    const downloadPdf = async () => {
        setPdfBusy(true);
        try {
            const JsPdf = await loadJsPdf();
            const doc = new JsPdf({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });
            const pw = doc.internal.pageSize.getWidth();
            const ph = doc.internal.pageSize.getHeight();
            const margin = 14;
            let y = 36;

            doc.setFillColor(159, 18, 57);
            doc.rect(0, 0, pw, 28, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('LibColla', margin, 12);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text('Academic Program Prospectus', margin, 19);
            doc.setFontSize(8);
            doc.text(
                'Generated: ' +
                    new Date().toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }),
                pw - margin,
                19,
                { align: 'right' },
            );

            doc.setTextColor(30, 41, 59);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text(program.program_name, margin, y);
            y += 6;
            if (program.major) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(100, 116, 139);
                doc.text(`Major/Track: ${program.major}`, margin, y);
                y += 5;
            }
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139);
            doc.text(
                'College: ' +
                    program.college +
                    '   |   Level: ' +
                    (program.level || 'Bachelor'),
                margin,
                y,
            );
            y += 4;
            const heading = prospectus?.academic_year
                ? `${title} (SY ${prospectus.academic_year})`
                : title;
            const headingLines = doc.splitTextToSize(heading, pw - margin * 2);
            doc.text(headingLines, margin, y);
            y += headingLines.length * 4;
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.3);
            doc.line(margin, y, pw - margin, y);
            y += 6;

            const colW = [24, 84, 10, 10, 13, 30];
            const hdrs = [
                'Code',
                'Course Subject Name',
                'Lec',
                'Lab',
                'Units',
                'Pre/Co-Req',
            ];
            const rowH = 5.5;
            const drawHeader = () => {
                doc.setFillColor(241, 245, 249);
                doc.rect(margin, y, pw - margin * 2, rowH + 1, 'F');
                doc.setDrawColor(30, 41, 59);
                doc.setLineWidth(0.4);
                doc.rect(margin, y, pw - margin * 2, rowH + 1);
                doc.setFontSize(6);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(71, 85, 105);
                let cx = margin + 2;
                hdrs.forEach((h, i) => {
                    doc.text(h, cx, y + rowH - 0.8);
                    cx += colW[i];
                });
                y += rowH + 1;
            };
            drawHeader();

            const byLabel = {};
            subjects.forEach((s) => {
                (byLabel[s.year_semester] ||= []).push(s);
            });
            const order = [
                ...SECTION_ORDER.filter((label) => byLabel[label]),
                ...Object.keys(byLabel).filter(
                    (label) => !SECTION_ORDER.includes(label),
                ),
            ];

            order.forEach((label) => {
                if (y > ph - 18) {
                    doc.addPage();
                    y = margin;
                    drawHeader();
                }
                doc.setFillColor(51, 65, 85);
                doc.rect(margin, y, pw - margin * 2, rowH, 'F');
                doc.setFontSize(6);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text(label, margin + 2, y + rowH - 1.5);
                y += rowH;

                let total = 0;
                byLabel[label].forEach((s) => {
                    if (y > ph - 18) {
                        doc.addPage();
                        y = margin;
                        drawHeader();
                    }
                    total += num(s.credit_units);
                    doc.setFillColor(255, 255, 255);
                    doc.rect(margin, y, pw - margin * 2, rowH - 1, 'F');
                    doc.setFontSize(6);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(30, 41, 59);
                    const cells = [
                        s.subject_code,
                        s.subject_title,
                        String(s.lec_hours ?? 0),
                        String(s.lab_hours ?? 0),
                        String(num(s.credit_units)),
                        s.pre_requisite || 'None',
                    ];
                    let cx = margin + 2;
                    cells.forEach((c, i) => {
                        const t = doc.splitTextToSize(
                            String(c || ''),
                            colW[i] - 2,
                        );
                        doc.text(t[0], cx, y + rowH - 2);
                        cx += colW[i];
                    });
                    doc.setDrawColor(226, 232, 240);
                    doc.setLineWidth(0.2);
                    doc.line(margin, y + rowH - 1, pw - margin, y + rowH - 1);
                    y += rowH;
                });

                doc.setFillColor(248, 250, 252);
                doc.rect(margin, y, pw - margin * 2, rowH - 1, 'F');
                doc.setFontSize(6.5);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(159, 18, 57);
                doc.text(
                    `TOTAL UNITS: ${fmtUnits(total)}`,
                    pw - margin - 2,
                    y + rowH - 2.5,
                    { align: 'right' },
                );
                doc.setDrawColor(203, 213, 225);
                doc.setLineWidth(0.3);
                doc.line(margin, y + rowH - 1, pw - margin, y + rowH - 1);
                y += rowH;
            });

            const pages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pages; i++) {
                doc.setPage(i);
                doc.setFillColor(248, 250, 252);
                doc.rect(0, ph - 10, pw, 10, 'F');
                doc.setFontSize(7);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(148, 163, 184);
                doc.text(`LibColla - ${program.college}`, margin, ph - 4);
                doc.text(`Page ${i} of ${pages}`, pw - margin, ph - 4, {
                    align: 'right',
                });
            }

            const fileName = `${`${program.college}_${program.program_name}`
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '')}_Prospectus.pdf`;
            doc.save(fileName);
            toast.success('PDF downloaded!');
        } catch (e) {
            console.error(e);
            toast.error(e?.message || 'PDF generation failed.');
        } finally {
            setPdfBusy(false);
        }
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
    const yearSuffix =
        prospectus?.academic_year && !title.includes(prospectus.academic_year)
            ? ` (SY ${prospectus.academic_year})`
            : '';

    return (
        <div style={libcollaTheme} className="md:p-6">
            <div className="border-border bg-card text-card-foreground mx-auto max-w-6xl overflow-hidden rounded-xl border shadow-sm">
                {/* Program band */}
                <div className="border-border flex flex-col border-b-2 border-b-[#d4a017] sm:flex-row sm:items-stretch">
                    <div className="border-border bg-muted flex items-center justify-center border-b px-5 py-4 text-lg font-extrabold sm:min-w-[100px] sm:border-r sm:border-b-0">
                        {abbr(program.college)}
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4">
                        <div className="text-lg font-bold">
                            {program.program_name}
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {program.major
                                ? `Major: ${program.major}`
                                : program.college}
                        </div>
                    </div>
                    <div className="border-border flex items-center border-t px-5 py-3 sm:border-t-0 sm:border-l sm:py-0">
                        <span className="bg-muted text-muted-foreground rounded-md px-3 py-1.5 text-xs font-bold">
                            {program.level || 'Bachelor'}
                        </span>
                    </div>
                </div>

                {/* Prospectus subheader */}
                <div className="border-border flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5">
                    <div>
                        <div className="text-xl font-extrabold tracking-wide uppercase">
                            Prospectus
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm italic">
                            {title}
                            {yearSuffix}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={openAddSubject}
                        className={btnPrimary}
                    >
                        <Plus className="size-4" />
                        ADD SUBJECT
                    </button>
                </div>

                {/* Year tabs */}
                <div className="border-border bg-muted/40 flex gap-2 overflow-x-auto border-b px-6 py-3">
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
                    <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-border bg-muted text-muted-foreground border-b text-xs tracking-wide uppercase">
                                <th className="w-28 px-4 py-3 font-bold">
                                    Code
                                </th>
                                <th className="px-4 py-3 font-bold">
                                    Course Subject Name
                                </th>
                                <th className="w-16 px-4 py-3 text-center font-bold">
                                    Lec
                                </th>
                                <th className="w-16 px-4 py-3 text-center font-bold">
                                    Lab
                                </th>
                                <th className="w-20 px-4 py-3 text-center font-bold">
                                    Units
                                </th>
                                <th className="w-36 px-4 py-3 font-bold">
                                    Pre/Co-Req
                                </th>
                                <th className="w-24 px-4 py-3 text-center font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-muted-foreground px-4 py-10 text-center"
                                    >
                                        No subjects yet for {YEAR_TABS[yearIdx]}
                                        .{' '}
                                        <button
                                            type="button"
                                            onClick={openAddSubject}
                                            className="text-foreground font-semibold underline"
                                        >
                                            Add one?
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                sections.map((section) => {
                                    const items = groups[section];
                                    const total = items.reduce(
                                        (sum, s) => sum + num(s.credit_units),
                                        0,
                                    );
                                    return (
                                        <React.Fragment key={section}>
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="border-border bg-muted/60 border-b px-4 py-2 text-xs font-bold tracking-widest uppercase"
                                                >
                                                    {section}
                                                </td>
                                            </tr>
                                            {items.map((s) => (
                                                <tr
                                                    key={s.id}
                                                    className="border-border hover:bg-muted/50 border-b transition"
                                                >
                                                    <td className="px-4 py-3 font-mono text-xs font-semibold">
                                                        {s.subject_code}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {s.subject_title}
                                                    </td>
                                                    <td className="text-muted-foreground px-4 py-3 text-center">
                                                        {s.lec_hours ?? 0}
                                                    </td>
                                                    <td className="text-muted-foreground px-4 py-3 text-center">
                                                        {s.lab_hours ?? 0}
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-bold">
                                                        {num(s.credit_units)}
                                                    </td>
                                                    <td className="text-muted-foreground px-4 py-3 text-xs">
                                                        {s.pre_requisite ||
                                                            'None'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                title="Edit"
                                                                onClick={() =>
                                                                    openEditSubject(
                                                                        s,
                                                                    )
                                                                }
                                                                className="bg-muted text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-2 transition"
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                title="Delete"
                                                                onClick={() =>
                                                                    setDeletingSubject(
                                                                        s,
                                                                    )
                                                                }
                                                                className="bg-muted text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-2 transition"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="border-border bg-muted/30 text-muted-foreground border-b-2 text-xs font-bold tracking-wide uppercase">
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-2 text-right"
                                                >
                                                    Total Units
                                                </td>
                                                <td className="text-foreground px-4 py-2 text-center text-sm">
                                                    {fmtUnits(total)}
                                                </td>
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
                <div className="border-border bg-muted/30 flex flex-wrap justify-end gap-3 border-t px-6 py-4">
                    <Link href="/programs" className={btnSecondary}>
                        <ArrowLeft className="size-4" />
                        BACK
                    </Link>
                    <button
                        type="button"
                        onClick={openProspectus}
                        className={btnSecondary}
                    >
                        <Pencil className="size-4" />
                        EDIT PROSPECTUS
                    </button>
                    <button
                        type="button"
                        onClick={downloadPdf}
                        disabled={pdfBusy || subjects.length === 0}
                        className={btnPrimary}
                    >
                        <FileDown className="size-4" />
                        {pdfBusy ? 'GENERATING...' : 'DOWNLOAD PDF'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeleteProgramOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#fee2e2] px-5 py-3 text-xs font-bold tracking-wide text-[#C44545] transition hover:bg-[#fecaca]"
                    >
                        <Trash2 className="size-4" />
                        DELETE PROGRAM
                    </button>
                </div>
            </div>

            {/* Add / edit subject */}
            <Modal open={subjectOpen} onClose={closeSubject}>
                <form onSubmit={submitSubject}>
                    <ModalHeader
                        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
                        onClose={closeSubject}
                    />
                    <div className="space-y-4 px-6 py-5">
                        <Field
                            label="Year & Semester"
                            error={subjectForm.errors.year_semester}
                        >
                            <select
                                value={subjectForm.data.year_semester}
                                onChange={(e) =>
                                    subjectForm.setData(
                                        'year_semester',
                                        e.target.value,
                                    )
                                }
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
                            <Field
                                label="Subject Code"
                                required
                                error={subjectForm.errors.subject_code}
                            >
                                <input
                                    value={subjectForm.data.subject_code}
                                    onChange={(e) =>
                                        subjectForm.setData(
                                            'subject_code',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. IC 111"
                                    className={`${inputCls} w-full`}
                                />
                            </Field>
                            <Field
                                label="Units"
                                required
                                error={subjectForm.errors.credit_units}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    step="0.5"
                                    value={subjectForm.data.credit_units}
                                    onChange={(e) =>
                                        subjectForm.setData(
                                            'credit_units',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="3"
                                    className={`${inputCls} w-full`}
                                />
                            </Field>
                        </div>

                        <Field
                            label="Course Title"
                            required
                            error={subjectForm.errors.subject_title}
                        >
                            <input
                                value={subjectForm.data.subject_title}
                                onChange={(e) =>
                                    subjectForm.setData(
                                        'subject_title',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. Programming Paradigm 1"
                                className={`${inputCls} w-full`}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field
                                label="Lec Hours"
                                error={subjectForm.errors.lec_hours}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    value={subjectForm.data.lec_hours}
                                    onChange={(e) =>
                                        subjectForm.setData(
                                            'lec_hours',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="3"
                                    className={`${inputCls} w-full`}
                                />
                            </Field>
                            <Field
                                label="Lab Hours"
                                error={subjectForm.errors.lab_hours}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    value={subjectForm.data.lab_hours}
                                    onChange={(e) =>
                                        subjectForm.setData(
                                            'lab_hours',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="0"
                                    className={`${inputCls} w-full`}
                                />
                            </Field>
                        </div>

                        <Field
                            label="Pre / Co-Requisite"
                            error={subjectForm.errors.pre_requisite}
                        >
                            <input
                                value={subjectForm.data.pre_requisite}
                                onChange={(e) =>
                                    subjectForm.setData(
                                        'pre_requisite',
                                        e.target.value,
                                    )
                                }
                                placeholder="None"
                                className={`${inputCls} w-full`}
                            />
                        </Field>
                    </div>
                    <div className="border-border flex justify-end gap-3 border-t px-6 py-4">
                        <button
                            type="button"
                            onClick={closeSubject}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={subjectForm.processing}
                            className={btnPrimary}
                        >
                            {subjectForm.processing
                                ? 'SAVING...'
                                : 'SAVE SUBJECT'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete subject */}
            <Modal
                open={!!deletingSubject}
                onClose={() => setDeletingSubject(null)}
                size="max-w-sm"
            >
                <div className="p-6 text-center">
                    <div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                        <TriangleAlert className="text-foreground size-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Remove Subject?</h3>
                    <p className="text-muted-foreground mt-2 mb-6 text-sm">
                        Remove{' '}
                        <strong className="text-foreground">
                            {deletingSubject?.subject_title}
                        </strong>{' '}
                        from the prospectus? Books linked to it will be removed
                        too.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setDeletingSubject(null)}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            disabled={deleteBusy}
                            onClick={confirmDeleteSubject}
                            className={btnDanger}
                        >
                            {deleteBusy ? 'REMOVING...' : 'REMOVE'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete program */}
            <Modal
                open={deleteProgramOpen}
                onClose={() => setDeleteProgramOpen(false)}
                size="max-w-sm"
            >
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#fee2e2]">
                        <TriangleAlert className="size-7 text-[#C44545]" />
                    </div>
                    <h3 className="text-lg font-semibold">Delete Program?</h3>
                    <p className="text-muted-foreground mt-2 mb-6 text-sm">
                        This will permanently remove{' '}
                        <strong className="text-foreground">
                            {program.program_name}
                        </strong>{' '}
                        and its prospectus, subjects, and books.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setDeleteProgramOpen(false)}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            disabled={deleteProgramBusy}
                            onClick={confirmDeleteProgram}
                            className={btnDanger}
                        >
                            {deleteProgramBusy ? 'DELETING...' : 'CONFIRM'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit prospectus */}
            <Modal
                open={prospectusOpen}
                onClose={() => setProspectusOpen(false)}
            >
                <form onSubmit={submitProspectus}>
                    <ModalHeader
                        title="Edit Prospectus"
                        onClose={() => setProspectusOpen(false)}
                    />
                    <div className="space-y-4 px-6 py-5">
                        <Field
                            label="Prospectus Title"
                            required
                            error={prospectusForm.errors.title}
                        >
                            <input
                                value={prospectusForm.data.title}
                                onChange={(e) =>
                                    prospectusForm.setData(
                                        'title',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. BSIT Prospectus"
                                className={`${inputCls} w-full`}
                            />
                        </Field>
                        <Field
                            label="Academic Year"
                            required
                            error={prospectusForm.errors.academic_year}
                        >
                            <input
                                value={prospectusForm.data.academic_year}
                                onChange={(e) =>
                                    prospectusForm.setData(
                                        'academic_year',
                                        e.target.value,
                                    )
                                }
                                placeholder="2024-2025"
                                className={`${inputCls} w-full`}
                            />
                        </Field>
                    </div>
                    <div className="border-border flex justify-end gap-3 border-t px-6 py-4">
                        <button
                            type="button"
                            onClick={() => setProspectusOpen(false)}
                            className={btnSecondary}
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={prospectusForm.processing}
                            className={btnPrimary}
                        >
                            {prospectusForm.processing ? 'SAVING...' : 'SAVE'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
