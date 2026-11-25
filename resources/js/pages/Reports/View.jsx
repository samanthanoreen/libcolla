import React, { useState, useMemo } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Download,
    Printer,
    Trash2,
    Edit3,
    BookOpen,
    AlertCircle,
    CheckCircle2,
    GraduationCap,
    Info,
    Calendar,
} from 'lucide-react';
import { collegeCode } from '@/lib/college';

export default function Preview({ program, summary: initialSummary = [], references: initialReferences = [], recentCount = 0 }) {
    const [summaryRows, setSummaryRows] = useState(initialSummary);
    const [referencesData, setReferencesData] = useState(initialReferences);
    const [saving, setSaving] = useState(false);

    // Modal Confirmation Dialog state
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isDelete: false,
        onConfirm: () => {},
    });

    const openConfirmModal = ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDelete = false, onConfirm }) => {
        setModalState({
            isOpen: true,
            title,
            message,
            confirmText,
            cancelText,
            isDelete,
            onConfirm,
        });
    };

    const closeModal = () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
    };

    // Calculate Grand Totals dynamically
    const grandTotals = useMemo(() => {
        return summaryRows.reduce(
            (acc, row) => ({
                t: acc.t + (Number(row.totalT) || 0),
                v: acc.v + (Number(row.totalV) || 0),
                d5: acc.d5 + (Number(row.distinct5yr) || 0),
                d10: acc.d10 + (Number(row.distinct10yr) || 0),
                d20: acc.d20 + (Number(row.distinct20yr) || 0),
            }),
            { t: 0, v: 0, d5: 0, d10: 0, d20: 0 }
        );
    }, [summaryRows]);

    // Handle Summary Table inline editing
    const handleSummaryCellChange = (rowIndex, field, value) => {
        setSummaryRows((prev) => {
            const next = [...prev];
            next[rowIndex] = {
                ...next[rowIndex],
                [field]: ['totalT', 'totalV', 'distinct5yr', 'distinct10yr', 'distinct20yr'].includes(field)
                    ? Math.max(0, parseInt(value, 10) || 0)
                    : value,
            };
            return next;
        });
    };

    // Handle Delete Summary Row
    const confirmDeleteSummaryRow = (rowIndex) => {
        openConfirmModal({
            title: 'Delete Summary Row?',
            message: `Are you sure you want to remove "${summaryRows[rowIndex]?.courseName || 'this subject'}" from the summary? This will update the grand totals.`,
            confirmText: 'Delete Row',
            isDelete: true,
            onConfirm: () => {
                setSummaryRows((prev) => prev.filter((_, idx) => idx !== rowIndex));
                closeModal();
            },
        });
    };

    // Handle References Table inline editing
    const handleReferenceCellChange = (subjectIdx, bookIdx, field, value) => {
        setReferencesData((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            if (next[subjectIdx]?.books?.[bookIdx]) {
                next[subjectIdx].books[bookIdx][field] = ['year', 'copies'].includes(field)
                    ? Math.max(0, parseInt(value, 10) || 0)
                    : value;
            }
            return next;
        });
    };

    // Handle Delete Reference Book
    const confirmDeleteReferenceBook = (subjectIdx, bookIdx) => {
        const bookTitle = referencesData[subjectIdx]?.books?.[bookIdx]?.title || 'this book';
        openConfirmModal({
            title: 'Delete Reference Book?',
            message: `Are you sure you want to remove "${bookTitle}" from the references list?`,
            confirmText: 'Delete Book',
            isDelete: true,
            onConfirm: () => {
                setReferencesData((prev) => {
                    const next = JSON.parse(JSON.stringify(prev));
                    if (next[subjectIdx]) {
                        next[subjectIdx].books = next[subjectIdx].books.filter((_, idx) => idx !== bookIdx);
                        if (next[subjectIdx].books.length === 0) {
                            return next.filter((_, idx) => idx !== subjectIdx);
                        }
                    }
                    return next;
                });
                closeModal();
            },
        });
    };

    // Handle Save Report
    const handleSaveReport = () => {
        if (summaryRows.length === 0) {
            alert('Cannot save an empty report. Please ensure at least one summary row is present.');
            return;
        }

        openConfirmModal({
            title: 'Save Assessment Report',
            message: `Save this collection assessment report for ${program.program_name} (${collegeCode(program.college)}) to the database?`,
            confirmText: 'Save Report',
            isDelete: false,
            onConfirm: () => {
                setSaving(true);
                router.post(
                    '/reports',
                    {
                        program_id: program.id,
                        summary: summaryRows,
                        references: referencesData,
                    },
                    {
                        onFinish: () => {
                            setSaving(false);
                            closeModal();
                        },
                    }
                );
            },
        });
    };

    // Handle Download Text Report
    const handleDownloadText = () => {
        let content = `COLLECTION ASSESSMENT REPORT\n=======================================================\n\n`;
        content += `Institution : University of Southeastern Philippines\n`;
        content += `Program     : ${program.program_name}\n`;
        content += `College     : ${collegeCode(program.college)}\n`;
        content += `Major       : ${program.major || 'N/A'}\n`;
        content += `Generated   : ${new Date().toLocaleString()}\n\n`;

        content += `-------------------------------------------------------\n`;
        content += `1. SUMMARY TABLE\n`;
        content += `-------------------------------------------------------\n`;
        content += `Classification | Course Subject | Total T | Total V | <=5 Yrs | <=10 Yrs | <=20 Yrs\n`;

        summaryRows.forEach((r) => {
            content += `${r.classification || 'Core'} | ${r.courseName} | ${r.totalT} | ${r.totalV} | ${r.distinct5yr} | ${r.distinct10yr} | ${r.distinct20yr}\n`;
        });

        content += `\nGRAND TOTALS: T = ${grandTotals.t}, V = ${grandTotals.v}, <=5yr = ${grandTotals.d5}, <=10yr = ${grandTotals.d10}, <=20yr = ${grandTotals.d20}\n\n`;

        content += `-------------------------------------------------------\n`;
        content += `2. LIST OF REFERENCES (BOOKS)\n`;
        content += `-------------------------------------------------------\n`;

        referencesData.forEach((group) => {
            content += `\n[ ${group.subject} ]\n`;
            content += `Call No. | Title | Author | Year | Copies\n`;
            group.books.forEach((b) => {
                content += `${b.callNo || '—'} | ${b.title} | ${b.author || '—'} | ${b.year || '—'} | ${b.copies || 1}\n`;
            });
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `Collection_Assessment_${(program.program_name || 'Report').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full space-y-6">
            <Head title={`Preview Report - ${program.program_name} • LibColla`} />

            {/* Header Actions Bar */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm print:hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/reports/generate"
                            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#E5E5E5] text-[#4B5563] hover:bg-[#F8F8F8] hover:text-[#4B5563] transition dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                            title="Back to Program Selection"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#A04040] dark:text-[#ffd7ba]">
                                Collection Assessment Preview
                            </span>
                            <h1 className="text-xl font-bold tracking-tight text-[#4B5563] dark:text-white">
                                {program.program_name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#4B5563] shadow-sm transition hover:bg-[#F8F8F8] cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                            <Printer className="size-4 text-[#4B5563] dark:text-white/60" />
                            <span>Print</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleDownloadText}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#4B5563] shadow-sm transition hover:bg-[#F8F8F8] cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                            <Download className="size-4 text-[#4B5563] dark:text-white/60" />
                            <span>Download Text</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveReport}
                            disabled={saving || summaryRows.length === 0}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D66C6C] to-[#A04040] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50 cursor-pointer"
                        >
                            <Save className="size-4" />
                            <span>{saving ? 'Saving...' : 'Save Report'}</span>
                        </button>
                    </div>
                </div>

                {/* Academic Program Banner */}
                <div className="mt-6 rounded-xl border-l-4 border-[#A04040] bg-[#F9EDEF]/50 p-4 dark:border-[#E9A12B] dark:bg-white/[0.03]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#A04040] dark:text-[#ffd7ba]">
                                Academic Program
                            </span>
                            <h2 className="text-base font-bold text-[#4B5563] dark:text-white">
                                {program.program_name} {program.major ? `(${program.major})` : ''}
                            </h2>
                            <p className="text-xs text-[#4B5563] dark:text-white/60">College: {collegeCode(program.college)}</p>
                        </div>
                        <div className="text-xs sm:text-right text-[#4B5563] dark:text-white/60">
                            <div>System Status: <span className="font-semibold text-[#21865A]">Ready to Assess</span></div>
                            <div>Date: <span className="font-medium text-[#4B5563] dark:text-white">{new Date().toLocaleDateString()}</span></div>
                        </div>
                    </div>
                </div>

                {/* Edit hint banner */}
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#3478B9]/30 bg-[#3478B9]/10 px-4 py-2.5 text-xs text-[#3478B9] dark:border-[#3478B9]/50 dark:bg-[#3478B9]/20">
                    <Edit3 className="size-4 shrink-0" />
                    <span>
                        <strong>Inline Editing Enabled:</strong> Click directly into any table cell below to edit its values prior to saving or downloading.
                    </span>
                </div>
            </div>

            {/* Print Institutional Header (only shows when printing) */}
            <div className="hidden print:block text-center border-b pb-4 mb-6">
                <h1 className="text-xl font-bold uppercase tracking-wider">University of Southeastern Philippines</h1>
                <h2 className="text-md font-semibold text-gray-700">Library Collection Assessment System</h2>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                    COLLECTION ASSESSMENT REPORT: {program.program_name} {program.major ? `(${program.major})` : ''}
                </h3>
                <p className="text-sm text-gray-600">College: {collegeCode(program.college)} • Date: {new Date().toLocaleDateString()}</p>
            </div>

            {/* 1. SUMMARY TABLE CARD */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white shadow-sm overflow-hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="border-b border-[#E5E5E5] bg-[#F8F8F8] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 dark:border-white/10 dark:bg-white/[0.04]">
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-[#4B5563] flex items-center gap-2 dark:text-white">
                            <BookOpen className="size-4 text-[#A04040] dark:text-[#E9A12B]" />
                            1. Summary Assessment Table
                        </h3>
                        <p className="text-xs text-[#4B5563] mt-0.5 dark:text-white/60">
                            Shows the count of book titles per subject and the recency of copyright years.
                        </p>
                    </div>
                    <div className="text-xs font-semibold text-[#A04040] bg-[#F9EDEF] px-3 py-1 rounded-full dark:bg-white/10 dark:text-white">
                        {summaryRows.length} Course Subjects
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead className="bg-[#F8F8F8] text-[#4B5563] border-b border-[#E5E5E5] dark:bg-white/[0.02] dark:border-white/10 dark:text-white">
                            <tr>
                                <th rowSpan={2} className="border-r border-[#E5E5E5] px-4 py-3 font-bold text-center dark:border-white/10">
                                    Classification
                                </th>
                                <th rowSpan={2} className="border-r border-[#E5E5E5] px-4 py-3 font-bold dark:border-white/10">
                                    Course Subject Name
                                </th>
                                <th colSpan={2} className="border-r border-[#E5E5E5] px-4 py-2 font-bold text-center bg-gray-100 dark:bg-white/[0.04] dark:border-white/10">
                                    Overall Total
                                </th>
                                <th colSpan={3} className="border-r border-[#E5E5E5] px-4 py-2 font-bold text-center bg-gray-100 dark:bg-white/[0.04] dark:border-white/10">
                                    No. of Distinct Title(s) by Recency
                                </th>
                                <th rowSpan={2} className="px-4 py-3 font-bold text-center print:hidden">
                                    Action
                                </th>
                            </tr>
                            <tr className="border-t border-[#E5E5E5] text-xs font-semibold text-[#4B5563] dark:border-white/10 dark:text-white/60">
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10" title="Total Titles">T</th>
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10" title="Total Volumes">V</th>
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10" title="Copyright <= 5 years">&le; 5 yrs</th>
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10" title="Copyright <= 10 years">&le; 10 yrs</th>
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10" title="Copyright <= 20 years">&le; 20 yrs</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E5E5E5] dark:divide-white/10">
                            {summaryRows.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-[#4B5563] dark:text-white/60">
                                        <AlertCircle className="mx-auto size-10 opacity-30 mb-2" />
                                        <p className="font-medium">No subjects found for this academic program.</p>
                                    </td>
                                </tr>
                            ) : (
                                summaryRows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-[#F9EDEF]/30 transition group dark:hover:bg-white/[0.05]">
                                        <td className="border-r border-[#E5E5E5] p-2 text-center dark:border-white/10">
                                            <input
                                                type="text"
                                                value={row.classification || 'Core'}
                                                onChange={(e) => handleSummaryCellChange(idx, 'classification', e.target.value)}
                                                className="w-full text-center rounded bg-transparent px-2 py-1 text-xs font-medium text-[#A04040] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-[#ffd7ba] dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                            />
                                        </td>
                                        <td className="border-r border-[#E5E5E5] p-2 dark:border-white/10">
                                            <input
                                                type="text"
                                                value={row.courseName}
                                                onChange={(e) => handleSummaryCellChange(idx, 'courseName', e.target.value)}
                                                className="w-full rounded bg-transparent px-2 py-1 text-xs font-semibold text-[#4B5563] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                            />
                                        </td>
                                        <td className="border-r border-[#E5E5E5] p-2 text-center dark:border-white/10">
                                            <input
                                                type="number"
                                                min="0"
                                                value={row.totalT}
                                                onChange={(e) => handleSummaryCellChange(idx, 'totalT', e.target.value)}
                                                className="w-16 text-center rounded bg-transparent px-1 py-1 font-bold text-[#4B5563] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                            />
                                        </td>
                                        <td className="border-r border-[#E5E5E5] p-2 text-center dark:border-white/10">
                                            <input
                                                type="number"
                                                min="0"
                                                value={row.totalV}
                                                onChange={(e) => handleSummaryCellChange(idx, 'totalV', e.target.value)}
                                                className="w-16 text-center rounded bg-transparent px-1 py-1 font-bold text-[#4B5563] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                            />
                                        </td>
                                        <td className="border-r border-[#E5E5E5] p-2 text-center dark:border-white/10">
                                            <input
                                                type="number"
                                                min="0"
                                                value={row.distinct5yr}
                                                onChange={(e) => handleSummaryCellChange(idx, 'distinct5yr', e.target.value)}
                                                className="w-16 text-center rounded bg-transparent px-1 py-1 font-medium text-[#21865A] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-[#38a169] dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                            />
                                        </td>
                                        <td className="border-r border-[#E5E5E5] p-2 text-center dark:border-white/10">
                                            <input
                                                type="number"
                                                min="0"
                                                value={row.distinct10yr}
                                                onChange={(e) => handleSummaryCellChange(idx, 'distinct10yr', e.target.value)}
                                                className="w-16 text-center rounded bg-transparent px-1 py-1 font-medium text-[#D18A24] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-[#f0c541] dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                            />
                                        </td>
                                        <td className="border-r border-[#E5E5E5] p-2 text-center dark:border-white/10">
                                            <input
                                                type="number"
                                                min="0"
                                                value={row.distinct20yr}
                                                onChange={(e) => handleSummaryCellChange(idx, 'distinct20yr', e.target.value)}
                                                className="w-16 text-center rounded bg-transparent px-1 py-1 font-medium text-[#4B5563] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-white/60 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                            />
                                        </td>
                                        <td className="p-2 text-center print:hidden">
                                            <button
                                                type="button"
                                                onClick={() => confirmDeleteSummaryRow(idx)}
                                                title="Delete row"
                                                className="inline-flex size-8 items-center justify-center rounded-lg text-[#C44545] hover:bg-[#F9EDEF] transition cursor-pointer dark:hover:bg-white/10"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        {summaryRows.length > 0 && (
                            <tfoot className="border-t-2 border-[#A04040] bg-[#F8F8F8] font-bold text-[#4B5563] dark:border-[#E9A12B] dark:bg-white/[0.04] dark:text-white">
                                <tr>
                                    <td colSpan={2} className="border-r border-[#E5E5E5] px-4 py-3 uppercase tracking-wider text-right dark:border-white/10">
                                        GRAND TOTAL
                                    </td>
                                    <td className="border-r border-[#E5E5E5] px-3 py-3 text-center text-sm font-extrabold text-[#A04040] dark:border-white/10 dark:text-[#ffd7ba]">
                                        {grandTotals.t}
                                    </td>
                                    <td className="border-r border-[#E5E5E5] px-3 py-3 text-center text-sm font-extrabold text-[#A04040] dark:border-white/10 dark:text-[#ffd7ba]">
                                        {grandTotals.v}
                                    </td>
                                    <td className="border-r border-[#E5E5E5] px-3 py-3 text-center text-sm font-extrabold text-[#21865A] dark:border-white/10 dark:text-[#38a169]">
                                        {grandTotals.d5}
                                    </td>
                                    <td className="border-r border-[#E5E5E5] px-3 py-3 text-center text-sm font-extrabold text-[#D18A24] dark:border-white/10 dark:text-[#f0c541]">
                                        {grandTotals.d10}
                                    </td>
                                    <td className="border-r border-[#E5E5E5] px-3 py-3 text-center text-sm font-extrabold text-[#4B5563] dark:border-white/10 dark:text-white/70">
                                        {grandTotals.d20}
                                    </td>
                                    <td className="print:hidden"></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* 2. LIST OF REFERENCES (BOOKS) CARD */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white shadow-sm overflow-hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="border-b border-[#E5E5E5] bg-[#F8F8F8] px-6 py-4 flex items-center justify-between dark:border-white/10 dark:bg-white/[0.04]">
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-[#4B5563] flex items-center gap-2 dark:text-white">
                            <BookOpen className="size-4 text-[#A04040] dark:text-[#E9A12B]" />
                            2. List of References (Cataloged Books)
                        </h3>
                        <p className="text-xs text-[#4B5563] mt-0.5 dark:text-white/60">
                            Grouped by curriculum course subject.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead className="bg-[#F8F8F8] text-xs font-bold uppercase tracking-wider text-[#4B5563] border-b border-[#E5E5E5] dark:bg-white/[0.02] dark:border-white/10 dark:text-white/60">
                            <tr>
                                <th className="px-4 py-3">Call Number</th>
                                <th className="px-4 py-3">Title of Book</th>
                                <th className="px-4 py-3">Author(s)</th>
                                <th className="px-4 py-3 text-center">Pub Year</th>
                                <th className="px-4 py-3 text-center">Copies</th>
                                <th className="px-4 py-3 text-center print:hidden">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E5E5E5] dark:divide-white/10">
                            {referencesData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[#4B5563] dark:text-white/60">
                                        <BookOpen className="mx-auto size-10 opacity-30 mb-2" />
                                        <p className="font-medium">No book references currently assigned to these subjects.</p>
                                    </td>
                                </tr>
                            ) : (
                                referencesData.map((group, sIdx) => (
                                    <React.Fragment key={sIdx}>
                                        {/* Subject header band */}
                                        <tr className="bg-[#F9EDEF] border-y border-[#E5E5E5] dark:bg-white/[0.04] dark:border-white/10">
                                            <td colSpan={6} className="px-6 py-2.5 font-bold text-xs uppercase tracking-wider text-[#A04040] dark:text-[#ffd7ba]">
                                                {group.subject} ({group.books.length} {group.books.length === 1 ? 'Title' : 'Titles'})
                                            </td>
                                        </tr>

                                        {group.books.map((b, bIdx) => (
                                            <tr key={`${sIdx}-${bIdx}`} className="hover:bg-gray-50 transition dark:hover:bg-white/[0.04]">
                                                <td className="px-4 py-2.5 text-xs text-[#4B5563] dark:text-white/60">
                                                    <input
                                                        type="text"
                                                        value={b.callNo || ''}
                                                        onChange={(e) => handleReferenceCellChange(sIdx, bIdx, 'callNo', e.target.value)}
                                                        className="w-full rounded bg-transparent px-2 py-1 text-xs text-[#4B5563] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                                    />
                                                </td>
                                                <td className="px-4 py-2.5 font-bold text-[#4B5563] dark:text-white">
                                                    <input
                                                        type="text"
                                                        value={b.title}
                                                        onChange={(e) => handleReferenceCellChange(sIdx, bIdx, 'title', e.target.value)}
                                                        className="w-full rounded bg-transparent px-2 py-1 text-xs font-bold text-[#4B5563] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                                    />
                                                </td>
                                                <td className="px-4 py-2.5 text-[#4B5563] dark:text-white">
                                                    <input
                                                        type="text"
                                                        value={b.author || ''}
                                                        onChange={(e) => handleReferenceCellChange(sIdx, bIdx, 'author', e.target.value)}
                                                        className="w-full rounded bg-transparent px-2 py-1 text-xs text-[#4B5563] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                                    />
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <input
                                                        type="number"
                                                        value={b.year || 0}
                                                        onChange={(e) => handleReferenceCellChange(sIdx, bIdx, 'year', e.target.value)}
                                                        className="w-16 text-center rounded bg-transparent px-1 py-1 text-xs font-semibold text-[#4B5563] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                                    />
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={b.copies || 1}
                                                        onChange={(e) => handleReferenceCellChange(sIdx, bIdx, 'copies', e.target.value)}
                                                        className="w-16 text-center rounded bg-transparent px-1 py-1 text-xs font-bold text-[#A04040] outline-none hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#A04040] dark:text-[#ffd7ba] dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:ring-[#E9A12B]"
                                                    />
                                                </td>
                                                <td className="px-4 py-2.5 text-center print:hidden">
                                                    <button
                                                        type="button"
                                                        onClick={() => confirmDeleteReferenceBook(sIdx, bIdx)}
                                                        title="Delete reference"
                                                        className="inline-flex size-8 items-center justify-center rounded-lg text-[#C44545] hover:bg-[#F9EDEF] transition cursor-pointer dark:hover:bg-white/10"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recency Criteria Summary Box */}
            <div className="rounded-xl border border-[#D18A24]/30 bg-[#D18A24]/10 p-4 text-xs sm:text-sm text-[#4B5563] dark:text-[#F9EDEF]">
                <div className="flex items-start gap-3">
                    <Info className="size-5 text-[#D18A24] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <span className="font-bold uppercase tracking-wider text-[#D18A24]">
                            Recency Evaluation Criteria
                        </span>
                        <p className="text-xs text-[#4B5563]/80 dark:text-white/70">
                            Based on university accreditation requirements, <strong className="text-[#A04040] dark:text-[#ffd7ba]">{grandTotals.d5}</strong> titles meet the 5-year copyright recency standard (&le; 5 yrs), and <strong className="text-[#4B5563] dark:text-white">{grandTotals.d10}</strong> titles meet the 10-year recency standard (&le; 10 yrs).
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-end gap-3 print:hidden pt-2">
                <Link
                    href="/reports/generate"
                    className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-sm font-semibold text-[#4B5563] shadow-sm hover:bg-[#F8F8F8] transition dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                    Cancel / Back
                </Link>
                <button
                    type="button"
                    onClick={handleDownloadText}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-sm font-semibold text-[#4B5563] shadow-sm hover:bg-[#F8F8F8] transition cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                    <Download className="size-4 text-[#4B5563] dark:text-white/60" />
                    <span>Download Text</span>
                </button>
                <button
                    type="button"
                    onClick={handleSaveReport}
                    disabled={saving || summaryRows.length === 0}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D66C6C] to-[#A04040] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 transition disabled:opacity-50 cursor-pointer"
                >
                    <Save className="size-4" />
                    <span>{saving ? 'Saving...' : 'Save Report to Database'}</span>
                </button>
            </div>

            {/* Confirmation Modal */}
            {modalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E5E5] text-center animate-in zoom-in-95 duration-150 dark:bg-[#280B14] dark:border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl ${
                                modalState.isDelete
                                    ? 'bg-[#F9EDEF] text-[#C44545] dark:bg-[#C44545]/20'
                                    : 'bg-[#F9EDEF] text-[#A04040] dark:bg-[#A04040]/20'
                            }`}
                        >
                            {modalState.isDelete ? (
                                <Trash2 className="size-7" />
                            ) : (
                                <Save className="size-7" />
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-[#4B5563] mb-2 dark:text-white">
                            {modalState.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4B5563] mb-6 leading-relaxed dark:text-white/60">
                            {modalState.message}
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-full rounded-xl border border-[#E5E5E5] bg-white py-2.5 text-sm font-semibold text-[#4B5563] hover:bg-[#F8F8F8] transition cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                            >
                                {modalState.cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={modalState.onConfirm}
                                className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition cursor-pointer ${
                                    modalState.isDelete
                                        ? 'bg-[#C44545] hover:bg-[#a73535]'
                                        : 'bg-gradient-to-r from-[#D66C6C] to-[#A04040] hover:brightness-95'
                                }`}
                            >
                                {modalState.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}