import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ChevronDown,
    LoaderCircle,
    ArrowLeft,
    AlertCircle,
} from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword?: boolean;
};

export default function Login({ status }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        role: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    const errorMessage = errors.email || (errors as any).username || (errors as any).error;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#701F35] to-[#4D1425] text-[#F5E9ED] flex flex-col items-center justify-center p-6 selection:bg-[#701F35] selection:text-white">
            <Head>
                <title>Login • LibColla</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Exact Styles from 1lib/css/login.css */}
            <style>{`
                .univ-name-font {
                    font-family: 'Cinzel', 'Source Serif 4', Georgia, serif;
                    font-size: 1.85rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    line-height: 1.25;
                }
                .logo-font {
                    font-family: 'Inter', system-ui, sans-serif;
                    font-size: 1.55rem;
                    font-weight: 700;
                    letter-spacing: 0.01em;
                }
                .tagline-font {
                    font-family: 'Inter', system-ui, sans-serif;
                    font-style: normal;
                    font-size: 1rem;
                    font-weight: 500;
                }
                .welcome-font {
                    font-family: 'Inter', system-ui, sans-serif;
                    font-style: normal;
                    font-weight: 700;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                }
                .maroon-btn {
                    background: #701F35;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    transition: background 0.2s ease, box-shadow 0.2s ease;
                }
                .maroon-btn:hover {
                    background: #4D1425;
                    box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.25);
                }
                .input-field {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .input-field:focus {
                    box-shadow: 0 0 0 4px rgba(112, 31, 53, 0.35), 0 0 0 1px #d4a017;
                    border-color: #701F35;
                }
                select.input-field {
                    background: #4D1425;
                    color: #FFFFFF;
                    appearance: none;
                }
                select.input-field option {
                    background: #4D1425;
                    color: #FFFFFF;
                    padding: 12px 16px;
                }
            `}</style>

            <div className="max-w-md w-full">
                {/* Back to Home link */}
                <div className="mb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Institutional Mark (Matches 1lib/login.php) */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/images/usep-logo.png"
                        alt="University of Southeastern Philippines"
                        className="w-28 h-28 mb-4 rounded-full object-contain drop-shadow-lg"
                    />
                    <p className="univ-name-font text-[#f0c541] text-center">
                        University of Southeastern Philippines
                    </p>
                    <h1 className="logo-font text-white mt-3 text-center">
                        LibColla
                    </h1>
                    <p className="tagline-font text-[#ffd7ba] mt-1 text-center">
                        Library Collection Assessment System
                    </p>
                </div>

                {/* Login Card (Matches 1lib/login.php) */}
                <div className="glass-card rounded-3xl shadow-2xl overflow-hidden">
                    <div className="px-8 sm:px-10 py-10">
                        <div className="text-center mb-8">
                            <h2 className="welcome-font text-4xl font-semibold text-white">
                                Welcome
                            </h2>
                            <p className="text-[#ffd7ba] mt-2 text-sm sm:text-base">
                                Sign in to access your library dashboard
                            </p>
                        </div>

                        {/* Status notification */}
                        {status && (
                            <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-200 px-6 py-3.5 rounded-2xl mb-6 text-center text-sm">
                                {status}
                            </div>
                        )}

                        {/* Error Alert */}
                        {errorMessage && (
                            <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded-2xl mb-6 text-center text-sm flex items-center justify-center gap-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username or Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Username or Email
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="user@usep.edu.ph"
                                        required
                                        autoFocus
                                        className="input-field w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none text-white placeholder:text-white/40 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="input-field w-full pl-11 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none text-white placeholder:text-white/40 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1 pl-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Role Select Input */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Select Role
                                </label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="input-field w-full px-4 py-4 bg-[#4D1425] border border-white/20 rounded-2xl focus:outline-none text-white appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="">Choose role (Optional)...</option>
                                        <option value="admin">Administrator</option>
                                        <option value="librarian">Librarian</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#ffd7ba]">
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="maroon-btn w-full text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-lg cursor-pointer disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="w-5 h-5 animate-spin" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>

                            {/* Administrator note */}
                            <div className="text-center pt-2">
                                <span className="text-white/60 text-sm">
                                    Don't have an account?{' '}
                                </span>
                                <span className="text-[#ffd7ba] font-semibold">
                                    Refer to the Administrator
                                </span>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="text-center mt-8 text-white/40 text-sm">
                    © 2026 LibColla • Library Collection Assessment System
                </div>
            </div>
        </div>
    );
}
