import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Printer,
    Download,
    BookOpen,
    FolderOpen,
    Calendar,
    GraduationCap,
    AlertCircle,
    Info,
} from 'lucide-react';

export default function View({ report }) {
    if (!report) {
        return (
            <div className="rounded-2xl border border-[#E2E5E9] bg-white p-12 text-center shadow-sm">
                <AlertCircle className="mx-auto size-12 text-[#C44545] mb-3" />
                <h1 className="text-xl font-bold text-[#343A40]">Report Not Found</h1>
                <p className="text-sm text-[#9299A5] mt-1 mb-6">
                    The requested collection assessment report could not be found or has been removed.
                </p>
                <Link
                    href="/reports/manage"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#701F35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4D1425] transition"
                >
                    <ArrowLeft className="size-4" />
                    <span>Back to Reports</span>
                </Link>
            </div>
        );
    }

    const summary = Array.isArray(report.summary) ? report.summary : [];
    const references = report.references || [];

    // Calculate Grand Totals
    const grandTotals = useMemo(() => {
        return summary.reduce(
            (acc, row) => ({
                t: acc.t + (Number(row.totalT) || 0),
                v: acc.v + (Number(row.totalV) || 0),
                d5: acc.d5 + (Number(row.distinct5yr) || 0),
                d10: acc.d10 + (Number(row.distinct10yr) || 0),
                d20: acc.d20 + (Number(row.distinct20yr) || 0),
            }),
            { t: 0, v: 0, d5: 0, d10: 0, d20: 0 }
        );
    }, [summary]);

    // Download Text Report
    const handleDownloadText = () => {
        let content = `COLLECTION ASSESSMENT REPORT\n=======================================================\n\n`;
        content += `Institution : University of Southeastern Philippines\n`;
        content += `Program     : ${report.program_name}\n`;
        content += `College     : ${report.college}\n`;
        content += `Major       : ${report.major || 'N/A'}\n`;
        content += `Generated   : ${report.created_at || new Date().toLocaleString()}\n\n`;

        content += `-------------------------------------------------------\n`;
        content += `1. SUMMARY TABLE\n`;
        content += `-------------------------------------------------------\n`;
        content += `Classification | Course Subject | Total T | Total V | <=5 Yrs | <=10 Yrs | <=20 Yrs\n`;

        summary.forEach((r) => {
            content += `${r.classification || 'Core'} | ${r.courseName} | ${r.totalT} | ${r.totalV} | ${r.distinct5yr} | ${r.distinct10yr} | ${r.distinct20yr}\n`;
        });

        content += `\nGRAND TOTALS: T = ${grandTotals.t}, V = ${grandTotals.v}, <=5yr = ${grandTotals.d5}, <=10yr = ${grandTotals.d10}, <=20yr = ${grandTotals.d20}\n\n`;

        content += `-------------------------------------------------------\n`;
        content += `2. LIST OF REFERENCES (BOOKS)\n`;
        content += `-------------------------------------------------------\n`;

        if (Array.isArray(references)) {
            references.forEach((group) => {
                content += `\n[ ${group.subject} ]\n`;
                content += `Call No. | Title | Author | Year | Copies\n`;
                (group.books || []).forEach((b) => {
                    content += `${b.callNo || '—'} | ${b.title} | ${b.author || '—'} | ${b.year || '—'} | ${b.copies || 1}\n`;
                });
            });
        } else {
            Object.keys(references).forEach((subj) => {
                content += `\n[ ${subj} ]\n`;
                content += `Call No. | Title | Author | Year | Copies\n`;
                (references[subj] || []).forEach((b) => {
                    content += `${b.callNo || '—'} | ${b.title} | ${b.author || '—'} | ${b.year || '—'} | ${b.copies || 1}\n`;
                });
            });
        }

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `Report_${(report.program_name || 'Report').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full space-y-6">
            <Head title={`Report: ${report.program_name} • LibColla`} />

            {/* Top Action Bar */}
            <div className="rounded-2xl border border-[#E2E5E9] bg-white p-6 shadow-sm print:hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/reports/manage"
                            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#E2E5E9] text-[#9299A5] hover:bg-[#F4F5F7] hover:text-[#343A40] transition dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                            title="Back to Reports"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#701F35] dark:text-[#ffd7ba]">
                                Saved Collection Assessment Report
                            </span>
                            <h1 className="text-xl font-bold tracking-tight text-[#343A40] dark:text-white">
                                {report.program_name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#E2E5E9] bg-white px-4 py-2.5 text-sm font-semibold text-[#343A40] shadow-sm hover:bg-[#F4F5F7] transition cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                            <Printer className="size-4 text-[#9299A5] dark:text-white/60" />
                            <span>Print</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleDownloadText}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#701F35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4D1425] transition cursor-pointer"
                        >
                            <Download className="size-4" />
                            <span>Download Text</span>
                        </button>
                    </div>
                </div>

                {/* Report Info Card */}
                <div className="mt-6 rounded-xl border-l-4 border-[#701F35] bg-[#F5E9ED]/50 p-4 dark:border-[#d4a017] dark:bg-white/[0.03]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#701F35] dark:text-[#ffd7ba]">
                                Academic Program
                            </span>
                            <h2 className="text-base font-bold text-[#343A40] dark:text-white">
                                {report.program_name} {report.major ? `(${report.major})` : ''}
                            </h2>
                            <p className="text-xs text-[#9299A5] dark:text-white/60">College of {report.college}</p>
                        </div>
                        <div className="text-xs sm:text-right text-[#9299A5] dark:text-white/60">
                            <div className="flex items-center sm:justify-end gap-1.5">
                                <Calendar className="size-3.5 text-[#9299A5] dark:text-white/50" />
                                <span>Generated: <strong className="text-[#343A40] dark:text-white">{report.created_at}</strong></span>
                            </div>
                            <div className="mt-1">
                                Status: <span className="font-semibold text-[#21865A]">Official Assessment Record</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Institutional Header */}
            <div className="hidden print:block text-center border-b pb-4 mb-6">
                <h1 className="text-xl font-bold uppercase tracking-wider">University of Southeastern Philippines</h1>
                <h2 className="text-md font-semibold text-gray-700">Library Collection Assessment System</h2>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                    COLLECTION ASSESSMENT REPORT: {report.program_name} {report.major ? `(${report.major})` : ''}
                </h3>
                <p className="text-sm text-gray-600">College of {report.college} • Date Generated: {report.created_at}</p>
            </div>

            {/* 1. SUMMARY ASSESSMENT TABLE */}
            <div className="rounded-2xl border border-[#E2E5E9] bg-white shadow-sm overflow-hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="border-b border-[#E2E5E9] bg-[#F4F5F7] px-6 py-4 flex items-center justify-between dark:border-white/10 dark:bg-white/[0.04]">
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-[#343A40] flex items-center gap-2 dark:text-white">
                            <BookOpen className="size-4 text-[#701F35] dark:text-[#d4a017]" />
                            1. Summary Assessment Table
                        </h3>
                        <p className="text-xs text-[#9299A5] mt-0.5 dark:text-white/60">
                            Number of titles per subject and the copyright recency counts.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead className="bg-[#F4F5F7] text-[#343A40] border-b border-[#E2E5E9] dark:bg-white/[0.02] dark:border-white/10 dark:text-white">
                            <tr>
                                <th rowSpan={2} className="border-r border-[#E2E5E9] px-4 py-3 font-bold text-center dark:border-white/10">
                                    Classification
                                </th>
                                <th rowSpan={2} className="border-r border-[#E2E5E9] px-4 py-3 font-bold dark:border-white/10">
                                    Course Subject Name
                                </th>
                                <th colSpan={2} className="border-r border-[#E2E5E9] px-4 py-2 font-bold text-center bg-gray-100 dark:bg-white/[0.04] dark:border-white/10">
                                    Overall Total
                                </th>
                                <th colSpan={3} className="px-4 py-2 font-bold text-center bg-gray-100 dark:bg-white/[0.04]">
                                    No. of Distinct Title(s) by Recency
                                </th>
                            </tr>
                            <tr className="border-t border-[#E2E5E9] text-xs font-semibold text-[#9299A5] dark:border-white/10 dark:text-white/60">
                                <th className="border-r border-[#E2E5E9] px-3 py-1.5 text-center dark:border-white/10">T</th>
                                <th className="border-r border-[#E2E5E9] px-3 py-1.5 text-center dark:border-white/10">V</th>
                                <th className="border-r border-[#E2E5E9] px-3 py-1.5 text-center dark:border-white/10">&le; 5 yrs</th>
                                <th className="border-r border-[#E2E5E9] px-3 py-1.5 text-center dark:border-white/10">&le; 10 yrs</th>
                                <th className="px-3 py-1.5 text-center">&le; 20 yrs</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E2E5E9] dark:divide-white/10">
                            {summary.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-[#9299A5] dark:text-white/60">
                                        No summary data recorded in this report.
                                    </td>
                                </tr>
                            ) : (
                                summary.map((r, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition dark:hover:bg-white/[0.05]">
                                        <td className="border-r border-[#E2E5E9] px-4 py-3 text-center font-medium text-[#701F35] dark:border-white/10 dark:text-[#ffd7ba]">
                                            {r.classification || 'Core'}
                                        </td>
                                        <td className="border-r border-[#E2E5E9] px-4 py-3 font-semibold text-[#343A40] dark:border-white/10 dark:text-white">
                                            {r.courseName}
                                        </td>
                                        <td className="border-r border-[#E2E5E9] px-3 py-3 text-center font-bold text-[#343A40] dark:border-white/10 dark:text-white">
                                            {r.totalT}
                                        </td>
                                        <td className="border-r border-[#E2E5E9] px-3 py-3 text-center font-bold text-[#343A40] dark:border-white/10 dark:text-white">
                                            {r.totalV}
                                        </td>
                                        <td className="border-r border-[#E2E5E9] px-3 py-3 text-center font-medium text-[#21865A] dark:border-white/10 dark:text-[#38a169]">
                                            {r.distinct5yr}
                                        </td>
                                        <td className="border-r border-[#E2E5E9] px-3 py-3 text-center font-medium text-[#D18A24] dark:border-white/10 dark:text-[#f0c541]">
                                            {r.distinct10yr}
                                        </td>
                                        <td className="px-3 py-3 text-center font-medium text-[#9299A5] dark:text-white/60">
                                            {r.distinct20yr}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        {summary.length > 0 && (
                            <tfoot className="border-t-2 border-[#701F35] bg-[#F4F5F7] font-bold text-[#343A40] dark:border-[#d4a017] dark:bg-white/[0.04] dark:text-white">
                                <tr>
                                    <td colSpan={2} className="border-r border-[#E2E5E9] px-4 py-3 uppercase tracking-wider text-right dark:border-white/10">
                                        GRAND TOTAL
                                    </td>
                                    <td className="border-r border-[#E2E5E9] px-3 py-3 text-center text-sm font-extrabold text-[#701F35] dark:border-white/10 dark:text-[#ffd7ba]">
                                        {grandTotals.t}
                                    </td>
                                    <td className="border-r border-[#E2E5E9] px-3 py-3 text-center text-sm font-extrabold text-[#701F35] dark:border-white/10 dark:text-[#ffd7ba]">
                                        {grandTotals.v}
                                    </td>
                                    <td className="border-r border-[#E2E5E9] px-3 py-3 text-center text-sm font-extrabold text-[#21865A] dark:border-white/10 dark:text-[#38a169]">
                                        {grandTotals.d5}
                                    </td>
                                    <td className="border-r border-[#E2E5E9] px-3 py-3 text-center text-sm font-extrabold text-[#D18A24] dark:border-white/10 dark:text-[#f0c541]">
                                        {grandTotals.d10}
                                    </td>
                                    <td className="px-3 py-3 text-center text-sm font-extrabold text-[#9299A5] dark:border-white/10 dark:text-white/70">
                                        {grandTotals.d20}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* 2. LIST OF REFERENCES (BOOKS) */}
            <div className="rounded-2xl border border-[#E2E5E9] bg-white shadow-sm overflow-hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="border-b border-[#E2E5E9] bg-[#F4F5F7] px-6 py-4 flex items-center justify-between dark:border-white/10 dark:bg-white/[0.04]">
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-[#343A40] flex items-center gap-2 dark:text-white">
                            <BookOpen className="size-4 text-[#701F35] dark:text-[#d4a017]" />
                            2. List of References (Cataloged Books)
                        </h3>
                        <p className="text-xs text-[#9299A5] mt-0.5 dark:text-white/60">
                            Grouped by curriculum course subject.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead className="bg-[#F4F5F7] text-xs font-bold uppercase tracking-wider text-[#9299A5] border-b border-[#E2E5E9] dark:bg-white/[0.02] dark:border-white/10 dark:text-white/60">
                            <tr>
                                <th className="px-4 py-3">Call Number</th>
                                <th className="px-4 py-3">Title of Book</th>
                                <th className="px-4 py-3">Author(s)</th>
                                <th className="px-4 py-3 text-center">Pub Year</th>
                                <th className="px-4 py-3 text-center">Copies</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E2E5E9] dark:divide-white/10">
                            {Array.isArray(references) ? (
                                references.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-[#9299A5] dark:text-white/60">
                                            No book references attached to this report.
                                        </td>
                                    </tr>
                                ) : (
                                    references.map((group, sIdx) => (
                                        <React.Fragment key={sIdx}>
                                            <tr className="bg-[#F5E9ED] border-y border-[#E2E5E9] dark:bg-white/[0.04] dark:border-white/10">
                                                <td colSpan={5} className="px-6 py-2.5 font-bold text-xs uppercase tracking-wider text-[#701F35] dark:text-[#ffd7ba]">
                                                    {group.subject} ({group.books?.length || 0} Titles)
                                                </td>
                                            </tr>
                                            {(group.books || []).map((b, bIdx) => (
                                                <tr key={`${sIdx}-${bIdx}`} className="hover:bg-gray-50 transition dark:hover:bg-white/[0.04]">
                                                    <td className="px-4 py-2.5 font-mono text-xs text-[#9299A5] dark:text-white/60">
                                                        {b.callNo || '—'}
                                                    </td>
                                                    <td className="px-4 py-2.5 font-bold text-[#343A40] dark:text-white">
                                                        {b.title}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-[#343A40] dark:text-white">
                                                        {b.author || '—'}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center font-semibold text-[#343A40] dark:text-white">
                                                        {b.year || '—'}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center font-bold text-[#701F35] dark:text-[#ffd7ba]">
                                                        {b.copies || 1}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))
                                )
                            ) : (
                                Object.keys(references).map((subject, sIdx) => (
                                    <React.Fragment key={sIdx}>
                                        <tr className="bg-[#F5E9ED] border-y border-[#E2E5E9] dark:bg-white/[0.04] dark:border-white/10">
                                            <td colSpan={5} className="px-6 py-2.5 font-bold text-xs uppercase tracking-wider text-[#701F35] dark:text-[#ffd7ba]">
                                                {subject}
                                            </td>
                                        </tr>
                                        {(references[subject] || []).map((b, bIdx) => (
                                            <tr key={`${sIdx}-${bIdx}`} className="hover:bg-gray-50 transition dark:hover:bg-white/[0.04]">
                                                <td className="px-4 py-2.5 font-mono text-xs text-[#9299A5] dark:text-white/60">
                                                    {b.callNo || '—'}
                                                </td>
                                                <td className="px-4 py-2.5 font-bold text-[#343A40] dark:text-white">
                                                    {b.title}
                                                </td>
                                                <td className="px-4 py-2.5 text-[#343A40] dark:text-white">
                                                    {b.author || '—'}
                                                </td>
                                                <td className="px-4 py-2.5 text-center font-semibold text-[#343A40] dark:text-white">
                                                    {b.year || '—'}
                                                </td>
                                                <td className="px-4 py-2.5 text-center font-bold text-[#701F35] dark:text-[#ffd7ba]">
                                                    {b.copies || 1}
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

            {/* Criteria note */}
            <div className="rounded-xl border border-[#21865A]/30 bg-[#21865A]/10 p-4 text-xs sm:text-sm text-[#343A40] dark:text-[#F5E9ED]">
                <div className="flex items-start gap-3">
                    <Info className="size-5 text-[#21865A] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <span className="font-bold uppercase tracking-wider text-[#21865A]">
                            Accreditation Recency Summary
                        </span>
                        <p className="text-xs text-[#343A40]/80 dark:text-white/70">
                            Total distinct titles meeting recency criteria: <strong className="text-[#701F35] dark:text-[#ffd7ba]">{grandTotals.d5}</strong> titles &le; 5 years, <strong className="text-[#343A40] dark:text-white">{grandTotals.d10}</strong> titles &le; 10 years, and <strong className="text-[#343A40] dark:text-white">{grandTotals.d20}</strong> titles &le; 20 years.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
