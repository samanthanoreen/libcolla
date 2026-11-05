import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    ChevronLeft,
    ClipboardCheck,
    Database,
    Headset,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    User,
    Users,
    Wrench,
    BarChart3,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const serif = {
    fontFamily: '"Source Serif 4", "Playfair Display", Georgia, serif',
};

type Child = { label: string; href?: string };
type NavEntry =
    | { type: 'link'; label: string; href: string; Icon: any }
    | { type: 'faded'; label: string; Icon: any }
    | { type: 'group'; label: string; Icon: any; children: Child[] };

const NAV: NavEntry[] = [
    {
        type: 'link',
        label: 'DASHBOARD',
        href: '/dashboard',
        Icon: LayoutDashboard,
    },
    { type: 'faded', label: 'MAIN', Icon: BarChart3 },
    {
        type: 'group',
        label: 'COLLECTION ASSESSMENT',
        Icon: ClipboardCheck,
        children: [
            { label: 'Generate Report', href: '/reports/generate' },
            { label: 'Manage Reports', href: '/reports/manage' },
        ],
    },
    {
        type: 'group',
        label: 'DATABASE',
        Icon: Database,
        children: [
            { label: 'Program', href: '/programs' },
            { label: 'Books', href: '/books' },
        ],
    },
    { type: 'faded', label: 'TOOLS', Icon: Wrench },
    {
        type: 'group',
        label: 'SUPPORT',
        Icon: Headset,
        children: [{ label: 'Contact Form' }],
    },
    {
        type: 'group',
        label: 'USERS',
        Icon: Users,
        children: [{ label: 'Manage Users' }],
    },
];

// page title + breadcrumb trail, keyed by the start of the Inertia component name
const PAGES: {
    match: string;
    title: string;
    trail: { label: string; href?: string }[];
}[] = [
    { match: 'Dashboard', title: 'Dashboard', trail: [] },
    { match: 'dashboard', title: 'Dashboard', trail: [] },
    {
        match: 'Programs',
        title: 'Program',
        trail: [{ label: 'Database', href: '/programs' }],
    },
    {
        match: 'Prospectuses',
        title: 'Prospectus',
        trail: [
            { label: 'Database', href: '/programs' },
            { label: 'Program', href: '/programs' },
        ],
    },
    {
        match: 'CourseSubjects',
        title: 'Course Subjects',
        trail: [{ label: 'Database', href: '/programs' }],
    },
    {
        match: 'Books',
        title: 'Books',
        trail: [{ label: 'Database', href: '/books' }],
    },
    {
        match: 'Reports/Generate',
        title: 'Generate Report',
        trail: [{ label: 'Collection Assessment', href: '/reports/generate' }],
    },
    {
        match: 'Reports/Preview',
        title: 'Report Preview',
        trail: [{ label: 'Collection Assessment', href: '/reports/generate' }],
    },
    {
        match: 'Reports/View',
        title: 'View Report',
        trail: [{ label: 'Collection Assessment', href: '/reports/manage' }],
    },
    {
        match: 'Reports/Manage',
        title: 'Manage Reports',
        trail: [{ label: 'Collection Assessment', href: '/reports/generate' }],
    },
    { match: 'settings', title: 'Settings', trail: [] },
];

function readCollapsed() {
    try {
        return localStorage.getItem('sidebar_collapsed') === 'true';
    } catch {
        return false;
    }
}

export default function LibCollaLayout({ children }: { children: ReactNode }) {
    const page = usePage<any>();
    const { component, url } = page;
    const user = page.props?.auth?.user;

    const username: string = user?.name ?? 'Admin User';
    const role: string = user?.role ?? 'Administrator';
    const initials = username.slice(0, 2).toUpperCase();

    const meta = PAGES.find((p) => component.startsWith(p.match));
    const title = meta?.title ?? component.split('/').pop() ?? 'Page';
    const trail = meta?.trail ?? [];

    const [collapsed, setCollapsed] = useState(readCollapsed);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
        () => {
            const open: Record<string, boolean> = {};
            NAV.forEach((n) => {
                if (
                    n.type === 'group' &&
                    n.children.some((c) => c.href && url.startsWith(c.href))
                )
                    open[n.label] = true;
            });
            return open;
        },
    );

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [url]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) =>
            e.key === 'Escape' && setProfileOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const toggleCollapse = () => {
        const next = !collapsed;
        setCollapsed(next);
        try {
            localStorage.setItem('sidebar_collapsed', String(next));
        } catch {
            /* ignore */
        }
    };

    const logout = () => {
        if (confirm('Are you sure you want to logout?')) router.post('/logout');
    };

    const itemBase =
        'flex w-full items-center gap-3 rounded-2xl px-[1.125rem] py-3 text-left text-white transition hover:translate-x-1 hover:bg-white/[0.14]';

    return (
        <div
            className="fixed inset-0 overflow-hidden text-[#f5e8e8]"
            style={{
                background: 'linear-gradient(135deg, #7a0c24 0%, #4d0714 100%)',
            }}
        >
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ============ SIDEBAR ============ */}
            <aside
                className={`fixed top-0 left-0 z-[100] flex h-screen flex-col overflow-x-hidden overflow-y-auto border-r border-white/[0.08] transition-all duration-300 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                } w-[292px] lg:translate-x-0 ${collapsed ? 'lg:w-24' : 'lg:w-[292px]'}`}
                style={{
                    background:
                        'linear-gradient(180deg, #6e0c25 0%, #40060f 100%)',
                }}
            >
                {/* empty header band keeps the gold line aligned with the top bar */}
                <div className="h-[120px] shrink-0 border-b-2 border-[#d4a017] bg-black/[0.12]" />

                <nav className="flex-1 overflow-y-auto px-3 py-7">
                    <ul className="flex flex-col gap-1">
                        {NAV.map((entry) => {
                            if (entry.type === 'faded') {
                                return (
                                    <li
                                        key={entry.label}
                                        className={`${itemBase} pointer-events-none opacity-50 ${collapsed ? 'lg:justify-center' : ''}`}
                                    >
                                        <entry.Icon className="size-5 shrink-0" />
                                        <span
                                            className={
                                                collapsed ? 'lg:hidden' : ''
                                            }
                                        >
                                            {entry.label}
                                        </span>
                                    </li>
                                );
                            }

                            if (entry.type === 'link') {
                                const active = url.startsWith(entry.href);
                                return (
                                    <li key={entry.label}>
                                        <Link
                                            href={entry.href}
                                            className={`${itemBase} ${active ? 'border-l-4 border-[#d4a017] bg-[#9f1239]/30 hover:bg-[#9f1239]/45' : ''} ${collapsed ? 'lg:justify-center lg:px-3' : ''}`}
                                        >
                                            <entry.Icon className="size-5 shrink-0" />
                                            <span
                                                className={
                                                    collapsed ? 'lg:hidden' : ''
                                                }
                                            >
                                                {entry.label}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            }

                            const groupActive = entry.children.some(
                                (c) => c.href && url.startsWith(c.href),
                            );
                            const open = !!openGroups[entry.label];
                            return (
                                <li key={entry.label}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenGroups((g) => ({
                                                ...g,
                                                [entry.label]: !g[entry.label],
                                            }))
                                        }
                                        className={`${itemBase} justify-between ${groupActive ? 'bg-[#9f1239]/30' : ''} ${collapsed ? 'lg:justify-center lg:px-3' : ''}`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <entry.Icon className="size-5 shrink-0" />
                                            <span
                                                className={`text-left ${collapsed ? 'lg:hidden' : ''}`}
                                            >
                                                {entry.label}
                                            </span>
                                        </span>
                                        <ChevronDown
                                            className={`size-4 shrink-0 transition ${open ? 'rotate-180' : ''} ${collapsed ? 'lg:hidden' : ''}`}
                                        />
                                    </button>
                                    <ul
                                        className={`ml-9 overflow-hidden transition-all duration-300 ${open ? 'max-h-[400px]' : 'max-h-0'} ${collapsed ? 'lg:hidden' : ''}`}
                                    >
                                        {entry.children.map((c) => {
                                            const active =
                                                !!c.href &&
                                                url.startsWith(c.href);
                                            const cls = `block rounded-xl px-[1.125rem] py-3 transition hover:translate-x-1 hover:bg-white/[0.16] ${active ? 'bg-[#9f1239]' : ''}`;
                                            return (
                                                <li key={c.label}>
                                                    {c.href ? (
                                                        <Link
                                                            href={c.href}
                                                            className={cls}
                                                        >
                                                            {c.label}
                                                        </Link>
                                                    ) : (
                                                        <span
                                                            className={`${cls} cursor-default opacity-60`}
                                                            title="Coming soon"
                                                        >
                                                            {c.label}
                                                        </span>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="flex items-center justify-center border-t border-white/10 p-7">
                    <button
                        type="button"
                        onClick={toggleCollapse}
                        className="hidden size-12 items-center justify-center rounded-2xl text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
                    >
                        <ChevronLeft
                            className={`size-5 transition ${collapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </aside>

            {/* ============ MAIN ============ */}
            <div
                className={`absolute inset-y-0 right-0 left-0 flex flex-col overflow-hidden transition-[left] duration-200 ${
                    collapsed ? 'lg:left-24' : 'lg:left-[292px]'
                }`}
            >
                <header className="sticky top-0 z-50 flex h-[120px] shrink-0 items-center justify-between border-b border-white/10 bg-white/10 px-7 backdrop-blur-md">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                        <button
                            type="button"
                            onClick={toggleCollapse}
                            className="hidden size-[50px] shrink-0 items-center justify-center rounded-2xl text-white transition hover:bg-white/10 lg:inline-flex"
                        >
                            <Menu className="size-6" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileOpen((o) => !o)}
                            className="inline-flex size-[50px] shrink-0 items-center justify-center rounded-2xl text-white/80 transition hover:text-[#c8102e] lg:hidden"
                        >
                            <Menu className="size-6" />
                        </button>

                        <div className="min-w-0 overflow-hidden border-l-[3px] border-[#d4a017] pl-3">
                            <h1
                                className="truncate text-[1.65rem] leading-tight font-bold max-sm:text-xl"
                                style={serif}
                            >
                                {title}
                            </h1>
                            <div className="mt-1 flex items-center gap-2 text-sm max-sm:hidden">
                                <Link
                                    href="/dashboard"
                                    className="text-white/60 hover:text-white"
                                >
                                    Home
                                </Link>
                                <span className="text-white/40">›</span>
                                {trail.map((t) => (
                                    <span
                                        key={t.label}
                                        className="flex items-center gap-2"
                                    >
                                        <Link
                                            href={t.href ?? '#'}
                                            className="text-white/60 hover:text-white"
                                        >
                                            {t.label}
                                        </Link>
                                        <span className="text-white/40">›</span>
                                    </span>
                                ))}
                                <span className="rounded-full border border-[#d4a017]/70 bg-[#d4a017]/15 px-2.5 py-0.5 font-semibold text-white">
                                    {title}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="flex size-10 items-center justify-center rounded-2xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <Bell className="size-5" />
                        </button>

                        <div className="relative">
                            <div
                                onClick={() => setProfileOpen((o) => !o)}
                                className="group flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-2 transition hover:scale-[1.02] hover:bg-white/10"
                            >
                                <div className="text-right max-sm:hidden">
                                    <div className="font-semibold">
                                        {username}
                                    </div>
                                    <div className="text-[0.825rem] text-[#ffd7ba]">
                                        {role}
                                    </div>
                                </div>
                                <div
                                    className="flex size-[50px] items-center justify-center rounded-2xl border-2 border-[#d4a017] font-bold transition group-hover:rotate-12"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #9f1239, #c8102e)',
                                    }}
                                >
                                    {initials}
                                </div>
                                <ChevronDown
                                    className={`size-4 text-white/70 transition ${profileOpen ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {profileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setProfileOpen(false)}
                                    />
                                    <div className="absolute top-[calc(100%+14px)] right-0 z-[9999] w-[260px] overflow-hidden rounded-xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                                        <div
                                            className="border-b-[3px] border-[#d4a017] px-5 py-[22px] text-center text-white"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #9f1239 0%, #7f0d2e 100%)',
                                            }}
                                        >
                                            <div
                                                className="mx-auto mb-3 flex size-[60px] items-center justify-center rounded-full border-[3px] border-[#d4a017] bg-white/20 text-2xl font-bold"
                                                style={serif}
                                            >
                                                {initials}
                                            </div>
                                            <div className="font-semibold">
                                                {username}
                                            </div>
                                            <div className="text-xs opacity-90">
                                                {role}
                                            </div>
                                        </div>
                                        <div className="py-2 text-sm text-gray-700">
                                            <Link
                                                href="/settings/profile"
                                                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50"
                                            >
                                                <User className="size-4 text-gray-500" />{' '}
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/settings/appearance"
                                                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50"
                                            >
                                                <Settings className="size-4 text-gray-500" />{' '}
                                                Settings
                                            </Link>
                                            <div className="my-2 h-px bg-gray-200" />
                                            <button
                                                type="button"
                                                onClick={logout}
                                                className="flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="size-4" />{' '}
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto px-8 pt-10 pb-8 lg:px-12 lg:pt-14 lg:pb-12">
                    {children}
                </main>
            </div>
        </div>
    );
}