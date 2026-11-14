import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Book,
    TrendingUp,
    Users,
    ArrowRight,
    Menu,
    X,
    CheckCircle2,
    CalendarCheck,
    FileSpreadsheet,
    ShieldCheck,
    SearchCheck,
    Layers,
    GraduationCap,
    Sun,
    Moon,
} from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export default function Main() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const toggleTheme = () => updateAppearance(isDark ? 'light' : 'dark');

    return (
        <div
            className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 selection:bg-[#701F35] selection:text-white ${
                isDark
                    ? 'bg-gradient-to-br from-[#2D0B15] to-[#14040A] text-[#F5E9ED]'
                    : 'bg-[#F4F5F7] text-[#343A40]'
            }`}
        >
            <Head title="LibColla • Library Collection Assessment System" />

            {/* Exact Styles from zip file (css/main.css & inc/public_top.php) */}
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
                .glass {
                    background: rgba(255, 255, 255, 0.06);
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
                .nav-link:hover::after {
                    width: 100%;
                }
                .glow {
                    text-shadow: 0 0 40px rgba(200, 16, 46, 0.6);
                }
                .book-icon {
                    transition: transform 0.6s ease;
                }
                .hero-card:hover .book-icon {
                    transform: rotate(12deg) scale(1.1);
                }
            `}</style>

            {/* Official USeP Navbar (Matches inc/public_top.php) */}
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
                        <Link href="/benefits" className="nav-link text-white/90 hover:text-white">
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
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
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

            {/* Hero Section (Matches 1lib/main.php with dynamic Light & Night Mode) */}
            <section
                className={`flex-1 flex items-center pt-16 pb-20 md:pt-24 md:pb-28 relative overflow-hidden transition-colors duration-300 ${
                    isDark
                        ? 'bg-gradient-to-br from-[#701F35] via-[#4D1425] to-[#2D0B15] text-[#F5E9ED]'
                        : 'bg-gradient-to-b from-[#FFFFFF] via-[#F4F5F7] to-[#F5E9ED] text-[#343A40]'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 grid md:grid-cols-2 gap-12 items-center w-full">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <h1
                            className={`text-5xl sm:text-6xl md:text-7xl font-bold leading-none tracking-tighter font-['Playfair_Display',Georgia,serif] transition-colors duration-300 ${
                                isDark ? 'text-white glow' : 'text-[#701F35]'
                            }`}
                        >
                            LibColla:<br />
                            <span className={isDark ? 'text-[#ffd7ba]' : 'text-[#343A40]'}>
                                Library Collection
                            </span><br />
                            Assessment System
                        </h1>

                        <p
                            className={`text-xl md:text-2xl max-w-lg leading-relaxed transition-colors duration-300 ${
                                isDark ? 'text-[#ffd7ba]' : 'text-[#555E68]'
                            }`}
                        >
                            Assess, track, and optimize your library resources against approved
                            prospectuses and course subjects. Generate accurate, data-driven
                            collection assessment reports for institutional decision-making and
                            compliance.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={user ? '/dashboard' : '/login'}
                                className="maroon-btn text-white px-10 py-5 rounded-3xl text-lg font-semibold flex items-center gap-3 shadow-xl"
                            >
                                <span>{user ? 'Open Dashboard' : 'Get Started'}</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Visual (Matches 1lib/main.php with Light & Dark card styling) */}
                    <div className="relative hero-card">
                        <div
                            className={`rounded-3xl p-4 sm:p-5 shadow-2xl transition-all duration-300 ${
                                isDark
                                    ? 'glass'
                                    : 'bg-white/80 backdrop-blur-xl border border-[#E2E5E9]'
                            }`}
                        >
                            <div
                                className={`rounded-3xl overflow-hidden border transition-colors duration-300 ${
                                    isDark
                                        ? 'bg-[#4D1425] border-white/10'
                                        : 'bg-[#F5E9ED] border-[#E2E5E9]'
                                }`}
                            >
                                {/* Window Control Header Bar */}
                                <div
                                    className={`px-6 py-3.5 flex items-center justify-between border-b transition-colors duration-300 ${
                                        isDark
                                            ? 'bg-[#340c18] border-white/5 text-white/60'
                                            : 'bg-[#EAE0E4] border-[#E2E5E9] text-[#701F35]'
                                    }`}
                                >
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    </div>
                                    <div className="text-xs font-bold tracking-wider uppercase">
                                        Collection Control
                                    </div>
                                    <div className="w-8" />
                                </div>

                                {/* Body Icons & Titles */}
                                <div className="p-8 sm:p-12 text-center">
                                    <div className="flex justify-center items-center gap-10 text-6xl sm:text-7xl mb-8">
                                        <Book
                                            className={`w-16 h-16 sm:w-20 sm:h-20 book-icon transition-colors ${
                                                isDark ? 'text-[#ffd7ba]' : 'text-[#701F35]'
                                            }`}
                                        />
                                        <TrendingUp
                                            className={`w-16 h-16 sm:w-20 sm:h-20 transition-colors ${
                                                isDark ? 'text-[#f0c541]' : 'text-[#e11d48]'
                                            }`}
                                        />
                                        <Users
                                            className={`w-16 h-16 sm:w-20 sm:h-20 transition-colors ${
                                                isDark ? 'text-[#ffd7ba]' : 'text-[#701F35]'
                                            }`}
                                        />
                                    </div>
                                    <h3
                                        className={`text-2xl sm:text-3xl font-bold mb-3 transition-colors ${
                                            isDark ? 'text-white' : 'text-[#343A40]'
                                        }`}
                                    >
                                        Complete Collection Control
                                    </h3>
                                    <p
                                        className={`text-lg font-medium tracking-wide transition-colors ${
                                            isDark ? 'text-[#ffd7ba]' : 'text-[#701F35]'
                                        }`}
                                    >
                                        Assess • Track • Optimize • Report
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Official USeP Footer (Matches inc/public_bottom.php) */}
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
