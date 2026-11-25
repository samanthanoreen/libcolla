import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';

export function ReportDownloadMenu({
    onDownloadPdf,
    onDownloadExcel,
    direction = 'down',
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#4B5563] shadow-sm transition hover:bg-[#F8F8F8] cursor-pointer dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
                <Download className="size-4 text-[#4B5563] dark:text-white/60" />
                <span>Download</span>
                <ChevronDown
                    className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    className={`absolute right-0 z-30 w-44 rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-[#1e1e1e] ${
                        direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDownloadPdf();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#4B5563] transition hover:bg-[#F9EDEF] hover:text-[#A04040] cursor-pointer dark:text-white dark:hover:bg-white/10"
                    >
                        <FileText className="size-4 text-[#A04040] dark:text-[#E9A12B]" />
                        <span>PDF (.pdf)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDownloadExcel();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#4B5563] transition hover:bg-[#F9EDEF] hover:text-[#21865A] cursor-pointer dark:text-white dark:hover:bg-white/10"
                    >
                        <FileSpreadsheet className="size-4 text-[#21865A] dark:text-[#38a169]" />
                        <span>Excel (.xlsx)</span>
                    </button>
                </div>
            )}
        </div>
    );
}
