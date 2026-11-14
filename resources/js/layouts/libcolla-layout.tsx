import { Link, router, usePage } from '@inertiajs/react';

import {
    BarChart3,
    Bell,
    ChevronDown,
    ChevronLeft,
    ClipboardCheck,
    Database,
    Headset,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sun,
    User,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

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
        children: [{ label: 'Contact Form', href: '/support/contact' }],
    },
    {
        type: 'group',
        label: 'USERS',
        Icon: Users,
        children: [{ label: 'Manage Users', href: '/users' }],
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
    {
        match: 'Users',
        title: 'Manage Users',
        trail: [{ label: 'Users', href: '/users' }],
    },
    {
        match: 'Support',
        title: 'Support',
        trail: [{ label: 'Support', href: '/support/contact' }],
    },
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

    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const toggleTheme = () => updateAppearance(isDark ? 'light' : 'dark');

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
    }, []);

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

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const logout = () => {
        setProfileOpen(false);
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = () => {
        setLoggingOut(true);
        router.post(
            '/logout',
            {},
            {
                onSuccess: () => {
                    setShowLogoutConfirm(false);
                    window.location.href = '/login';
                },
                onError: () => {
                    window.location.href = '/logout';
                },
                onFinish: () => {
                    setLoggingOut(false);
                },
            },
        );
    };

    const itemBase =
        'flex w-full items-center gap-3 rounded-2xl px-[1.125rem] py-3 text-left text-white transition hover:translate-x-1 hover:bg-white/[0.14]';

    return (
        <div
            className={`fixed inset-0 overflow-hidden transition-colors duration-300 ${
                isDark
                    ? 'bg-gradient-to-br from-[#2D0B15] to-[#14040A] text-[#F5E9ED]'
                    : 'bg-[#F4F5F7] text-[#343A40]'
            }`}
        >
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ============ SIDEBAR ============ */}
            <aside
                className={`fixed top-0 left-0 z-[100] flex h-screen flex-col overflow-x-hidden overflow-y-auto border-r border-white/[0.08] text-white transition-all duration-300 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                } w-[292px] lg:translate-x-0 ${collapsed ? 'lg:w-24' : 'lg:w-[292px]'}`}
                style={{
                    background: isDark
                        ? 'linear-gradient(180deg, #3D0E1C 0%, #1B050C 100%)'
                        : 'linear-gradient(180deg, #701F35 0%, #4D1425 100%)',
                }}
            >
                {/* Sidebar Header Brand Band (aligned with top bar via gold line) */}
                <div className="flex h-[120px] shrink-0 flex-col items-center justify-center border-b-2 border-[#d4a017] bg-black/[0.12] px-4 py-3 text-center overflow-hidden">
                    {collapsed ? (
                        <img
                            src="/images/usep-logo.png"
                            alt="University of Southeastern Philippines"
                            className="size-12 rounded-full object-contain"
                        />
                    ) : (
                        <>
                            <div className="flex items-center justify-center gap-2.5 w-full">
                                <img
                                    src="/images/usep-logo.png"
                                    alt="University of Southeastern Philippines"
                                    className="size-11 shrink-0 rounded-full object-contain shadow-sm"
                                />
                                <div className="text-[0.85rem] font-bold leading-tight text-white tracking-tight">
                                    University of Southeastern Philippines
                                </div>
                            </div>
                            <div className="mt-1 text-[0.7rem] font-semibold tracking-wider uppercase text-[#F5E9ED]/85">
                                Library Collection Assessment System
                            </div>
                        </>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-7">
                    <ul className="flex flex-col gap-1">
                        {NAV.map((entry) => {
                            if (entry.type === 'faded') {
                                return (
                                    <li
                                        key={entry.label}
                                        className={`${itemBase} pointer-events-none text-white/60 font-semibold tracking-wider text-xs ${collapsed ? 'lg:justify-center' : ''}`}
                                    >
                                        <entry.Icon className="size-5 shrink-0 text-white/60" />
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
                                            className={`${itemBase} ${active ? 'border-l-4 border-[#d4a017] bg-[#701F35]/35 hover:bg-[#701F35]/55 font-bold' : ''} ${collapsed ? 'lg:justify-center lg:px-3' : ''}`}
                                        >
                                            <entry.Icon className="size-5 shrink-0 text-white" />
                                            <span
                                                className={`text-white ${
                                                    collapsed ? 'lg:hidden' : ''
                                                }`}
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
                                        className={`${itemBase} justify-between ${groupActive ? 'bg-[#701F35]/35' : ''} ${collapsed ? 'lg:justify-center lg:px-3' : ''}`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <entry.Icon className="size-5 shrink-0 text-white" />
                                            <span
                                                className={`text-left text-white ${collapsed ? 'lg:hidden' : ''}`}
                                            >
                                                {entry.label}
                                            </span>
                                        </span>
                                        <ChevronDown
                                            className={`size-4 shrink-0 transition text-white/80 ${open ? 'rotate-180' : ''} ${collapsed ? 'lg:hidden' : ''}`}
                                        />
                                    </button>
                                    <ul
                                        className={`ml-9 overflow-hidden transition-all duration-300 ${open ? 'max-h-[400px]' : 'max-h-0'} ${collapsed ? 'lg:hidden' : ''}`}
                                    >
                                        {entry.children.map((c) => {
                                            const active =
                                                !!c.href &&
                                                url.startsWith(c.href);
                                            const cls = `block rounded-xl px-[1.125rem] py-3 text-sm font-medium transition hover:translate-x-1 hover:bg-white/[0.16] ${
                                                active
                                                    ? 'bg-[#701F35] font-semibold text-white shadow-sm border-l-2 border-[#d4a017]'
                                                    : 'text-white/90 hover:text-white'
                                            }`;
                                            return (
                                                <li key={c.label}>
                                                    {c.href ? (
                                                        <Link
                                                            href={c.href}
                                                            className={cls}
                                                        >
                                                            <span className="truncate">{c.label}</span>
                                                        </Link>
                                                    ) : (
                                                        <span
                                                            className={`${cls} cursor-default opacity-60 text-white/60`}
                                                            title="Coming soon"
                                                        >
                                                            <span className="truncate">{c.label}</span>
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

                <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
                    <button
                        type="button"
                        onClick={logout}
                        className="flex items-center gap-3 rounded-2xl px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                        title="Logout"
                    >
                        <LogOut className="size-5 text-rose-300 shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">Logout</span>}
                    </button>
                    <button
                        type="button"
                        onClick={toggleCollapse}
                        className="hidden size-10 items-center justify-center rounded-2xl text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
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
                <header
                    className={`sticky top-0 z-50 flex h-[120px] shrink-0 items-center justify-between px-7 backdrop-blur-md transition-colors ${
                        isDark
                            ? 'border-b border-white/10 bg-[#1e0910]/80 text-[#F5E9ED]'
                            : 'border-b border-[#E2E5E9] bg-white/95 text-[#343A40] shadow-xs'
                    }`}
                >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                        <button
                            type="button"
                            onClick={toggleCollapse}
                            className={`hidden size-[50px] shrink-0 items-center justify-center rounded-2xl transition cursor-pointer lg:inline-flex ${
                                isDark
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-[#343A40] hover:bg-[#F4F5F7]'
                            }`}
                        >
                            <Menu className="size-6" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileOpen((o) => !o)}
                            className={`inline-flex size-[50px] shrink-0 items-center justify-center rounded-2xl transition cursor-pointer lg:hidden ${
                                isDark
                                    ? 'text-white/80 hover:bg-white/10'
                                    : 'text-[#343A40] hover:bg-[#F4F5F7]'
                            }`}
                        >
                            <Menu className="size-6" />
                        </button>

                        <div className="min-w-0 overflow-hidden border-l-[3px] border-[#d4a017] pl-3">
                            <h1
                                className={`truncate text-[1.65rem] leading-tight font-bold max-sm:text-xl ${
                                    isDark ? 'text-white' : 'text-[#343A40]'
                                }`}
                                style={serif}
                            >
                                {title}
                            </h1>
                            <div className="mt-1 flex items-center gap-2 text-sm max-sm:hidden">
                                <Link
                                    href="/dashboard"
                                    className={isDark ? 'text-white/60 hover:text-white' : 'text-[#9299A5] hover:text-[#343A40]'}
                                >
                                    Home
                                </Link>
                                <span className={isDark ? 'text-white/40' : 'text-[#9299A5]'}>›</span>
                                {trail.map((t) => (
                                    <span
                                        key={t.label}
                                        className="flex items-center gap-2"
                                    >
                                        <Link
                                            href={t.href ?? '#'}
                                            className={isDark ? 'text-white/60 hover:text-white' : 'text-[#9299A5] hover:text-[#343A40]'}
                                        >
                                            {t.label}
                                        </Link>
                                        <span className={isDark ? 'text-white/40' : 'text-[#9299A5]'}>›</span>
                                    </span>
                                ))}
                                <span
                                    className={`rounded-full px-2.5 py-0.5 font-semibold ${
                                        isDark
                                            ? 'border border-[#d4a017]/70 bg-[#d4a017]/15 text-white'
                                            : 'border border-[#701F35]/25 bg-[#F5E9ED] text-[#701F35]'
                                    }`}
                                >
                                    {title}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Light / Dark Mode Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            className={`flex size-10 items-center justify-center rounded-2xl transition cursor-pointer ${
                                isDark
                                    ? 'text-white/70 hover:bg-white/10 hover:text-[#f0c541]'
                                    : 'text-[#9299A5] hover:bg-[#F4F5F7] hover:text-[#701F35]'
                            }`}
                        >
                            {isDark ? (
                                <Sun className="size-5 text-[#f0c541]" />
                            ) : (
                                <Moon className="size-5 text-[#701F35]" />
                            )}
                        </button>

                        <Link
                            href="/support/contact?tab=inbox"
                            title="Message Inbox"
                            className={`flex size-10 items-center justify-center rounded-2xl transition-colors ${
                                isDark
                                    ? 'text-white/70 hover:bg-white/10 hover:text-white'
                                    : 'text-[#9299A5] hover:bg-[#F4F5F7] hover:text-[#701F35]'
                            }`}
                        >
                            <Bell className="size-5" />
                        </Link>

                        <div className="relative">
                            <div
                                onClick={() => setProfileOpen((o) => !o)}
                                className={`group flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-2 transition hover:scale-[1.02] ${
                                    isDark ? 'hover:bg-white/10' : 'hover:bg-[#F4F5F7]'
                                }`}
                            >
                                <div className="text-right max-sm:hidden">
                                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-[#343A40]'}`}>
                                        {username}
                                    </div>
                                    <div className={`text-[0.825rem] ${isDark ? 'text-[#ffd7ba]' : 'text-[#701F35]'}`}>
                                        {role}
                                    </div>
                                </div>
                                <div
                                    className="flex size-[50px] items-center justify-center rounded-2xl border-2 border-[#d4a017] font-bold text-white transition group-hover:rotate-12"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #701F35, #4D1425)',
                                    }}
                                >
                                    {initials}
                                </div>
                                <ChevronDown
                                    className={`size-4 transition ${
                                        isDark ? 'text-white/70' : 'text-[#9299A5]'
                                    } ${profileOpen ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {profileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setProfileOpen(false)}
                                    />
                                    <div className="absolute top-[calc(100%+14px)] right-0 z-[9999] w-[260px] overflow-hidden rounded-xl border border-[#E2E5E9] bg-white shadow-2xl dark:border-white/10 dark:bg-[#280B14]">
                                        <div
                                            className="border-b-[3px] border-[#d4a017] px-5 py-[22px] text-center text-white"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #701F35 0%, #4D1425 100%)',
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
                                        <div className="py-2 text-sm text-[#343A40] dark:text-[#F5E9ED]">
                                            <Link
                                                href="/settings/profile"
                                                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#F4F5F7] dark:hover:bg-white/10"
                                            >
                                                <User className="size-4 text-[#9299A5]" />{' '}
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/settings/appearance"
                                                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#F4F5F7] dark:hover:bg-white/10"
                                            >
                                                <Settings className="size-4 text-[#9299A5]" />{' '}
                                                Settings
                                            </Link>
                                            <div className="my-2 h-px bg-[#E2E5E9] dark:bg-white/10" />
                                            <button
                                                type="button"
                                                onClick={logout}
                                                className="flex w-full items-center gap-3 px-5 py-3 text-left text-[#C44545] transition hover:bg-[#F5E9ED] dark:hover:bg-[#C44545]/10 cursor-pointer"
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

            {/* Simple Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !loggingOut && setShowLogoutConfirm(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white border border-[#E2E5E9] p-6 shadow-xl text-[#343A40] text-center relative dark:bg-[#280B14] dark:border-white/10 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#F5E9ED] text-[#701F35] dark:bg-white/10 dark:text-[#d4a017]">
                            <LogOut className="size-6" />
                        </div>
                        <h3 className="text-lg font-bold tracking-wider uppercase text-[#343A40] dark:text-white">
                            LOG OUT
                        </h3>
                        <p className="mt-1.5 text-sm text-[#9299A5] dark:text-white/70">
                            Are you sure you want to log out?
                        </p>

                        <div className="flex items-center justify-center gap-3 pt-5 mt-4 border-t border-[#E2E5E9] dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => setShowLogoutConfirm(false)}
                                disabled={loggingOut}
                                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#343A40] hover:bg-[#F4F5F7] transition cursor-pointer dark:text-white/80 dark:hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                disabled={loggingOut}
                                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#701F35] hover:bg-[#4D1425] text-white shadow-sm transition cursor-pointer disabled:opacity-50"
                            >
                                {loggingOut ? 'Logging out...' : 'LOG OUT'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
