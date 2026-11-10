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
        <div className="rounded-[2rem] border border-t-[3px] border-white/10 border-t-[#d4a017] bg-white/[0.06] px-9 pt-9 pb-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(159,18,57,0.25)]">
            <div className="flex justify-between">
                <div>
                    <p className="text-base font-medium text-white/70">
                        {label}
                    </p>
                    <p
                        className="mt-2 text-[3.1rem] leading-tight font-bold text-white"
                        style={serif}
                    >
                        {value}
                    </p>
                </div>
                <Icon className="size-14 text-[#c8102e]/20" />
            </div>
            <div className="mt-7 flex items-center gap-1 text-[0.95rem] text-[#10b981]">
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
                className="mx-auto mb-7 flex size-16 items-center justify-center rounded-3xl"
                style={{
                    background: 'linear-gradient(135deg, #9f1239, #c8102e)',
                }}
            >
                <Icon className="size-7 text-white" />
            </div>
            <p className="text-[1.05rem] font-semibold text-white">{label}</p>
        </>
    );
    const cls =
        'block rounded-[2rem] border border-white/10 bg-white/[0.06] px-7 py-9 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:bg-white/10';

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
                <h2 className="text-3xl font-semibold" style={serif}>
                    Welcome back, {name}! <span aria-hidden>👋</span>
                </h2>
                <p className="mt-3 text-white/70">
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
                    className="mb-8 flex items-center gap-2 text-xl font-semibold"
                    style={serif}
                >
                    <Zap className="size-5" /> Quick Actions
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
                    <QuickAction href="/users" label="Manage Users" Icon={Users} />
                </div>
            </div>
        </div>
    );
}
