import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    ClipboardCheck,
    FileBarChart,
    FileOutput,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';

function StatCard({ label, value, note, Icon, href, testId, highlight = false }) {
    const cardContent = (
        <div
            data-testid={testId}
            data-card-label={label}
            className={`flex flex-col justify-between h-full rounded-2xl border border-t-[3px] border-[#E5E5E5] border-t-[#E9A12B] bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:border-t-[#E9A12B] dark:bg-white/[0.06] hover:border-[#A04040]/40 dark:hover:border-white/20 ${
                highlight ? 'ring-1 ring-[#E9A12B]/40' : ''
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-base font-semibold text-[#6B7280] dark:text-white/70">
                        {label}
                    </p>
                    <p
                        className={`mt-1 text-5xl leading-tight font-bold transition-colors ${
                            highlight
                                ? 'text-[#D97706] dark:text-[#E9A12B]'
                                : 'text-[#4B5563] dark:text-white'
                        }`}
                    >
                        {value}
                    </p>
                </div>
                <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                        highlight
                            ? 'bg-[#E9A12B]/15 text-[#D97706] dark:text-[#E9A12B]'
                            : 'bg-[#A04040]/10 text-[#A04040] dark:bg-white/10 dark:text-white/80'
                    }`}
                >
                    <Icon className="size-7" />
                </div>
            </div>
            <div
                className={`mt-5 flex items-center gap-1.5 text-sm font-semibold ${
                    highlight
                        ? 'text-[#D97706] dark:text-[#E9A12B]'
                        : 'text-[#21865A]'
                }`}
            >
                <TrendingUp className="size-4" />
                <span>{note}</span>
            </div>
        </div>
    );

    return href ? (
        <Link href={href} className="group block h-full transition transform hover:-translate-y-0.5 focus:outline-none">
            {cardContent}
        </Link>
    ) : (
        cardContent
    );
}

function QuickAction({ href, label, Icon }) {
    const body = (
        <>
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-[#A04040] shadow-sm">
                <Icon className="size-7 text-white" />
            </div>
            <p className="text-base font-bold text-[#4B5563] dark:text-white">{label}</p>
        </>
    );
    const cls =
        'block rounded-2xl border border-[#E5E5E5] bg-white p-6 text-center shadow-sm transition hover:border-[#A04040]/30 hover:bg-[#F9EDEF]/60 hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/10';

    return href ? (
        <Link href={href} className={cls}>
            {body}
        </Link>
    ) : (
        <div className={`${cls} cursor-default opacity-60`} title="Coming soon">
            {body}
        </div>
    );
}

export default function Dashboard({ stats, currentYear = new Date().getFullYear() }) {
    const { auth } = usePage().props;
    const name = auth?.user?.name ?? 'User';
    const fmt = (n) => Number(n ?? 0).toLocaleString();
    const over2YearsCount = Number(
        stats?.books_over_2_years ??
        stats?.books_past_2_years ??
        stats?.books_past_1_year ??
        stats?.past_year_books ??
        0
    );

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#A04040] dark:text-white">
                    Welcome back, {name}!
                </h2>
                <p className="mt-1.5 text-lg font-medium text-[#4B5563] dark:text-white/70">
                    Here's an overview of your library collection today
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total Books"
                    value={fmt(stats?.total_books)}
                    note="Currently in catalog"
                    Icon={BookOpen}
                    href="/books"
                    testId="stat-total-books"
                />
                <StatCard
                    label="Past 2 Years"
                    value={fmt(over2YearsCount)}
                    note={`Published ${currentYear - 3} or earlier`}
                    Icon={Calendar}
                    href="/books?filter=over_2_years"
                    testId="stat-past-year-books"
                    highlight={over2YearsCount > 0}
                />
                <StatCard
                    label="Collection Coverage"
                    value={`${stats?.assessed_percentage ?? 0}%`}
                    note={`${stats?.assessed_count ?? 0} of ${fmt(stats?.total_subjects)} subjects have books`}
                    Icon={ClipboardCheck}
                    href="/reports/generate"
                    testId="stat-collection-coverage"
                />
                <StatCard
                    label="Reports Generated"
                    value={fmt(stats?.total_reports)}
                    note={
                        Number(stats?.total_reports ?? 0) === 0
                            ? 'No reports saved yet'
                            : 'Saved to system'
                    }
                    Icon={FileBarChart}
                    href="/reports/manage"
                    testId="stat-reports-generated"
                />
            </div>

            <div className="mt-10">
                <h3 className="mb-5 flex items-center gap-2 text-xl font-bold text-[#4B5563] dark:text-white">
                    <Zap className="size-5 text-[#E9A12B]" /> Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    <QuickAction
                        href="/reports/generate"
                        label="New Assessment"
                        Icon={ClipboardCheck}
                    />
                    <QuickAction
                        href="/reports/manage"
                        label="Manage Reports"
                        Icon={FileOutput}
                    />
                    <QuickAction href="/books" label="Manage Books" Icon={BookOpen} />
                    <QuickAction href="/users/manage" label="Manage Users" Icon={Users} />
                </div>
            </div>
        </div>
    );
}