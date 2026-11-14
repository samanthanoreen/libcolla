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
    Sun,
    Moon,
} from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

type Props = {
    status?: string;
    canResetPassword?: boolean;
};

export default function Login({ status }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const toggleTheme = () => updateAppearance(isDark ? 'light' : 'dark');

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
        <div
            className={`min-h-screen flex flex-col items-center justify-center p-6 selection:bg-[#701F35] selection:text-white transition-colors duration-300 ${
                isDark
                    ? 'bg-gradient-to-br from-[#701F35] to-[#4D1425] text-[#F5E9ED]'
                    : 'bg-[#F4F5F7] text-[#343A40]'
            }`}
        >
            <Head title="Login • LibColla" />

            {/* Exact Styles from 1lib/css/login.css adapted for Light & Dark mode */}
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
                    transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
                }
                .maroon-btn:hover {
                    background: #4D1425;
                    box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.35);
                    transform: translateY(-1px);
                }
                .input-field {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .input-field:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(112, 31, 53, 0.25);
                    border-color: #701F35 !important;
                }
            `}</style>

            <div className="max-w-md w-full">
                {/* Top Bar: Back to Home + Theme Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                            isDark
                                ? 'text-white/80 hover:text-white'
                                : 'text-[#701F35] hover:text-[#4D1425]'
                        }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                        className={`flex size-10 items-center justify-center rounded-xl transition cursor-pointer ${
                            isDark
                                ? 'bg-white/10 hover:bg-white/20 text-white'
                                : 'bg-white border border-[#E2E5E9] hover:bg-white/80 text-[#701F35] shadow-sm'
                        }`}
                        aria-label="Toggle Theme"
                    >
                        {isDark ? (
                            <Sun className="size-5 text-[#f0c541]" />
                        ) : (
                            <Moon className="size-5 text-[#701F35]" />
                        )}
                    </button>
                </div>

                {/* Institutional Mark (Matches 1lib/login.php) */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/images/usep-logo.png"
                        alt="University of Southeastern Philippines"
                        className="w-28 h-28 mb-4 rounded-full object-contain drop-shadow-lg"
                    />
                    <p
                        className={`univ-name-font text-center transition-colors ${
                            isDark ? 'text-[#f0c541]' : 'text-[#701F35]'
                        }`}
                    >
                        University of Southeastern Philippines
                    </p>
                    <h1
                        className={`logo-font mt-3 text-center transition-colors ${
                            isDark ? 'text-white' : 'text-[#343A40]'
                        }`}
                    >
                        LibColla
                    </h1>
                    <p
                        className={`tagline-font mt-1 text-center transition-colors ${
                            isDark ? 'text-[#ffd7ba]' : 'text-[#9299A5]'
                        }`}
                    >
                        Library Collection Assessment System
                    </p>
                </div>

                {/* Login Card (Matches 1lib/login.php) */}
                <div
                    className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                        isDark
                            ? 'glass-card'
                            : 'bg-white border border-[#E2E5E9]'
                    }`}
                >
                    <div className="px-8 sm:px-10 py-10">
                        <div className="text-center mb-8">
                            <h2
                                className={`welcome-font text-4xl font-semibold transition-colors ${
                                    isDark ? 'text-white' : 'text-[#343A40]'
                                }`}
                            >
                                Welcome
                            </h2>
                            <p
                                className={`mt-2 text-sm sm:text-base transition-colors ${
                                    isDark ? 'text-[#ffd7ba]' : 'text-[#9299A5]'
                                }`}
                            >
                                Sign in to access your library dashboard
                            </p>
                        </div>

                        {/* Status notification */}
                        {status && (
                            <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 dark:text-emerald-200 px-6 py-3.5 rounded-2xl mb-6 text-center text-sm font-medium">
                                {status}
                            </div>
                        )}

                        {/* Error Alert */}
                        {errorMessage && (
                            <div className="bg-red-500/20 border border-red-500 text-red-600 dark:text-red-300 px-6 py-4 rounded-2xl mb-6 text-center text-sm flex items-center justify-center gap-2 font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username or Email Input */}
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${
                                        isDark ? 'text-white/80' : 'text-[#343A40]'
                                    }`}
                                >
                                    Username or Email
                                </label>
                                <div className="relative">
                                    <div
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                                            isDark ? 'text-white/50' : 'text-[#9299A5]'
                                        }`}
                                    >
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
                                        className={`input-field w-full pl-11 pr-4 py-4 rounded-2xl focus:outline-none text-sm transition-colors ${
                                            isDark
                                                ? 'bg-white/10 border border-white/20 text-white placeholder:text-white/40'
                                                : 'bg-[#F4F5F7] border border-[#E2E5E9] text-[#343A40] placeholder:text-[#9299A5]'
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${
                                        isDark ? 'text-white/80' : 'text-[#343A40]'
                                    }`}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                                            isDark ? 'text-white/50' : 'text-[#9299A5]'
                                        }`}
                                    >
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className={`input-field w-full pl-11 pr-12 py-4 rounded-2xl focus:outline-none text-sm transition-colors ${
                                            isDark
                                                ? 'bg-white/10 border border-white/20 text-white placeholder:text-white/40'
                                                : 'bg-[#F4F5F7] border border-[#E2E5E9] text-[#343A40] placeholder:text-[#9299A5]'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
                                            isDark
                                                ? 'text-white/50 hover:text-white'
                                                : 'text-[#9299A5] hover:text-[#343A40]'
                                        }`}
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
                                    <p className="text-red-500 text-xs mt-1 pl-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Role Select Input */}
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${
                                        isDark ? 'text-white/80' : 'text-[#343A40]'
                                    }`}
                                >
                                    Select Role
                                </label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className={`input-field w-full px-4 py-4 rounded-2xl focus:outline-none appearance-none cursor-pointer text-sm transition-colors ${
                                            isDark
                                                ? 'bg-[#4D1425] border border-white/20 text-white'
                                                : 'bg-[#F4F5F7] border border-[#E2E5E9] text-[#343A40]'
                                        }`}
                                    >
                                        <option value="" className={isDark ? 'bg-[#4D1425] text-white' : 'bg-white text-[#343A40]'}>
                                            Choose role (Optional)...
                                        </option>
                                        <option value="admin" className={isDark ? 'bg-[#4D1425] text-white' : 'bg-white text-[#343A40]'}>
                                            Administrator
                                        </option>
                                        <option value="librarian" className={isDark ? 'bg-[#4D1425] text-white' : 'bg-white text-[#343A40]'}>
                                            Librarian
                                        </option>
                                        <option value="staff" className={isDark ? 'bg-[#4D1425] text-white' : 'bg-white text-[#343A40]'}>
                                            Staff
                                        </option>
                                    </select>
                                    <div
                                        className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                                            isDark ? 'text-[#ffd7ba]' : 'text-[#701F35]'
                                        }`}
                                    >
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
                                <span
                                    className={`text-sm ${
                                        isDark ? 'text-white/60' : 'text-[#9299A5]'
                                    }`}
                                >
                                    Don't have an account?{' '}
                                </span>
                                <span
                                    className={`font-semibold ${
                                        isDark ? 'text-[#ffd7ba]' : 'text-[#701F35]'
                                    }`}
                                >
                                    Refer to the Administrator
                                </span>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div
                    className={`text-center mt-8 text-sm ${
                        isDark ? 'text-white/40' : 'text-[#9299A5]'
                    }`}
                >
                    © 2026 LibColla • Library Collection Assessment System
                </div>
            </div>
        </div>
    );
}
