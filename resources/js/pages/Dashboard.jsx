import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardCheck,
    FileBarChart,
    FileOutput,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';

const serif = {
    fontFamily: '"Source Serif 4", "Playfair Display", Georgia, serif',
};

function StatCard({ label, value, note, Icon }) {
    return (
        <div className="rounded-[2rem] border border-t-[3px] border-[#E2E5E9] border-t-[#d4a017] bg-white px-9 pt-9 pb-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-md dark:border-white/10 dark:border-t-[#d4a017] dark:bg-white/[0.06] dark:hover:shadow-[0_25px_50px_-12px_rgba(112,31,53,0.3)]">
            <div className="flex justify-between">
                <div>
                    <p className="text-base font-medium text-[#9299A5] dark:text-white/70">
                        {label}
                    </p>
                    <p
                        className="mt-2 text-[3.1rem] leading-tight font-bold text-[#343A40] dark:text-white"
                        style={serif}
                    >
                        {value}
                    </p>
                </div>
                <Icon className="size-14 text-[#701F35]/25 dark:text-white/20" />
            </div>
            <div className="mt-7 flex items-center gap-1 text-[0.95rem] text-[#21865A]">
                <TrendingUp className="size-4" />
                <span>{note}</span>
            </div>
        </div>
    );
}

function QuickAction({ href, label, Icon }) {
    const body = (
        <>
            <div
                className="mx-auto mb-7 flex size-16 items-center justify-center rounded-3xl shadow-sm"
                style={{
                    background: 'linear-gradient(135deg, #701F35, #4D1425)',
                }}
            >
                <Icon className="size-7 text-white" />
            </div>
            <p className="text-[1.05rem] font-semibold text-[#343A40] dark:text-white">{label}</p>
        </>
    );
    const cls =
        'block rounded-[2rem] border border-[#E2E5E9] bg-white px-7 py-9 text-center shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#701F35]/30 hover:bg-[#F5E9ED]/50 dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/10 dark:hover:border-white/20';

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

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;
    const name = auth?.user?.name ?? 'User';
    const fmt = (n) => Number(n ?? 0).toLocaleString();

    return (
        <div className="w-full">
            <div className="mb-14">
                <h2 className="text-3xl font-semibold text-[#343A40] dark:text-white" style={serif}>
                    Welcome back, {name}!
                </h2>
                <p className="mt-3 text-[#9299A5] dark:text-white/70">
                    Here's an overview of your library collection today
                </p>
            </div>

            <div className="mx-auto grid max-w-[60rem] grid-cols-1 gap-8 md:grid-cols-3">
                <StatCard
                    label="Total Books"
                    value={fmt(stats?.total_books)}
                    note="Currently in catalog"
                    Icon={BookOpen}
                />
                <StatCard
                    label="Collection Coverage"
                    value={`${stats?.assessed_percentage ?? 0}%`}
                    note={`${stats?.assessed_count ?? 0} of ${fmt(stats?.total_subjects)} subjects have books`}
                    Icon={ClipboardCheck}
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
                />
            </div>

            <div className="mt-16">
                <h3
                    className="mb-8 flex items-center gap-2 text-xl font-semibold text-[#343A40] dark:text-white"
                    style={serif}
                >
                    <Zap className="size-5 text-[#d4a017]" /> Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
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
                    <QuickAction
                        href="/books"
                        label="Manage Books"
                        Icon={BookOpen}
                    />
                    <QuickAction
                        href="/users/manage"
                        label="Manage Users"
                        Icon={Users}
                    />
                </div>
            </div>
        </div>
    );
}
