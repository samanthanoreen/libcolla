import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    BookOpen,
    User,
    Lock,
    Eye,
    EyeOff,
    ChevronDown,
    LoaderCircle,
    ArrowLeft,
    AlertCircle,
    Shield,
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

    // Combine email and general auth errors
    const errorMessage = errors.email || (errors as any).username || (errors as any).error;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2c0f14] via-[#1a0b0e] to-[#120508] text-[#f5e8e8] flex flex-col items-center justify-center p-6 sm:p-8 font-sans selection:bg-[#c8102e] selection:text-white relative overflow-hidden">
            <Head>
                <title>LibColla • Login</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Custom Styles */}
            <style>{`
                .logo-font {
                    font-family: 'Playfair Display', Georgia, serif;
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
                    box-shadow: 0 16px 28px -6px rgba(159, 18, 57, 0.55);
                }
                .input-glow:focus {
                    border-color: #c8102e;
                    box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.25);
                }
            `}</style>

            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#c8102e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-96 h-96 bg-[#9f1239]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Navigation back to landing */}
            <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs text-white/60">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Main</span>
                </Link>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Brand Logo Header */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-3.5 group">
                        <div className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-br from-[#9f1239] to-[#c8102e] rounded-3xl flex items-center justify-center shadow-xl shadow-rose-950/60 group-hover:scale-105 transition-transform duration-300">
                            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="logo-font text-4xl sm:text-5xl font-bold tracking-tight text-white group-hover:text-rose-200 transition-colors">
                                LibColla
                            </h1>
                            <p className="text-[#ffd7ba] text-xs sm:text-sm font-medium -mt-1 tracking-wide">
                                Library Collection System
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="glass-card rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10">
                    <div className="text-center mb-7">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="text-[#ffd7ba]/90 text-sm mt-1.5 font-medium">
                            Sign in to access your library dashboard
                        </p>
                    </div>

                    {/* Status Alert */}
                    {status && (
                        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 px-5 py-3.5 rounded-2xl mb-6 text-sm text-center">
                            {status}
                        </div>
                    )}

                    {/* Error Alert */}
                    {errorMessage && (
                        <div className="bg-red-500/15 border border-red-500/40 text-red-200 px-5 py-3.5 rounded-2xl mb-6 text-sm flex items-center gap-2.5">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username or Email Input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
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
                                    placeholder="user@libcolla.ph or username"
                                    required
                                    autoFocus
                                    className="input-glow w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl outline-none text-white placeholder:text-white/40 text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
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
                                    className="input-glow w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-2xl outline-none text-white placeholder:text-white/40 text-sm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    tabIndex={-1}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1.5 pl-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                                Select Role
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <select
                                    name="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="input-glow w-full pl-12 pr-10 py-3.5 bg-white/10 border border-white/20 rounded-2xl outline-none text-white text-sm appearance-none cursor-pointer transition-all [&>option]:bg-[#1a0b0e] [&>option]:text-white"
                                >
                                    <option value="">Choose role (Optional)...</option>
                                    <option value="admin">Administrator</option>
                                    <option value="librarian">Librarian</option>
                                    <option value="staff">Staff</option>
                                </select>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#c8102e] focus:ring-[#c8102e] focus:ring-offset-0 cursor-pointer"
                            />
                            <label
                                htmlFor="remember"
                                className="text-xs text-white/70 hover:text-white cursor-pointer select-none"
                            >
                                Keep me signed in
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="maroon-btn w-full text-white font-semibold py-4 rounded-2xl text-base flex items-center justify-center gap-2.5 shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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

                        {/* Note matching reference file */}
                        <div className="text-center pt-3 text-xs sm:text-sm">
                            <span className="text-white/60">Don't have an account? </span>
                            <span className="text-[#ffd7ba] font-medium">
                                Refer to the Administrator
                            </span>
                        </div>
                    </form>
                </div>

                {/* Footer Copyright */}
                <div className="text-center mt-7 text-white/40 text-xs">
                    © 2026 LibColla • Library Collection Assessment System
                </div>
            </div>
        </div>
    );
}
