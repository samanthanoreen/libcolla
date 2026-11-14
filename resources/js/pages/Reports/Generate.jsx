import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import {
    FileText,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    RotateCcw,
    GraduationCap,
} from 'lucide-react';
import { serif } from '@/lib/libcollaTheme';

export default function Generate({ programs, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [searchBy, setSearchBy] = useState(filters?.search_by || 'college');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/reports/generate',
            { search: search.trim(), search_by: searchBy },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setSearchBy('college');
        router.get('/reports/generate', {}, { replace: true });
    };

    const programList = programs?.data || [];

    return (
        <div className="w-full space-y-6">
            <Head title="Generate Report • LibColla" />

            {/* Page Header Card */}
            <div className="rounded-2xl border border-[#E2E5E9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FileText className="size-6 text-[#701F35] dark:text-[#d4a017]" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#343A40] dark:text-white" style={serif}>
                                Generate Report
                            </h1>
                            <p className="text-xs sm:text-sm text-[#9299A5] dark:text-white/60">
                                Select an academic program to preview and generate an accreditation-standard collection report.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar Section */}
                <form
                    onSubmit={handleSearch}
                    className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-[#E2E5E9] bg-[#F4F5F7] p-4 sm:grid-cols-12 sm:items-end dark:border-white/10 dark:bg-white/[0.03]"
                >
                    <div className="sm:col-span-6">
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#343A40] dark:text-white/80">
                            Search Value
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="e.g. CIC, Information Technology, Computer Science..."
                            className="w-full rounded-lg border border-[#E2E5E9] bg-white px-3 py-2.5 text-sm text-[#343A40] outline-none transition focus:border-[#701F35] focus:ring-2 focus:ring-[#701F35]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#d4a017]"
                        />
                    </div>

                    <div className="sm:col-span-4">
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#343A40] dark:text-white/80">
                            Search By
                        </label>
                        <select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            className="w-full rounded-lg border border-[#E2E5E9] bg-white px-3 py-2.5 text-sm text-[#343A40] outline-none transition focus:border-[#701F35] focus:ring-2 focus:ring-[#701F35]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#d4a017]"
                        >
                            <option value="college">College</option>
                            <option value="program">Program Name</option>
                            <option value="course">Course Subject</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2">
                        <button
                            type="submit"
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#701F35] py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4D1425] focus:outline-none cursor-pointer"
                        >
                            <Search className="size-4" />
                            <span>Search</span>
                        </button>
                        {(search !== '' || searchBy !== 'college') && (
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

            {/* Programs Table Card */}
            <div className="rounded-2xl border border-[#E2E5E9] bg-white shadow-sm overflow-hidden dark:border-white/10 dark:bg-white/[0.06]">
                <div className="border-b border-[#E2E5E9] bg-[#F4F5F7] px-6 py-4 flex items-center justify-between dark:border-white/10 dark:bg-white/[0.04]">
                    <h2 className="text-sm font-bold tracking-wider uppercase text-[#343A40] flex items-center gap-2 dark:text-white">
                        <GraduationCap className="size-4 text-[#701F35] dark:text-[#d4a017]" />
                        Academic Programs ({programs?.total ?? programList.length})
                    </h2>
                    <span className="text-xs text-[#9299A5] dark:text-white/60">
                        Click on any program row to preview assessment
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-[#F4F5F7]/60 text-xs font-bold uppercase tracking-wider text-[#9299A5] border-b border-[#E2E5E9] dark:bg-white/[0.02] dark:border-white/10 dark:text-white/60">
                            <tr>
                                <th className="px-6 py-3.5">College</th>
                                <th className="px-6 py-3.5">Program Name</th>
                                <th className="px-6 py-3.5">Major</th>
                                <th className="px-6 py-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E5E9] dark:divide-white/10">
                            {programList.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-[#9299A5] dark:text-white/60">
                                        <GraduationCap className="mx-auto size-12 opacity-30 mb-2" />
                                        <p className="font-medium">No programs found.</p>
                                        <p className="text-xs mt-1">Try adjusting your search criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                programList.map((prog) => (
                                    <tr
                                        key={prog.id}
                                        onClick={() => router.visit(`/reports/preview/${prog.id}`)}
                                        className="group cursor-pointer transition hover:bg-[#F5E9ED]/50 dark:hover:bg-white/[0.06]"
                                    >
                                        <td className="px-6 py-4 font-medium text-[#701F35] dark:text-[#ffd7ba]">
                                            {prog.college}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#343A40] group-hover:text-[#701F35] transition dark:text-white dark:group-hover:text-[#ffd7ba]">
                                            {prog.program_name}
                                        </td>
                                        <td className="px-6 py-4 text-[#9299A5] dark:text-white/60">
                                            {prog.major || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5E9ED] px-3 py-1.5 text-xs font-semibold text-[#701F35] group-hover:bg-[#701F35] group-hover:text-white transition dark:bg-white/10 dark:text-white dark:group-hover:bg-[#d4a017] dark:group-hover:text-black">
                                                <span>Preview</span>
                                                <ArrowRight className="size-3.5" />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {programs?.links && programs.links.length > 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2E5E9] px-6 py-4 text-sm text-[#9299A5] dark:border-white/10 dark:text-white/60">
                        <div>
                            Showing {programs.from || 0} to {programs.to || 0} of {programs.total} programs
                        </div>
                        <div className="flex items-center gap-1">
                            {programs.links.map((link, i) => {
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
        </div>
    );
}
