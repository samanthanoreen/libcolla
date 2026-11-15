import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Menu, X } from 'lucide-react';

const MAROON = '#8F1428';

const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/benefits', label: 'Benefits' },
];

// Same box for every nav item so text sits on one baseline.
const navItem =
    'relative inline-flex items-center h-12 text-sm md:text-base font-semibold uppercase tracking-wider text-white after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-full after:bg-[#E9A12B] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200';

export function PublicHeader() {
    const page = usePage();
    const currentUrl = page.url;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full text-white" style={{ backgroundColor: MAROON }}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    head-key="outfit-font"
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
                />
            </Head>
            <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 h-24 md:h-28 flex items-center justify-between gap-6">
                {/* Left: logo + branding */}
                <Link href="/" className="flex items-center gap-3 min-w-0">
                    <img
                        src="/images/usep-logo.png"
                        alt="University of Southeastern Philippines"
                        className="w-14 h-14 md:w-20 md:h-20 rounded-full object-contain shrink-0"
                    />
                    <div className="min-w-0 leading-tight">
                        <div className="font-['Cinzel',Georgia,serif] font-bold text-sm sm:text-xl md:text-2xl tracking-wide text-white truncate">
                            University of Southeastern Philippines
                        </div>
                        <div className="font-['Cormorant_Garamond',Georgia,serif] italic font-semibold text-base md:text-xl text-white/90">
                            We Build Dreams Without Limits
                        </div>
                    </div>
                </Link>

                {/* Right: navigation */}
                <nav className="hidden md:flex items-center gap-8 xl:gap-0 xl:justify-between xl:w-[560px] shrink-0">
                    {navLinks.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`${navItem} ${
                                currentUrl.startsWith(l.href) ? 'after:scale-x-100' : ''
                            }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <Link
                        href="/dashboard"
                        className={`${navItem} ${
                            currentUrl.startsWith('/dashboard') ? 'after:scale-x-100' : ''
                        }`}
                    >
                        Dashboard
                    </Link>
                </nav>

                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden w-10 h-10 shrink-0 flex items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors"
                    aria-label="Toggle Navigation"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="md:hidden border-t border-white/15" style={{ backgroundColor: MAROON }}>
                    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 pb-3 flex flex-col text-base font-semibold">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-3 text-white border-b border-white/15"
                            >
                                {l.label}
                            </Link>
                        ))}
                        <Link
                            href="/dashboard"
                            onClick={() => setMobileOpen(false)}
                            className="py-3 text-white font-semibold"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

export function PublicFooter() {
    return (
        <footer className="w-full text-white" style={{ backgroundColor: MAROON }}>
            <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 py-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-white text-sm font-medium">
                    &copy; 2026 University of Southeastern Philippines. All Rights Reserved.
                </p>
                <p className="text-white text-xs font-semibold uppercase tracking-wider">
                    Library Collection Assessment System
                </p>
            </div>
        </footer>
    );
}

type Props = {
    title: string;
    children: React.ReactNode;
};

export default function PublicLayout({ title, children }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-black font-['Quicksand',system-ui,sans-serif] selection:bg-[#8F1428] selection:text-white">
            <Head title={`${title} • LibColla`} />
            <PublicHeader />

            <main
                className="flex-1 py-10 sm:py-12 bg-cover bg-no-repeat"
                style={{
                    backgroundColor: '#FFFFFF',
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.62), rgba(255,255,255,0.62)), url(/images/usep-eagle.jpg)',
                    backgroundPosition: 'right center',
                }}
            >
                <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12">
                    <Link
                        href="/"
                        title="Back to Main Page"
                        aria-label="Back to Main Page"
                        className="inline-flex items-center justify-center size-12 mb-8 rounded-xl border border-white/70 bg-white/85 backdrop-blur-sm shadow-md text-[#8F1428] hover:bg-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    {children}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}

export function PageHeading({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-center text-5xl md:text-6xl 2xl:text-7xl font-bold tracking-tight text-black mb-10 sm:mb-12">
            {children}
        </h1>
    );
}

type InfoCardProps = {
    icon?: React.ComponentType<{ className?: string }>;
    num?: number;
    title: string;
    desc: string;
    className?: string;
};

export function InfoCard({ icon: Icon, num, title, desc, className = '' }: InfoCardProps) {
    return (
        <div className={`h-full p-8 rounded-2xl bg-white/85 backdrop-blur-sm border border-white/70 shadow-lg ${className}`}>
            {Icon && (
                <div className="size-14 mb-5 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center text-[#8F1428]">
                    <Icon className="w-7 h-7" />
                </div>
            )}
            {num !== undefined && (
                <div className="size-14 mb-5 rounded-xl bg-[#8F1428] flex items-center justify-center text-white text-xl font-semibold">
                    {num}
                </div>
            )}
            <h3 className="text-2xl font-bold text-black mb-2">{title}</h3>
            <p className="text-lg font-medium leading-snug text-black">{desc}</p>
        </div>
    );
}