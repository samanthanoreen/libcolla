import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import {
    FolderOpen,
    Search,
    Eye,
    Download,
    Trash2,
    Plus,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Calendar,
    GraduationCap,
    AlertCircle,
} from 'lucide-react';
import { serif } from '@/lib/libcollaTheme';

export default function Manage({ reports, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        reportId: null,
        reportTitle: '',
    });
    const [deleting, setDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/reports/manage',
            { search: search.trim() },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        router.get('/reports/manage', {}, { replace: true });
    };

    const confirmDelete = (report) => {
        setDeleteModal({
            isOpen: true,
            reportId: report.id,
            reportTitle: `${report.program_name} (${report.college})`,
        });
    };

    const handleDelete = () => {
        if (!deleteModal.reportId) return;
        setDeleting(true);
        router.delete(`/reports/${deleteModal.reportId}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteModal({ isOpen: false, reportId: null, reportTitle: '' });
            },
        });
    };

    const handleDownload = (report) => {
        // Fetch or build text report
        router.get(`/reports/${report.id}`, {}, {
            preserveState: true,
            onSuccess: (page) => {
                const rep = page.props?.report;
                if (!rep) return;

                let content = `COLLECTION ASSESSMENT REPORT\n=======================================================\n\n`;
                content += `Institution : University of Southeastern Philippines\n`;
                content += `Program     : ${rep.program_name}\n`;
                content += `College     : ${rep.college}\n`;
                content += `Major       : ${rep.major || 'N/A'}\n`;
                content += `Generated   : ${rep.created_at || new Date().toLocaleString()}\n\n`;

                content += `-------------------------------------------------------\n`;
                content += `1. SUMMARY TABLE\n`;
                content += `-------------------------------------------------------\n`;
                content += `Classification | Course Subject | Total T | Total V | <=5 Yrs | <=10 Yrs | <=20 Yrs\n`;

                const summary = rep.summary || [];
                summary.forEach((r) => {
                    content += `${r.classification || 'Core'} | ${r.courseName} | ${r.totalT} | ${r.totalV} | ${r.distinct5yr} | ${r.distinct10yr} | ${r.distinct20yr}\n`;
                });

                content += `\n-------------------------------------------------------\n`;
                content += `2. LIST OF REFERENCES (BOOKS)\n`;
                content += `-------------------------------------------------------\n`;

                const references = rep.references || [];
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
                link.href = url;
                link.download = `Report_${(rep.program_name || 'Report').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                link.click();
                URL.revokeObjectURL(url);
            },
        });
    };

    const reportList = reports?.data || [];

    return (
        <div className="w-full space-y-6">
            <Head title="Manage Reports • LibColla" />

            {/* Header Card */}
            <div className="rounded-2xl border border-[#E2E5E9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FolderOpen className="size-6 text-[#701F35] dark:text-[#d4a017]" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#343A40] dark:text-white" style={serif}>
                                Manage Reports
                            </h1>
                            <p className="text-xs sm:text-sm text-[#9299A5] dark:text-white/60">
                                View, download text summaries, or manage saved collection assessment records.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/reports/generate"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#701F35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4D1425] cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Generate New Report</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="mt-6 flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-[#E2E5E9] bg-[#F4F5F7] p-3 dark:border-white/10 dark:bg-white/[0.03]"
                >
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9299A5] dark:text-white/50" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by college, program name, or major..."
                            className="w-full rounded-lg border border-[#E2E5E9] bg-white pl-10 pr-4 py-2.5 text-sm text-[#343A40] outline-none transition focus:border-[#701F35] focus:ring-2 focus:ring-[#701F35]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#d4a017]"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="submit"
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-lg bg-[#701F35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4D1425] cursor-pointer"
                        >
                            <span>Filter</span>
                        </button>
                        {search !== '' && (
                            <button
                                type="button"
                                onClick={handleReset}
                                title="Reset filter"
                                className="inline-flex items-center justify-center rounded-lg border border-[#E2E5E9] bg-white p-2.5 text-[#9299A5] transition hover:bg-gray-100 hover:text-[#343A40] cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                            >
                                <RotateCcw className="size-4" />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Reports List Card */}
            <div className="rounded-2xl border border-[#E2E5E9] bg-white shadow-sm overflow-hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="border-b border-[#E2E5E9] bg-[#F4F5F7] px-6 py-4 flex items-center justify-between dark:border-white/10 dark:bg-white/[0.04]">
                    <h2 className="text-sm font-bold tracking-wider uppercase text-[#343A40] flex items-center gap-2 dark:text-white">
                        <FolderOpen className="size-4 text-[#701F35] dark:text-[#d4a017]" />
                        Saved Reports ({reports?.total ?? reportList.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-[#F4F5F7]/60 text-xs font-bold uppercase tracking-wider text-[#9299A5] border-b border-[#E2E5E9] dark:bg-white/[0.02] dark:border-white/10 dark:text-white/60">
                            <tr>
                                <th className="px-6 py-3.5">College</th>
                                <th className="px-6 py-3.5">Program Name</th>
                                <th className="px-6 py-3.5">Major</th>
                                <th className="px-6 py-3.5">Date Generated</th>
                                <th className="px-6 py-3.5 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E2E5E9] dark:divide-white/10">
                            {reportList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-[#9299A5] dark:text-white/60">
                                        <FolderOpen className="mx-auto size-14 opacity-25 mb-3" />
                                        <p className="text-base font-semibold text-[#343A40] dark:text-white">No reports generated yet.</p>
                                        <p className="text-xs mt-1 text-[#9299A5] dark:text-white/60">
                                            Generate an assessment report from your academic programs to see it listed here.
                                        </p>
                                        <Link
                                            href="/reports/generate"
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#701F35] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4D1425]"
                                        >
                                            <Plus className="size-3.5" />
                                            <span>Generate Report</span>
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                reportList.map((r) => (
                                    <tr key={r.id} className="hover:bg-[#F5E9ED]/30 transition group dark:hover:bg-white/[0.06]">
                                        <td className="px-6 py-4 font-medium text-[#701F35] dark:text-[#ffd7ba]">
                                            {r.college}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#343A40] group-hover:text-[#701F35] transition dark:text-white dark:group-hover:text-[#ffd7ba]">
                                            {r.program_name}
                                        </td>
                                        <td className="px-6 py-4 text-[#9299A5] dark:text-white/60">
                                            {r.major || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[#9299A5] dark:text-white/60">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-[#9299A5] dark:text-white/50" />
                                                <span>
                                                    {r.created_at
                                                        ? new Date(r.created_at).toLocaleDateString(undefined, {
                                                              year: 'numeric',
                                                              month: 'short',
                                                              day: 'numeric',
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                          })
                                                        : '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/reports/${r.id}`}
                                                    title="View Report Details"
                                                    className="inline-flex size-8 items-center justify-center rounded-lg bg-[#3478B9]/10 text-[#3478B9] hover:bg-[#3478B9] hover:text-white transition"
                                                >
                                                    <Eye className="size-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDownload(r)}
                                                    title="Download Text File"
                                                    className="inline-flex size-8 items-center justify-center rounded-lg bg-gray-100 text-[#343A40] hover:bg-gray-200 transition cursor-pointer dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                                >
                                                    <Download className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => confirmDelete(r)}
                                                    title="Delete Report"
                                                    className="inline-flex size-8 items-center justify-center rounded-lg bg-[#C44545]/10 text-[#C44545] hover:bg-[#C44545] hover:text-white transition cursor-pointer"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {reports?.links && reports.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2E5E9] px-6 py-4 text-sm text-[#9299A5] dark:border-white/10 dark:text-white/60">
                        <div>
                            Showing {reports.from || 0} to {reports.to || 0} of {reports.total} reports
                        </div>
                        <div className="flex items-center gap-1">
                            {reports.links.map((link, i) => {
                                const isPrev = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');
                                return (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`flex size-9 items-center justify-center rounded-lg text-xs font-semibold transition ${
                                            link.active
                                                ? 'bg-[#701F35] text-white shadow-sm'
                                                : link.url
                                                  ? 'border border-[#E2E5E9] bg-white text-[#343A40] hover:bg-[#F5E9ED] hover:text-[#701F35] dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                                                  : 'cursor-not-allowed text-[#9299A5]/40 opacity-50 dark:text-white/30'
                                        }`}
                                    >
                                        {isPrev ? (
                                            <ChevronLeft className="size-4" />
                                        ) : isNext ? (
                                            <ChevronRight className="size-4" />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E5E9] text-center animate-in zoom-in-95 duration-150 dark:bg-[#280B14] dark:border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#F5E9ED] text-[#C44545] dark:bg-[#C44545]/20">
                            <Trash2 className="size-7" />
                        </div>

                        <h3 className="text-lg font-bold text-[#343A40] mb-2 dark:text-white">
                            Delete Assessment Report?
                        </h3>
                        <p className="text-xs sm:text-sm text-[#9299A5] mb-6 leading-relaxed dark:text-white/60">
                            Are you sure you want to delete the report for <strong className="text-[#343A40] dark:text-white">{deleteModal.reportTitle}</strong>? This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setDeleteModal({ isOpen: false, reportId: null, reportTitle: '' })}
                                className="w-full rounded-xl border border-[#E2E5E9] bg-white py-2.5 text-sm font-semibold text-[#343A40] hover:bg-[#F4F5F7] transition cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className="w-full rounded-xl bg-[#C44545] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#a73535] transition cursor-pointer disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
