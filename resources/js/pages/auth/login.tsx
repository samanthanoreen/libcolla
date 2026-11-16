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
    LogIn,
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

    const labelClass = 'block text-xs font-bold uppercase tracking-wider mb-2 text-[#6B7280]';
    const inputClass =
        'input-field w-full py-3.5 rounded-xl text-base font-medium text-[#3F4858] bg-white border border-[#E5E7EB] placeholder:text-[#9CA3AF] focus:outline-none';

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-cover bg-no-repeat text-[#4B5563] font-['Quicksand',system-ui,sans-serif] selection:bg-[#973939] selection:text-white"
            style={{
                backgroundColor: '#FFFFFF',
                backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.62), rgba(255,255,255,0.62)), url(/images/usep-eagle.jpg)',
                backgroundPosition: 'right center',
            }}
        >
            <Head title="Login • LibColla">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    head-key="quicksand-font"
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
                />
            </Head>

            <style>{`
                .signin-btn {
                    background: linear-gradient(90deg, #D66C6C 0%, #A04040 100%);
                    box-shadow: 0 6px 14px rgba(160, 64, 64, 0.28);
                    transition: filter 0.2s ease, box-shadow 0.2s ease;
                }
                .signin-btn:hover:not(:disabled) {
                    filter: brightness(0.94);
                    box-shadow: 0 8px 18px rgba(160, 64, 64, 0.36);
                }
                .input-field {
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                .input-field:focus {
                    box-shadow: 0 0 0 3px rgba(151, 57, 57, 0.15);
                    border-color: #973939 !important;
                }
            `}</style>

            <div className="w-full max-w-md">
                {/* Back to Home */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/85 backdrop-blur-sm border border-white/70 shadow-sm text-sm font-semibold text-[#973939] hover:bg-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Institutional mark */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/images/usep-logo.png"
                        alt="University of Southeastern Philippines"
                        className="w-28 h-28 mb-5 rounded-full object-contain"
                    />
                    <p className="whitespace-nowrap text-center uppercase font-medium text-[10px] tracking-[0.12em] min-[400px]:text-xs min-[400px]:tracking-[0.18em] sm:text-base sm:tracking-[0.24em] text-[#4B5563]">
                        University of Southeastern Philippines
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                        <span
                            className="hidden sm:block h-px w-14"
                            style={{ background: 'linear-gradient(to right, transparent, rgba(163,70,70,0.45))' }}
                        />
                        <p className="whitespace-nowrap text-center uppercase font-semibold text-[10px] tracking-[0.12em] min-[400px]:text-xs min-[400px]:tracking-[0.18em] sm:text-base sm:tracking-[0.26em] text-[#A34646]/90">
                            Library Collection Assessment System
                        </p>
                        <span
                            className="hidden sm:block h-px w-14"
                            style={{ background: 'linear-gradient(to left, transparent, rgba(163,70,70,0.45))' }}
                        />
                    </div>
                </div>

                {/* Login card */}
                <div className="rounded-2xl shadow-xl overflow-hidden border border-white/70 backdrop-blur-md"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.80), rgba(251,242,242,0.80))' }}>
                    <div className="px-8 pt-8 pb-7">
                        <div className="flex flex-col items-center text-center mb-7">
                            <div className="mb-4 p-1.5 rounded-2xl bg-[#D66C6C]/15">
                                <div
                                    className="size-14 rounded-xl flex items-center justify-center text-white shadow-md"
                                    style={{ background: 'linear-gradient(135deg, #D66C6C 0%, #A04040 100%)' }}
                                >
                                    <User className="w-6 h-6" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-[#973939]">Welcome</h2>
                            <p className="mt-1.5 text-base font-medium text-[#4B5563]">
                                Sign in to access your library dashboard
                            </p>
                        </div>

                        {/* Status notification */}
                        {status && (
                            <div className="bg-emerald-50 border border-emerald-400 text-emerald-800 px-5 py-3 rounded-xl mb-5 text-center text-sm font-medium">
                                {status}
                            </div>
                        )}

                        {/* Error Alert */}
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-5 py-3 rounded-xl mb-5 text-center text-sm flex items-center justify-center gap-2 font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username or Email */}
                            <div>
                                <label className={labelClass}>Username or Email</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]">
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
                                        className={`${inputClass} pl-11 pr-4`}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className={labelClass}>Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className={`${inputClass} pl-11 pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] transition-colors cursor-pointer"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <Eye className="w-5 h-5" />
                                        ) : (
                                            <EyeOff className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-600 text-xs mt-1 pl-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label className={labelClass}>Select Role</label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className={`${inputClass} px-4 appearance-none cursor-pointer`}
                                    >
                                        <option value="">Choose role (Optional)...</option>
                                        <option value="admin">Administrator</option>
                                        <option value="librarian">Librarian</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Sign in */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="signin-btn w-full h-12 mt-1 rounded-xl text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="w-5 h-5 animate-spin" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        <span>Sign In</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Card footer strip */}
                    <div className="px-8 py-3 text-center text-xs font-medium text-[#9CA3AF] bg-[#F3F4F6]/80 border-t border-[#E5E7EB]">
                        LibColla © 2026
                    </div>
                </div>
            </div>
        </div>
    );
}