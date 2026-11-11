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
} from 'lucide-react';

export default function Main() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#701F35] to-[#4D1425] text-[#F5E9ED] font-sans selection:bg-[#701F35] selection:text-white">
            <Head>
                <title>LibColla • Library Collection Assessment System</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,500&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap"
                    rel="stylesheet"
                />
            </Head>

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
                .hero-bg {
                    background: linear-gradient(135deg, #701F35 0%, #4D1425 100%);
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
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
                        <a href="#features" className="nav-link text-white/90 hover:text-white">
                            Features
                        </a>
                        <a href="#how-it-works" className="nav-link text-white/90 hover:text-white">
                            How It Works
                        </a>
                        <a href="#benefits" className="nav-link text-white/90 hover:text-white">
                            Benefits
                        </a>
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

                    {/* Mobile Menu Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-11 h-11 flex items-center justify-center text-white text-xl rounded-xl hover:bg-white/10 transition-colors"
                        aria-label="Toggle Navigation"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Panel */}
                {mobileMenuOpen && (
                    <div className="md:hidden flex flex-col gap-1 px-8 pb-6 text-sm font-semibold uppercase tracking-wider bg-[#7a0f20] border-t border-white/10">
                        <a
                            href="#features"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
                        >
                            How It Works
                        </a>
                        <a
                            href="#benefits"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
                        >
                            Benefits
                        </a>
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

            {/* Hero Section (Matches 1lib/main.php) */}
            <section className="hero-bg pt-20 pb-24 md:pt-28 md:pb-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none tracking-tighter glow font-['Playfair_Display',Georgia,serif]">
                            LibColla:<br />
                            <span className="text-[#ffd7ba]">Library Collection</span><br />
                            Assessment System
                        </h1>

                        <p className="text-xl md:text-2xl text-[#ffd7ba] max-w-lg leading-relaxed">
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

                    {/* Right Visual (Matches 1lib/main.php) */}
                    <div className="relative hero-card">
                        <div className="glass rounded-3xl p-4 sm:p-5 shadow-2xl">
                            <div className="bg-[#4D1425] rounded-3xl overflow-hidden border border-white/10">
                                {/* Window Control Header Bar */}
                                <div className="bg-[#340c18] px-6 py-3.5 flex items-center justify-between border-b border-white/5">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    </div>
                                    <div className="text-white/60 text-xs font-semibold tracking-wider uppercase">
                                        Collection Control
                                    </div>
                                    <div className="w-8" />
                                </div>

                                {/* Body Icons & Titles */}
                                <div className="p-8 sm:p-12 text-center">
                                    <div className="flex justify-center items-center gap-10 text-6xl sm:text-7xl mb-8 text-[#701F35]">
                                        <Book className="w-16 h-16 sm:w-20 sm:h-20 book-icon text-[#701F35]" />
                                        <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 text-[#e11d48]" />
                                        <Users className="w-16 h-16 sm:w-20 sm:h-20 text-[#701F35]" />
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-semibold mb-3 text-white">
                                        Complete Collection Control
                                    </h3>
                                    <p className="text-lg text-[#ffd7ba] font-medium tracking-wide">
                                        Assess • Track • Optimize • Report
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section (Matches 1lib features.php) */}
            <section id="features" className="py-24 border-t border-white/10 relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#d4a017]/20 border border-[#d4a017]/40 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#ffd7ba] uppercase">
                            <Layers className="w-3.5 h-3.5 text-[#d4a017]" />
                            <span>System Capabilities</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-['Playfair_Display',Georgia,serif]">
                            Tailored for Institutional Libraries
                        </h2>
                        <p className="text-[#ffd7ba]/90 text-lg">
                            Evaluate library holdings directly against approved curriculum prospectuses.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass p-7 rounded-3xl hover:border-[#d4a017]/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#701F35] to-[#4D1425] flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-950/40">
                                <SearchCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Syllabus Alignment</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Link book accessions directly to academic course codes and prospectus subjects.
                            </p>
                        </div>

                        <div className="glass p-7 rounded-3xl hover:border-[#d4a017]/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#701F35] to-[#4D1425] flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-950/40">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Copyright Currency</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Track 5-year copyright thresholds to ensure collection currency meets accreditation criteria.
                            </p>
                        </div>

                        <div className="glass p-7 rounded-3xl hover:border-[#d4a017]/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#701F35] to-[#4D1425] flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-950/40">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Accreditation Reports</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Generate ready-to-print assessment reports with title counts and ratio compliance.
                            </p>
                        </div>

                        <div className="glass p-7 rounded-3xl hover:border-[#d4a017]/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#701F35] to-[#4D1425] flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-950/40">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Role Management</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Role-based access for Administrators, Chief Librarians, and Library Staff members.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-black/25 border-t border-white/10 relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#d4a017]/20 border border-[#d4a017]/40 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#ffd7ba] uppercase">
                            <TrendingUp className="w-3.5 h-3.5 text-[#d4a017]" />
                            <span>Workflow</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-['Playfair_Display',Georgia,serif]">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass p-8 rounded-3xl">
                            <div className="text-5xl font-extrabold text-[#d4a017]/40 mb-4 font-mono">01</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Setup Prospectus</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Configure academic degree programs and course subjects according to the curriculum prospectus.
                            </p>
                        </div>

                        <div className="glass p-8 rounded-3xl">
                            <div className="text-5xl font-extrabold text-[#d4a017]/40 mb-4 font-mono">02</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Catalog Holdings</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Enter book records with call numbers, copyright years, and assign them to course subjects.
                            </p>
                        </div>

                        <div className="glass p-8 rounded-3xl">
                            <div className="text-5xl font-extrabold text-[#d4a017]/40 mb-4 font-mono">03</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Generate Matrix</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Automatically calculate compliance metrics and generate reports for institutional review.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-24 border-t border-white/10 relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="glass rounded-3xl p-8 sm:p-14 border border-white/10 bg-gradient-to-br from-[#3a0712]/80 to-[#1f0a0f]/90">
                        <div className="grid lg:grid-cols-3 gap-10 items-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-[#d4a017]/20 border border-[#d4a017]/40 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#ffd7ba] uppercase">
                                    <GraduationCap className="w-3.5 h-3.5 text-[#d4a017]" />
                                    <span>Institutional Value</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Playfair_Display',Georgia,serif]">
                                    Why Institutions Rely on LibColla
                                </h2>
                                <p className="text-[#ffd7ba]/80 text-sm sm:text-base leading-relaxed">
                                    Empower library administrators and academic deans with concrete, verifiable collection data.
                                </p>
                            </div>

                            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-white font-semibold">
                                        <CheckCircle2 className="w-5 h-5 text-[#d4a017] shrink-0" />
                                        <span>Audit-Ready Records</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/70 pl-7.5">
                                        Instant compliance calculations formatted for CHED and PACUCOA accreditation panels.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-white font-semibold">
                                        <CheckCircle2 className="w-5 h-5 text-[#d4a017] shrink-0" />
                                        <span>Targeted Acquisitions</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/70 pl-7.5">
                                        Direct your book budget precisely to subjects that need fresh titles.
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
