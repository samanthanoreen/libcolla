import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Zap,
    Database,
    Gauge,
    FileSpreadsheet,
    Lock,
    MessageSquare,
    FolderOpen,
    ArrowLeft,
    ArrowRight,
    Menu,
    X,
    Sun,
    Moon,
    GraduationCap,
} from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export default function Benefits() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const toggleTheme = () => updateAppearance(isDark ? 'light' : 'dark');

    // Exact 7 Benefits from 1lib/benefits.php
    const benefitsList = [
        {
            icon: Zap,
            title: 'Improved Efficiency',
            desc: 'Reduces the time and manual effort needed to cross-check library holdings against academic program requirements.',
        },
        {
            icon: Database,
            title: 'Centralized Data Management',
            desc: 'Keeps programs, subjects, books, and reports in one system instead of scattered spreadsheets or paper records.',
        },
        {
            icon: Gauge,
            title: 'Faster, Clearer Reporting',
            desc: 'Generates recency-based collection summaries in seconds, supporting quicker decision-making for accreditation and curriculum review.',
        },
        {
            icon: FileSpreadsheet,
            title: 'Organized Record-Keeping',
            desc: 'Structured tables and consistent data entry reduce duplication and inconsistency in library records.',
        },
        {
            icon: Lock,
            title: 'Controlled Access',
            desc: 'Role-based accounts (Administrator, Librarian, Staff) help ensure that only authorized users can add, edit, or manage sensitive records.',
        },
        {
            icon: MessageSquare,
            title: 'Better Communication',
            desc: 'The built-in contact/messaging feature keeps concerns and feedback documented and easy to follow up on, instead of relying on informal channels.',
        },
        {
            icon: FolderOpen,
            title: 'Accessibility and Organization',
            desc: 'Makes it easier for library staff to retrieve, update, and review academic and collection data whenever needed.',
            centerCard: true,
        },
    ];

    return (
        <div
            className={`min-h-screen font-sans flex flex-col transition-colors duration-300 selection:bg-[#701F35] selection:text-white ${
                isDark
                    ? 'bg-gradient-to-br from-[#2D0B15] to-[#14040A] text-[#F5E9ED]'
                    : 'bg-[#F4F5F7] text-[#343A40]'
            }`}
        >
            <Head title="Benefits • LibColla" />

            {/* Custom Styles matching 1lib */}
            <style>{`
                .site-navbar {
                    background: #701F35 !important;
                }
                .site-footer {
                    background: #701F35 !important;
                }
                .uni-title {
                    font-family: 'Cinzel', 'Playfair Display', Georgia, serif !important;
                    font-weight: 700 !important;
                    font-size: 1.5rem !important;
                    letter-spacing: 0.015em !important;
                    color: #ffffff !important;
                    line-height: 1.25 !important;
                }
                .uni-tagline {
                    font-family: 'Cormorant Garamond', Georgia, serif !important;
                    font-style: italic !important;
                    font-weight: 600 !important;
                    font-size: 1.05rem !important;
                    letter-spacing: 0.02em !important;
                    color: #ffd7ba !important;
                    margin-top: 2px !important;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .maroon-btn {
                    background: #701F35;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
                }
                .maroon-btn:hover {
                    background: #4D1425;
                    box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.35);
                    transform: translateY(-2px);
                }
                .nav-link {
                    position: relative;
                    transition: all 0.3s ease;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background-color: #d4a017;
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after, .nav-link.active::after {
                    width: 100%;
                }
            `}</style>

            {/* Official USeP Navbar */}
            <nav className="site-navbar sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
                    {/* Institutional Header Brand */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <img
                            src="/images/usep-logo.png"
                            alt="University of Southeastern Philippines"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain shrink-0 shadow-md group-hover:scale-105 transition-transform"
                        />
                        <div className="leading-tight">
                            <div className="uni-title text-lg sm:text-2xl">
                                University of Southeastern Philippines
                            </div>
                            <div className="uni-tagline">
                                We Build Dreams Without Limits
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase tracking-wider">
                        <Link href="/features" className="nav-link text-white/90 hover:text-white">
                            Features
                        </Link>
                        <Link href="/how-it-works" className="nav-link text-white/90 hover:text-white">
                            How It Works
                        </Link>
                        <Link href="/benefits" className="nav-link active text-white">
                            Benefits
                        </Link>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                            className="flex size-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                        >
                            {isDark ? (
                                <Sun className="size-5 text-[#f0c541]" />
                            ) : (
                                <Moon className="size-5 text-white" />
                            )}
                        </button>
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="nav-link text-[#ffd7ba] hover:text-white flex items-center gap-1.5"
                            >
                                <span>Dashboard</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="maroon-btn text-white px-6 py-2.5 rounded-2xl text-xs font-bold tracking-wider shadow-md flex items-center gap-2"
                            >
                                <span>Sign In</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Actions & Toggle Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                            className="w-10 h-10 flex items-center justify-center text-white rounded-xl bg-white/10"
                        >
                            {isDark ? <Sun className="size-5 text-[#f0c541]" /> : <Moon className="size-5 text-white" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="w-11 h-11 flex items-center justify-center text-white text-xl rounded-xl hover:bg-white/10 transition-colors"
                            aria-label="Toggle Navigation"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                {mobileMenuOpen && (
                    <div className="md:hidden flex flex-col gap-1 px-8 pb-6 text-sm font-semibold uppercase tracking-wider bg-[#7a0f20] border-t border-white/10">
                        <Link
                            href="/features"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
                        >
                            Features
                        </Link>
                        <Link
                            href="/how-it-works"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="/benefits"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 text-white border-b border-white/10 font-bold"
                        >
                            Benefits
                        </Link>
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="block py-3 text-[#ffd7ba] font-bold"
                            >
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="block py-3 text-[#ffd7ba] font-bold"
                            >
                                Sign In →
                            </Link>
                        )}
                    </div>
                )}
            </nav>

            {/* Standalone Benefits Section (Matches 1lib/benefits.php) */}
            <main className="flex-1 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    {/* Back to Main Page Arrow Only */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            title="Back to Main Page"
                            aria-label="Back to Main Page"
                            className={`inline-flex items-center justify-center size-11 rounded-2xl transition-all duration-200 group shadow-sm ${
                                isDark
                                    ? 'bg-white/10 hover:bg-white/20 text-[#f0c541] hover:text-white border border-white/10'
                                    : 'bg-white hover:bg-[#F4F5F7] text-[#701F35] hover:text-[#4D1425] border border-[#E2E5E9]'
                            }`}
                        >
                            <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
                        </Link>
                    </div>

                    {/* Header: Title and Subtitle from 1lib/benefits.php */}
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#d4a017]/20 border border-[#d4a017]/40 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#d4a017] dark:text-[#ffd7ba] uppercase">
                            <GraduationCap className="w-3.5 h-3.5 text-[#d4a017]" />
                            <span>Institutional Value</span>
                        </div>
                        <h1
                            className={`text-4xl sm:text-5xl font-bold tracking-tight font-['Playfair_Display',Georgia,serif] ${
                                isDark ? 'text-white' : 'text-[#343A40]'
                            }`}
                        >
                            Benefits
                        </h1>
                        <p
                            className={`text-base sm:text-lg leading-relaxed ${
                                isDark ? 'text-[#ffd7ba]/95' : 'text-[#6B7280]'
                            }`}
                        >
                            Empowering library staff and administrators with automated, verifiable assessment tools.
                        </p>
                    </div>

                    {/* 7 Benefits Cards Grid (Matches 1lib/benefits.php 3-column layout) */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefitsList.map((benefit, idx) => {
                            const IconComponent = benefit.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 ${
                                        benefit.centerCard ? 'lg:col-start-2' : ''
                                    } ${
                                        isDark
                                            ? 'glass-card hover:border-[#d4a017]/60 hover:shadow-xl'
                                            : 'bg-white border border-[#E2E5E9] shadow-sm hover:border-[#701F35]/40 hover:shadow-lg'
                                    }`}
                                >
                                    {/* Icon Badge */}
                                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#701F35] to-[#4D1425] border border-[#d4a017]/40 flex items-center justify-center text-[#ffd7ba] mb-5 shadow-md shadow-rose-950/30">
                                        <IconComponent className="w-6 h-6 text-[#ffd7ba]" />
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className={`text-xl font-bold mb-2.5 ${
                                            isDark ? 'text-white' : 'text-[#343A40]'
                                        }`}
                                    >
                                        {benefit.title}
                                    </h3>

                                    {/* Description */}
                                    <p
                                        className={`text-sm leading-relaxed text-justify ${
                                            isDark ? 'text-[#F5E9ED]/80' : 'text-[#6B7280]'
                                        }`}
                                    >
                                        {benefit.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Action Card */}
                    <div className="mt-16 text-center">
                        <Link
                            href={user ? '/dashboard' : '/login'}
                            className="inline-flex items-center gap-3 maroon-btn text-white px-9 py-4 rounded-2xl text-base font-semibold shadow-xl cursor-pointer"
                        >
                            <span>{user ? 'Return to Dashboard' : 'Get Started with LibColla'}</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </main>

            {/* Official USeP Footer */}
            <footer className="site-footer">
                <div className="max-w-7xl mx-auto px-8 py-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/usep-logo.png"
                            alt="University of Southeastern Philippines"
                            className="w-11 h-11 rounded-full object-contain"
                        />
                        <p className="text-white/85 text-sm">
                            &copy; 2026 University of Southeastern Philippines. All Rights Reserved.
                        </p>
                    </div>
                    <p className="text-white/60 text-xs uppercase tracking-wider font-medium">
                        Library Collection Assessment System
                    </p>
                </div>
            </footer>
        </div>
    );
}
