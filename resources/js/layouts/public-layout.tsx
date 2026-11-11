import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

type Props = {
    title: string;
    children: React.ReactNode;
};

export default function PublicLayout({ title, children }: Props) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const user = (auth as any)?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#701F35] to-[#4D1425] text-[#F5E9ED] font-sans selection:bg-[#701F35] selection:text-white flex flex-col justify-between">
            <Head>
                <title>{title} • LibColla</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,500&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Exact Styles from 1lib/css/main.css & 1lib/inc/public_top.php */}
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
                .section-bg {
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
                .nav-link:hover::after, .nav-link.active::after {
                    width: 100%;
                }
                .section-title {
                    font-family: 'Inter', system-ui, sans-serif;
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #ffffff;
                    margin-bottom: 16px;
                }
                .section-subtitle {
                    color: #ffd7ba;
                    font-size: 1.05rem;
                    line-height: 1.6;
                }
                .feature-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.25rem;
                    padding: 2rem;
                    transition: all 0.25s ease;
                }
                .feature-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(212, 160, 23, 0.4);
                    transform: translateY(-4px);
                }
                .feature-icon {
                    width: 52px;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(112, 31, 53, 0.6);
                    border: 1px solid rgba(212, 160, 23, 0.4);
                    border-radius: 0.9rem;
                    font-size: 1.3rem;
                    color: #ffd7ba;
                    margin-bottom: 1.1rem;
                }
                .feature-card h3 {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 0.6rem;
                }
                .feature-card p {
                    color: rgba(245, 232, 232, 0.75);
                    font-size: 0.92rem;
                    line-height: 1.55;
                    text-align: justify;
                }
                .step-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.1rem;
                    padding: 1.6rem 1.8rem;
                }
                .step-num {
                    flex-shrink: 0;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #701F35;
                    border: 1px solid #d4a017;
                    border-radius: 50%;
                    font-weight: 800;
                    font-size: 1.1rem;
                    color: #ffffff;
                }
                .step-card h3 {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 0.35rem;
                }
                .step-card p {
                    color: rgba(245, 232, 232, 0.75);
                    font-size: 0.95rem;
                    line-height: 1.55;
                    text-align: justify;
                }
            `}</style>

            {/* Official USeP Masthead Navbar (Matches inc/public_top.php) */}
            <nav className="site-navbar sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
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
                        <Link
                            href="/features"
                            className={`nav-link ${
                                url.startsWith('/features') ? 'text-white active' : 'text-white/90'
                            } hover:text-white`}
                        >
                            Features
                        </Link>
                        <Link
                            href="/how-it-works"
                            className={`nav-link ${
                                url.startsWith('/how-it-works') ? 'text-white active' : 'text-white/90'
                            } hover:text-white`}
                        >
                            How It Works
                        </Link>
                        <Link
                            href="/benefits"
                            className={`nav-link ${
                                url.startsWith('/benefits') ? 'text-white active' : 'text-white/90'
                            } hover:text-white`}
                        >
                            Benefits
                        </Link>
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="nav-link text-white/90 hover:text-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="maroon-btn text-white px-6 py-2.5 rounded-2xl text-xs font-bold tracking-wider shadow-md"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-11 h-11 flex items-center justify-center text-white text-xl rounded-xl hover:bg-white/10 transition-colors"
                        aria-label="Toggle Navigation"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Panel */}
                {mobileOpen && (
                    <div className="md:hidden flex flex-col gap-1 px-8 pb-6 text-sm font-semibold uppercase tracking-wider bg-[#7a0f20] border-t border-white/10">
                        <Link
                            href="/features"
                            onClick={() => setMobileOpen(false)}
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
                        >
                            Features
                        </Link>
                        <Link
                            href="/how-it-works"
                            onClick={() => setMobileOpen(false)}
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="/benefits"
                            onClick={() => setMobileOpen(false)}
                            className="block py-3 text-white/90 hover:text-white border-b border-white/10"
                        >
                            Benefits
                        </Link>
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="block py-3 text-[#ffd7ba] font-bold"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="block py-3 text-[#ffd7ba] font-bold"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <main className="flex-1">{children}</main>

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
