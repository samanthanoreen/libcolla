import { X } from "lucide-react";
import { useEffect } from "react";

// Shared monochrome styles that follow the app's theme tokens (light and dark).
export const inputCls =
	"rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-50";

export const btnPrimary =
	"inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-bold tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60";

export const btnSecondary =
	"inline-flex items-center justify-center gap-2 rounded-lg bg-muted px-5 py-3 text-xs font-bold tracking-wide text-foreground transition hover:bg-accent";

export const btnDanger =
	"inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-destructive/90 disabled:cursor-wait disabled:opacity-60";

export function Modal({ open, onClose, children, size = "max-w-lg" }) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onMouseDown={(e) => e.target === e.currentTarget && onClose()}
		>
			<div
				className={`w-full ${size} border-border bg-card text-card-foreground rounded-xl border shadow-xl`}
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
				{label} {required && <span className="text-destructive">*</span>}
			</label>
			{children}
			{error && <p className="text-destructive text-xs">{error}</p>}
		</div>
	);
}
