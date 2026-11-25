import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Printer,
    BookOpen,
    AlertCircle,
    FileText,
    Calendar,
    Info,
} from 'lucide-react';
import { collegeCode } from '@/lib/college';
import { downloadAssessmentReportPdf } from '@/lib/reportPdf';
import { downloadAssessmentReportExcel } from '@/lib/reportExcel';
import { ReportDownloadMenu } from '@/components/report-download-menu';

/**
 * Normalize saved references into [{ subject, books }] regardless of
 * whether the database stores grouped array, subject-keyed object, or flat list.
 */
function normalizeReferences(rawReferences) {
    if (!rawReferences) return [];

    if (Array.isArray(rawReferences)) {
        if (rawReferences.length === 0) return [];
        if ('subject' in rawReferences[0] && Array.isArray(rawReferences[0].books)) {
            return rawReferences;
        }
        return [{ subject: 'References', books: rawReferences }];
    }

    if (typeof rawReferences === 'object') {
        return Object.entries(rawReferences).map(([subject, books]) => ({
            subject,
            books: Array.isArray(books) ? books : [],
        }));
    }

    return [];
}

export default function View({ report }) {
    const summaryRows = useMemo(
        () => (Array.isArray(report?.summary) ? report.summary : []),
        [report],
    );

    const referencesData = useMemo(
        () => normalizeReferences(report?.references),
        [report],
    );

    const grandTotals = useMemo(
        () =>
            summaryRows.reduce(
                (acc, row) => ({
                    t: acc.t + (Number(row.totalT) || 0),
                    v: acc.v + (Number(row.totalV) || 0),
                    d5: acc.d5 + (Number(row.distinct5yr) || 0),
                    d10: acc.d10 + (Number(row.distinct10yr) || 0),
                    d20: acc.d20 + (Number(row.distinct20yr) || 0),
                }),
                { t: 0, v: 0, d5: 0, d10: 0, d20: 0 },
            ),
        [summaryRows],
    );

    const handleDownloadPdf = () => {
        if (!report) return;
        downloadAssessmentReportPdf({
            program: report,
            summaryRows,
            referencesData,
            grandTotals,
            dateLabel: report.created_at,
        });
    };

    const handleDownloadExcel = () => {
        if (!report) return;
        downloadAssessmentReportExcel({
            program: report,
            summaryRows,
            referencesData,
            grandTotals,
            dateLabel: report.created_at,
        });
    };

    if (!report) {
        return (
            <div className="w-full space-y-6">
                <Head title="Report Not Found • LibColla" />
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
                    <AlertCircle className="mx-auto mb-3 size-12 text-[#C44545]" />
                    <h1 className="text-lg font-bold text-[#4B5563] dark:text-white">
                        Report not found in the database.
                    </h1>
                    <p className="mt-1 text-sm text-[#4B5563]/70 dark:text-white/60">
                        This report does not exist or may have been deleted.
                    </p>
                    <Link
                        href="/reports/manage"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D66C6C] to-[#A04040] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Back to Reports</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <Head title={`Report Details - ${report.program_name} • LibColla`} />

            {/* Header Actions Bar */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm print:hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/reports/manage"
                            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#E5E5E5] text-[#4B5563] transition hover:bg-[#F8F8F8] dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                            title="Back to Reports"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div>
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A04040] dark:text-[#ffd7ba]">
                                <FileText className="size-3.5" />
                                Saved Collection Assessment Report
                            </span>
                            <h1 className="text-xl font-bold tracking-tight text-[#4B5563] dark:text-white">
                                {report.program_name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/reports/manage"
                            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#4B5563] shadow-sm transition hover:bg-[#F8F8F8] dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                            <ArrowLeft className="size-4" />
                            <span>Back to Reports</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#4B5563] shadow-sm transition hover:bg-[#F8F8F8] cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                            <Printer className="size-4 text-[#4B5563] dark:text-white/60" />
                            <span>Print</span>
                        </button>
                        <ReportDownloadMenu
                            onDownloadPdf={handleDownloadPdf}
                            onDownloadExcel={handleDownloadExcel}
                            direction="down"
                        />
                    </div>
                </div>

                {/* Academic Program Banner */}
                <div className="mt-6 rounded-xl border-l-4 border-[#A04040] bg-[#F9EDEF]/50 p-4 dark:border-[#E9A12B] dark:bg-white/[0.03]">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#A04040] dark:text-[#ffd7ba]">
                                Academic Program
                            </span>
                            <h2 className="text-base font-bold text-[#4B5563] dark:text-white">
                                {report.program_name}{' '}
                                {report.major ? `(${report.major})` : ''}
                            </h2>
                            <p className="text-xs text-[#4B5563] dark:text-white/60">
                                College: {collegeCode(report.college)}
                            </p>
                        </div>
                        <div className="text-xs text-[#4B5563] sm:text-right dark:text-white/60">
                            <div className="inline-flex items-center gap-1.5 font-medium text-[#4B5563] dark:text-white">
                                <Calendar className="size-3.5 text-[#A04040] dark:text-[#E9A12B]" />
                                <span>Generated: {report.created_at || '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Institutional Header */}
            <div className="mb-6 hidden border-b pb-4 text-center print:block">
                <h1 className="text-xl font-bold uppercase tracking-wider">
                    University of Southeastern Philippines
                </h1>
                <h2 className="text-md font-semibold text-gray-700">
                    Library Collection Assessment System
                </h2>
                <h3 className="mt-2 text-lg font-bold text-gray-900">
                    COLLECTION ASSESSMENT REPORT: {report.program_name}{' '}
                    {report.major ? `(${report.major})` : ''}
                </h3>
                <p className="text-sm text-gray-600">
                    College: {collegeCode(report.college)} • Generated:{' '}
                    {report.created_at || '—'}
                </p>
            </div>

            {/* 1. SUMMARY TABLE */}
            <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex flex-col justify-between gap-2 border-b border-[#E5E5E5] bg-[#F8F8F8] px-6 py-4 sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/[0.04]">
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#4B5563] dark:text-white">
                            <BookOpen className="size-4 text-[#A04040] dark:text-[#E9A12B]" />
                            1. Summary Table
                        </h3>
                        <p className="mt-0.5 text-xs text-[#4B5563] dark:text-white/60">
                            Summary of book titles and copyright recency per subject.
                        </p>
                    </div>
                    <div className="rounded-full bg-[#F9EDEF] px-3 py-1 text-xs font-semibold text-[#A04040] dark:bg-white/10 dark:text-white">
                        {summaryRows.length} Course Subjects
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs sm:text-sm">
                        <thead className="border-b border-[#E5E5E5] bg-[#F8F8F8] text-[#4B5563] dark:border-white/10 dark:bg-white/[0.02] dark:text-white">
                            <tr>
                                <th
                                    rowSpan={2}
                                    className="border-r border-[#E5E5E5] px-4 py-3 text-center font-bold dark:border-white/10"
                                >
                                    Classification
                                </th>
                                <th
                                    rowSpan={2}
                                    className="border-r border-[#E5E5E5] px-4 py-3 font-bold dark:border-white/10"
                                >
                                    Course Name
                                </th>
                                <th
                                    colSpan={2}
                                    className="border-r border-[#E5E5E5] bg-gray-100 px-4 py-2 text-center font-bold dark:border-white/10 dark:bg-white/[0.04]"
                                >
                                    Overall Total
                                </th>
                                <th
                                    colSpan={3}
                                    className="bg-gray-100 px-4 py-2 text-center font-bold dark:bg-white/[0.04]"
                                >
                                    Distinct Titles (Copyright Age)
                                </th>
                            </tr>
                            <tr className="border-t border-[#E5E5E5] text-xs font-semibold text-[#4B5563] dark:border-white/10 dark:text-white/60">
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10">
                                    T
                                </th>
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10">
                                    V
                                </th>
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10">
                                    &le; 5 yrs
                                </th>
                                <th className="border-r border-[#E5E5E5] px-3 py-1.5 text-center dark:border-white/10">
                                    &le; 10 yrs
                                </th>
                                <th className="px-3 py-1.5 text-center">
                                    &le; 20 yrs
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E5E5E5] dark:divide-white/10">
                            {summaryRows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 text-center text-[#4B5563] dark:text-white/60"
                                    >
                                        <AlertCircle className="mx-auto mb-2 size-10 opacity-30" />
                                        <p className="font-medium">
                                            No summary rows recorded in this report.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                summaryRows.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="transition hover:bg-[#F9EDEF]/30 dark:hover:bg-white/[0.05]"
                                    >
                                        <td className="border-r border-[#E5E5E5] px-4 py-2.5 text-center text-xs font-medium text-[#A04040] dark:border-white/10 dark:text-[#ffd7ba]">
                                            {row.classification || 'Core'}
                                        </td>
                                        <td className="border-r border-[#E5E5E5] px-4 py-2.5 text-xs font-semibold text-[#4B5563] dark:border-white/10 dark:text-white">
                                            {row.courseName}
                                        </td>
                                        <td className="border-r border-[#E5E5E5] px-3 py-2.5 text-center font-bold text-[#4B5563] dark:border-white/10 dark:text-white">
                                            {row.totalT ?? 0}
                                        </td>
                                        <td className="border-r border-[#E5E5E5] px-3 py-2.5 text-center font-bold text-[#4B5563] dark:border-white/10 dark:text-white">
                                            {row.totalV ?? 0}
                                        </td>
                                        <td className="border-r border-[#E5E5E5] px-3 py-2.5 text-center font-medium text-[#21865A] dark:border-white/10 dark:text-[#38a169]">
                                            {row.distinct5yr ?? 0}
                                        </td>
                                        <td className="border-r border-[#E5E5E5] px-3 py-2.5 text-center font-medium text-[#D18A24] dark:border-white/10 dark:text-[#f0c541]">
                                            {row.distinct10yr ?? 0}
                                        </td>
                                        <td className="px-3 py-2.5 text-center font-medium text-[#4B5563] dark:text-white/60">
                                            {row.distinct20yr ?? 0}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        {summaryRows.length > 0 && (
                            <tfoot className="border-t-2 border-[#A04040] bg-[#F8F8F8] font-bold text-[#4B5563] dark:border-[#E9A12B] dark:bg-white/[0.04] dark:text-white">
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="border-r border-[#E5E5E5] px-4 py-3 text-right uppercase tracking-wider dark:border-white/10"
                                    >
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
                                    <td className="px-3 py-3 text-center text-sm font-extrabold text-[#4B5563] dark:text-white/70">
                                        {grandTotals.d20}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* 2. LIST OF REFERENCES */}
            <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-[#F8F8F8] px-6 py-4 dark:border-white/10 dark:bg-white/[0.04]">
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#4B5563] dark:text-white">
                            <BookOpen className="size-4 text-[#A04040] dark:text-[#E9A12B]" />
                            2. List of References
                        </h3>
                        <p className="mt-0.5 text-xs text-[#4B5563] dark:text-white/60">
                            Cataloged books included in this saved assessment report.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs sm:text-sm">
                        <thead className="border-b border-[#E5E5E5] bg-[#F8F8F8] text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:border-white/10 dark:bg-white/[0.02] dark:text-white/60">
                            <tr>
                                <th className="px-4 py-3">Call No.</th>
                                <th className="px-4 py-3">Title of Book</th>
                                <th className="px-4 py-3">Author</th>
                                <th className="px-4 py-3 text-center">Year</th>
                                <th className="px-4 py-3 text-center">Copies</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E5E5E5] dark:divide-white/10">
                            {referencesData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-12 text-center text-[#4B5563] dark:text-white/60"
                                    >
                                        <BookOpen className="mx-auto mb-2 size-10 opacity-30" />
                                        <p className="font-medium">
                                            No book references recorded in this report.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                referencesData.map((group, sIdx) => (
                                    <React.Fragment key={sIdx}>
                                        <tr className="border-y border-[#E5E5E5] bg-[#F9EDEF] dark:border-white/10 dark:bg-white/[0.04]">
                                            <td
                                                colSpan={5}
                                                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#A04040] dark:text-[#ffd7ba]"
                                            >
                                                {group.subject} ({group.books.length}{' '}
                                                {group.books.length === 1 ? 'Title' : 'Titles'})
                                            </td>
                                        </tr>
                                        {group.books.map((b, bIdx) => (
                                            <tr
                                                key={`${sIdx}-${bIdx}`}
                                                className="transition hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                                            >
                                                <td className="px-4 py-2.5 font-mono text-xs text-[#4B5563] dark:text-white/60">
                                                    {b.callNo || '—'}
                                                </td>
                                                <td className="px-4 py-2.5 text-xs font-bold text-[#4B5563] dark:text-white">
                                                    {b.title}
                                                </td>
                                                <td className="px-4 py-2.5 text-xs text-[#4B5563] dark:text-white/70">
                                                    {b.author || '—'}
                                                </td>
                                                <td className="px-4 py-2.5 text-center text-xs font-semibold text-[#4B5563] dark:text-white">
                                                    {b.year || '—'}
                                                </td>
                                                <td className="px-4 py-2.5 text-center text-xs font-bold text-[#A04040] dark:text-[#ffd7ba]">
                                                    {b.copies ?? 1}
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
            <div className="rounded-xl border border-[#D18A24]/30 bg-[#D18A24]/10 p-4 text-xs text-[#4B5563] sm:text-sm dark:text-[#F9EDEF]">
                <div className="flex items-start gap-3">
                    <Info className="mt-0.5 size-5 shrink-0 text-[#D18A24]" />
                    <div className="space-y-1">
                        <span className="font-bold uppercase tracking-wider text-[#D18A24]">
                            Recency Evaluation Summary
                        </span>
                        <p className="text-xs text-[#4B5563]/80 dark:text-white/70">
                            <strong className="text-[#A04040] dark:text-[#ffd7ba]">
                                {grandTotals.d5}
                            </strong>{' '}
                            titles meet the 5-year copyright recency standard (&le; 5 yrs), and{' '}
                            <strong className="text-[#4B5563] dark:text-white">
                                {grandTotals.d10}
                            </strong>{' '}
                            titles meet the 10-year recency standard (&le; 10 yrs).
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 print:hidden">
                <Link
                    href="/reports/manage"
                    className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-sm font-semibold text-[#4B5563] shadow-sm transition hover:bg-[#F8F8F8] dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                    Back to Reports
                </Link>
                <ReportDownloadMenu
                    onDownloadPdf={handleDownloadPdf}
                    onDownloadExcel={handleDownloadExcel}
                    direction="up"
                />
            </div>
        </div>
    );
}
