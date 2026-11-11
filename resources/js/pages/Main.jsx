import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Book,
    BarChart3,
    TrendingUp,
    Users,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    FileSpreadsheet,
    GraduationCap,
    Sparkles,
    Layers,
    SearchCheck,
    CalendarCheck,
} from 'lucide-react';

export default function Main() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2c0f14] via-[#1a0b0e] to-[#120508] text-[#f5e8e8] font-sans selection:bg-[#c8102e] selection:text-white">
            <Head>
                <title>LibColla • Library Collection Assessment System</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Custom Inline Keyframes and Font Utility */}
            <style>{`
                .logo-font {
                    font-family: 'Playfair Display', Georgia, serif;
                }
                .glow {
                    text-shadow: 0 0 45px rgba(200, 16, 46, 0.65);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .maroon-btn {
                    background: linear-gradient(90deg, #9f1239, #c8102e);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .maroon-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 18px 30px -6px rgba(159, 18, 57, 0.55);
                }
                .nav-link {
                    position: relative;
                    transition: color 0.3s ease;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0%;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background-color: #c8102e;
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after {
                    width: 100%;
                }
                .hero-visual:hover .hover-rotate {
                    transform: rotate(12deg) scale(1.08);
                }
            `}</style>

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-[#1a0b0e]/85 backdrop-blur-xl border-b border-white/10 transition-colors">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4.5 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-gradient-to-br from-[#9f1239] to-[#c8102e] rounded-2xl flex items-center justify-center shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform duration-300">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="logo-font text-3xl font-bold tracking-tight text-white group-hover:text-rose-200 transition-colors">
                            LibColla
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="nav-link text-white/80 hover:text-white">
                            Features
                        </a>
                        <a href="#how-it-works" className="nav-link text-white/80 hover:text-white">
                            How It Works
                        </a>
                        <a href="#benefits" className="nav-link text-white/80 hover:text-white">
                            Benefits
                        </a>
                    </nav>

                    {/* Auth Status Action */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="maroon-btn text-white px-7 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/40"
                            >
                                <span>Go to Dashboard</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="maroon-btn text-white px-7 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/40"
                            >
                                <span>Login</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#c8102e]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-[#9f1239]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 sm:px-8 grid md:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                    {/* Left Column Content */}
                    <div className="space-y-8">
                        {/* Eyebrow Badge */}
                        <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white uppercase shadow-sm">
                            <BarChart3 className="w-4 h-4 text-[#ffd7ba]" />
                            <span>COLLECTION ASSESSMENT</span>
                        </div>

                        {/* Title */}
                        <h1 className="logo-font text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight glow text-white">
                            LibColla<br />
                            <span className="text-[#ffd7ba]">Library Collection</span><br />
                            Assessment System
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-[#ffd7ba]/90 leading-relaxed max-w-xl">
                            Assess, track, and optimize your library resources against approved
                            prospectuses and course subjects. Generate accurate, data-driven
                            collection assessment reports for institutional decision-making and
                            compliance.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="maroon-btn text-white px-9 py-4 rounded-3xl text-base font-semibold flex items-center gap-3 shadow-xl"
                                >
                                    <span>Open Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="maroon-btn text-white px-9 py-4 rounded-3xl text-base font-semibold flex items-center gap-3 shadow-xl"
                                    >
                                        <span>Get Started</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <a
                                        href="#features"
                                        className="px-7 py-4 rounded-3xl text-base font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 bg-white/5 transition-all"
                                    >
                                        Explore Features
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column Visual (Matches Reference Design) */}
                    <div className="relative hero-visual">
                        <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.01]">
                            <div className="bg-[#1a0b0e] rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                                {/* Window Control Bar */}
                                <div className="bg-[#2c0f14] px-6 py-3.5 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm" />
                                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm" />
                                    </div>
                                    <div className="text-white/60 text-xs font-medium tracking-wide">
                                        LibColla Dashboard
                                    </div>
                                    <div className="w-10" />
                                </div>

                                {/* Preview Card Body */}
                                <div className="p-8 sm:p-12 text-center space-y-6">
                                    <div className="flex justify-center items-center gap-10 text-6xl sm:text-7xl text-[#c8102e] py-4">
                                        <Book className="w-16 h-16 sm:w-20 sm:h-20 text-[#c8102e] hover-rotate transition-transform duration-500" />
                                        <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 text-[#e11d48]" />
                                        <Users className="w-16 h-16 sm:w-20 sm:h-20 text-[#9f1239]" />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                                            Complete Collection Control
                                        </h3>
                                        <p className="text-base sm:text-lg text-[#ffd7ba] font-medium tracking-wide">
                                            Assess • Track • Optimize • Report
                                        </p>
                                    </div>

                                    {/* System Status Pill */}
                                    <div className="inline-flex items-center gap-2 bg-[#2c0f14]/80 border border-white/10 px-5 py-2 rounded-full text-xs text-white/70">
                                        <Sparkles className="w-3.5 h-3.5 text-[#ffd7ba]" />
                                        <span>CHED & PACUCOA Alignment Ready</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Floating Accent */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#9f1239] to-[#c8102e] rounded-3xl rotate-12 flex items-center justify-center opacity-75 shadow-2xl shadow-rose-950/70 pointer-events-none hover:rotate-6 transition-transform duration-500">
                            <BookOpen className="w-12 h-12 text-white/90" />
                        </div>

                        {/* Bottom Glow Accent */}
                        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-[#c8102e] to-[#7f1d1d] rounded-2xl -rotate-6 opacity-40 blur-sm pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 border-t border-white/10 relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#9f1239]/20 border border-[#c8102e]/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-rose-300 uppercase">
                            <Layers className="w-3.5 h-3.5" />
                            <span>System Capabilities</span>
                        </div>
                        <h2 className="logo-font text-4xl sm:text-5xl font-bold text-white tracking-tight">
                            Designed Specifically for Institutional Libraries
                        </h2>
                        <p className="text-[#ffd7ba]/80 text-lg leading-relaxed">
                            Replace disconnected spreadsheets with a unified system that connects
                            every title to academic course subjects and accreditation criteria.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="glass-card p-7 rounded-2xl hover:border-[#c8102e]/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9f1239] to-[#c8102e] flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-950/40">
                                <SearchCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2.5">
                                Syllabus Alignment
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Link book accessions directly to academic course codes and
                                prospectus subjects to measure syllabus coverage.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card p-7 rounded-2xl hover:border-[#c8102e]/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9f1239] to-[#c8102e] flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-950/40">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2.5">
                                Copyright Currency
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Easily track 5-year copyright thresholds to ensure collection
                                currency meets strict accreditation criteria.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card p-7 rounded-2xl hover:border-[#c8102e]/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9f1239] to-[#c8102e] flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-950/40">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2.5">
                                One-Click Reporting
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Export official collection assessment reports with title counts,
                                percentage compliance, and gap summaries instantly.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="glass-card p-7 rounded-2xl hover:border-[#c8102e]/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9f1239] to-[#c8102e] flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-950/40">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2.5">
                                Multi-Role Security
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Role-based access for Administrators, Head Librarians, and Library
                                Staff with built-in audit trails and communication.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-black/20 border-t border-white/10 relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#9f1239]/20 border border-[#c8102e]/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-rose-300 uppercase">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Structured Workflow</span>
                        </div>
                        <h2 className="logo-font text-4xl sm:text-5xl font-bold text-white tracking-tight">
                            How LibColla Works
                        </h2>
                        <p className="text-[#ffd7ba]/80 text-lg leading-relaxed">
                            A straightforward three-step assessment cycle that streamlines accreditation preparation.
                        </p>
                    </div>

                    {/* Step Cards */}
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="glass-card p-8 rounded-3xl relative">
                            <div className="text-5xl font-extrabold text-[#c8102e]/30 mb-4 font-mono">
                                01
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Setup Prospectuses
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Configure academic degree programs and course subjects according to
                                the institution's approved curriculum prospectus.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="glass-card p-8 rounded-3xl relative">
                            <div className="text-5xl font-extrabold text-[#c8102e]/30 mb-4 font-mono">
                                02
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Catalog Library Books
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Enter book records with call numbers, copyright years, accession codes,
                                and assign them to corresponding course subjects.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-card p-8 rounded-3xl relative">
                            <div className="text-5xl font-extrabold text-[#c8102e]/30 mb-4 font-mono">
                                03
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Generate Assessment
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Automatically calculate compliance metrics, spot deficit areas, and
                                generate comprehensive reports for institutional decision-making.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-24 border-t border-white/10 relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="glass-card rounded-3xl p-8 sm:p-14 border border-white/10 bg-gradient-to-br from-[#2c0f14]/80 to-[#1a0b0e]/90">
                        <div className="grid lg:grid-cols-3 gap-10 items-center">
                            <div className="lg:col-span-1 space-y-4">
                                <div className="inline-flex items-center gap-2 bg-[#9f1239]/20 border border-[#c8102e]/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-rose-300 uppercase">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    <span>Institutional Impact</span>
                                </div>
                                <h2 className="logo-font text-3xl sm:text-4xl font-bold text-white">
                                    Benefits Built for Academic Excellence
                                </h2>
                                <p className="text-[#ffd7ba]/80 text-sm sm:text-base leading-relaxed">
                                    Empower library administrators and academic deans with actionable
                                    intelligence for collection development and budget justification.
                                </p>
                            </div>

                            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-white font-semibold">
                                        <CheckCircle2 className="w-5 h-5 text-[#c8102e] shrink-0" />
                                        <span>Audit-Ready Records</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/70 pl-7.5">
                                        Instant compliance calculations formatted for CHED, PACUCOA,
                                        and PAASCU accreditation panels.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-white font-semibold">
                                        <CheckCircle2 className="w-5 h-5 text-[#c8102e] shrink-0" />
                                        <span>Targeted Acquisitions</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/70 pl-7.5">
                                        Direct your book budget precisely to subjects that need fresh
                                        titles or recent copyright editions.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-white font-semibold">
                                        <CheckCircle2 className="w-5 h-5 text-[#c8102e] shrink-0" />
                                        <span>Time-Saving Automation</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/70 pl-7.5">
                                        Eliminate days of manual inventory audits with continuous,
                                        automated syllabus cross-referencing.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-white font-semibold">
                                        <CheckCircle2 className="w-5 h-5 text-[#c8102e] shrink-0" />
                                        <span>Integrated Messaging</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/70 pl-7.5">
                                        Built-in support and staff communication system for smooth
                                        coordination across campus departments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer (Matches Reference Design) */}
            <footer className="bg-black/50 border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-5">
                    {/* Brand Footer */}
                    <div className="flex justify-center items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#9f1239] to-[#c8102e] rounded-2xl flex items-center justify-center shadow-md">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="logo-font text-3xl font-bold text-white tracking-tight">
                            LibColla
                        </span>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70 font-medium">
                        <a href="#features" className="hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">
                            How It Works
                        </a>
                        <a href="#benefits" className="hover:text-white transition-colors">
                            Benefits
                        </a>
                        <Link href="/login" className="hover:text-white transition-colors">
                            Staff Login
                        </Link>
                    </div>

                    <p className="text-white/50 text-xs sm:text-sm">
                        © 2026 LibColla • Library Collection Assessment System. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
