import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Book, TrendingUp, Users, ArrowRight, Lock } from 'lucide-react';
import { PublicHeader, PublicFooter } from '@/layouts/public-layout';

export default function Main() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen flex flex-col bg-white text-[#4B5563] font-['Quicksand',system-ui,sans-serif] selection:bg-[#A04040] selection:text-white">
            <Head title="LibColla • Library Collection Assessment System" />
            <PublicHeader />

            <main className="flex-1 flex items-center bg-white py-14 lg:py-20">
                <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 w-full grid xl:grid-cols-[1fr_560px] gap-12 xl:gap-20 items-stretch">
                    <div className="space-y-8 self-center xl:self-auto">
                        <h1 className="text-5xl md:text-6xl 2xl:text-7xl font-bold leading-[1.1] tracking-tight text-[#A04040]">
                            LibColla:
                            <br />
                            Library Collection
                            <br />
                            Assessment System
                        </h1>
                        <p className="text-xl lg:text-2xl font-medium leading-snug text-[#4B5563] max-w-2xl">
                            Assess, track, and optimize your library resources against approved
                            prospectuses and course subjects. Generate accurate, data-driven
                            collection assessment reports for institutional decision-making and
                            compliance.
                        </p>
                        <Link
                            href={user ? '/dashboard' : '/login'}
                            className="inline-flex items-center gap-3 h-14 px-8 rounded-md bg-gradient-to-r from-[#B04F4F] to-[#8A2B33] hover:brightness-95 text-white text-base font-bold uppercase tracking-wider transition-colors"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Safari-style browser window */}
                    <div className="w-full xl:w-[560px] xl:justify-self-end flex flex-col rounded-xl border border-[#D6D6D6] bg-white shadow-lg overflow-hidden">
                        <div className="relative flex items-center px-4 py-3 bg-[#F1F1F2] border-b border-[#D6D6D6]">
                            <div className="flex items-center gap-2">
                                <span className="size-3.5 rounded-full bg-[#FF5F57] border border-[#E0443E]" />
                                <span className="size-3.5 rounded-full bg-[#FEBC2E] border border-[#DEA123]" />
                                <span className="size-3.5 rounded-full bg-[#28C840] border border-[#1AAB29]" />
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-md bg-white border border-[#D6D6D6] text-sm font-medium text-[#4B5563]">
                                <Lock className="w-3.5 h-3.5 text-[#555555]" />
                                <span>Collection Control</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center p-10 lg:p-16 text-center">
                            <div className="flex justify-center items-center gap-10 mb-8">
                                <Book className="w-16 h-16 lg:w-20 lg:h-20 text-[#A04040]" />
                                <TrendingUp className="w-16 h-16 lg:w-20 lg:h-20 text-[#E9A12B]" />
                                <Users className="w-16 h-16 lg:w-20 lg:h-20 text-[#A04040]" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-[#4B5563] mb-3">
                                Complete Collection Control
                            </h3>
                            <p className="text-lg lg:text-xl font-medium text-[#6B7280]">
                                Assess • Track • Optimize • Report
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}