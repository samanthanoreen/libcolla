import { X } from 'lucide-react';
import { useEffect } from 'react';

// Shared monochrome styles that follow the app's theme tokens (light and dark).
export const inputCls =
    'rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#4B5563] outline-none placeholder:text-[#6B7280] focus:border-[#A04040] focus:ring-2 focus:ring-[#A04040]/10 disabled:opacity-50 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-[#E9A12B]';

export const btnPrimary =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D66C6C] to-[#A04040] px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60';

export const btnSecondary =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-[#F3F4F6] px-5 py-3 text-xs font-bold tracking-wide text-[#4B5563] transition hover:bg-[#E5E7EB] dark:bg-white/10 dark:text-white dark:hover:bg-white/20';

export const btnDanger =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-destructive/90 disabled:cursor-wait disabled:opacity-60';

export function Modal({ open, onClose, children, size = 'max-w-lg' }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className={`w-full ${size} border-[#E5E5E5] bg-white text-[#4B5563] dark:border-white/10 dark:bg-[#161616] dark:text-white rounded-xl border shadow-xl`}
            >
                {children}
            </div>
        </div>
    );
}

export function ModalHeader({ title, onClose }) {
    return (
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:bg-muted rounded-md p-1"
            >
                <X className="size-5" />
            </button>
        </div>
    );
}

export function Field({ label, required, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                {label}{' '}
                {required && <span className="text-destructive">*</span>}
            </label>
            {children}
            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}