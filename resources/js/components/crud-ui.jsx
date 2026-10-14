import { X } from 'lucide-react';
import React, { useEffect } from 'react';

// Shared monochrome styles that follow the app's theme tokens (light and dark).
export const inputCls =
    'rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-50';

export const btnPrimary =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-bold tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60';

export const btnSecondary =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-muted px-5 py-3 text-xs font-bold tracking-wide text-foreground transition hover:bg-accent';

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
            <div className={`w-full ${size} rounded-xl border border-border bg-card text-card-foreground shadow-xl`}>
                {children}
            </div>
        </div>
    );
}

export function ModalHeader({ title, onClose }) {
    return (
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button type="button" onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
            </button>
        </div>
    );
}

export function Field({ label, required, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}