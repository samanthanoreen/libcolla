import { Head, Link, router, usePage } from '@inertiajs/react';

import {
    BarChart3,
    Bell,
    ChevronDown,
    ChevronLeft,
    ClipboardCheck,
    Database,
    Headset,
    LayoutDashboard,
    Lock,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sun,
    Trash2,
    User,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

const serif = {
    fontFamily: "'Quicksand', system-ui, sans-serif",
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
        match: 'Programs/Prospectus',
        title: 'Prospectus',
        trail: [
            { label: 'Database', href: '/programs' },
            { label: 'Program', href: '/programs' },
        ],
    },
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
        title: 'Contact Form',
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
    const canAccessUsers = String((user as any)?.role || '').toLowerCase() === 'admin' || !!(user as any)?.can_access_users;
    const notificationsData = (page.props as any)?.notifications ?? { unreadCount: 0, items: [] };
    const unreadNotificationsCount: number = Number(notificationsData.unreadCount || 0);
    const notificationItems: any[] = Array.isArray(notificationsData.items) ? notificationsData.items : [];

    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const toggleTheme = () => updateAppearance(isDark ? 'light' : 'dark');

    const username: string = user?.name ?? 'Admin User';
    const role: string = user?.role ?? 'Administrator';
    const initials = username.slice(0, 2).toUpperCase();

    const meta = PAGES.find((p) => component.startsWith(p.match));
    const title = meta?.title ?? component.split('/').pop() ?? 'Page';
    const trail = meta?.trail ?? [];
    const isDashboard = title === 'Dashboard';

    const [collapsed, setCollapsed] = useState(readCollapsed);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Key of the nav item for the current page (link label, or "Group/Child").
    let activeKey: string | null = null;
    NAV.forEach((n) => {
        if (n.type === 'link' && url.startsWith(n.href)) activeKey = n.label;
        if (n.type === 'group') {
            n.children.forEach((c) => {
                if (c.href && url.startsWith(c.href)) activeKey = `${n.label}/${c.label}`;
            });
        }
    });
    // Only the most recently clicked item carries the shadow.
    const [lastClicked, setLastClicked] = useState<string | null>(activeKey);
    useEffect(() => {
        setLastClicked(activeKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);
    const ON = 'border-l-4 border-l-[#E9A12B] bg-black/25';
    const OFF = 'border-l-4 border-l-transparent';
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
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
        'flex w-full items-center gap-3 rounded-2xl px-[1.125rem] py-3.5 text-left text-white transition hover:translate-x-1 hover:bg-white/[0.14]';

    return (
        <div
            className={`fixed inset-0 overflow-hidden transition-colors duration-300 ${
                isDark
                    ? 'bg-black text-[#F5F5F5]'
                    : 'bg-[#F8F8F8] text-[#4B5563]'
            }`}
        >
            <Head>
                <link
                    head-key="quicksand-font"
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
                />
            </Head>

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
                } w-[308px] lg:translate-x-0 ${collapsed ? 'lg:w-24' : 'lg:w-[308px]'}`}
                style={{
                    background: 'linear-gradient(180deg, #A84848 0%, #7E2230 100%)',
                }}
            >
                {/* Sidebar Header Brand Band (aligned with top bar via gold line) */}
                <div className="flex h-[120px] shrink-0 flex-col items-center justify-center border-b-2 border-[#E9A12B] bg-black/[0.12] pl-3 pr-5 py-3 text-center overflow-hidden">
                    {collapsed ? (
                        <img
                            src="/images/usep-logo.png"
                            alt="University of Southeastern Philippines"
                            className="size-12 rounded-full object-contain"
                        />
                    ) : (
                        <div className="flex w-full items-stretch gap-2.5 text-left">
                            <img
                                src="/images/usep-logo.png"
                                alt="University of Southeastern Philippines"
                                className="size-[52px] shrink-0 self-center rounded-full object-contain"
                            />
                            <span className="w-px shrink-0 self-stretch bg-white/40" />
                            <div className="min-w-0 self-center leading-tight">
                                <div className="text-[19px] font-bold text-white whitespace-nowrap">
                                    <span className="text-[#E9A12B]">One</span> Data.{' '}
                                    <span className="text-[#E9A12B]">One</span> USeP.
                                </div>
                                <div className="mt-1 text-[12.5px] leading-snug font-semibold text-white/90">
                                    Library Collection Assessment System
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto pl-3 pr-5 py-7">
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
                                return (
                                    <li key={entry.label}>
                                        <Link
                                            href={entry.href}
                                            onClick={() => setLastClicked(entry.label)}
                                            className={`${itemBase} text-[1.05rem] font-bold ${lastClicked === entry.label ? ON : OFF} ${collapsed ? 'lg:justify-center lg:px-3' : ''}`}
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
                            const open = !!openGroups[entry.label];
                            return (
                                <li key={entry.label}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLastClicked(entry.label);
                                            setOpenGroups((g) => ({
                                                ...g,
                                                [entry.label]: !g[entry.label],
                                            }));
                                        }}
                                        className={`${itemBase} justify-between text-[1.05rem] font-bold ${lastClicked === entry.label ? ON : OFF} ${collapsed ? 'lg:justify-center lg:px-3' : ''}`}
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
                                            const childKey = `${entry.label}/${c.label}`;
                                            const cls = `block rounded-xl px-[1.125rem] py-3 text-[0.95rem] font-semibold transition hover:translate-x-1 hover:bg-white/[0.16] ${
                                                lastClicked === childKey
                                                    ? 'border-l-[3px] border-l-[#E9A12B] bg-black/25 font-bold text-white'
                                                    : 'border-l-[3px] border-l-transparent text-white/90 hover:text-white'
                                            }`;
                                            return (
                                                <li key={c.label}>
                                                    {c.href ? (
                                                        <Link
                                                            href={c.href}
                                                            onClick={() => setLastClicked(childKey)}
                                                            className={cls}
                                                        >
                                                            <span className="flex items-center justify-between gap-1.5">
                                                                <span className="truncate">{c.label}</span>
                                                                {c.label === 'Manage Users' && !canAccessUsers && (
                                                                    <Lock className="size-3.5 text-amber-300 opacity-90 shrink-0" title="Access Restricted" />
                                                                )}
                                                            </span>
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

                <div className="flex items-center justify-end border-t border-white/10 pl-5 pr-6 py-4">
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
                    collapsed ? 'lg:left-24' : 'lg:left-[308px]'
                }`}
            >
                <header
                    className={`sticky top-0 z-50 flex h-[120px] shrink-0 items-center justify-between px-7 backdrop-blur-md transition-colors ${
                        isDark
                            ? 'border-b border-white/10 bg-black/85 text-[#F5F5F5]'
                            : 'border-b border-[#E5E5E5] bg-white/95 text-[#4B5563] shadow-xs'
                    }`}
                >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                        <button
                            type="button"
                            onClick={toggleCollapse}
                            className={`hidden size-[50px] shrink-0 items-center justify-center rounded-2xl transition cursor-pointer lg:inline-flex ${
                                isDark
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-[#4B5563] hover:bg-[#F8F8F8]'
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
                                    : 'text-[#4B5563] hover:bg-[#F8F8F8]'
                            }`}
                        >
                            <Menu className="size-6" />
                        </button>

                        <div className="min-w-0 overflow-hidden border-l-[3px] border-[#E9A12B] pl-3">
                            <h1
                                className={`truncate text-[1.65rem] leading-tight font-bold max-sm:text-xl ${
                                    isDark ? 'text-white' : 'text-[#4B5563]'
                                }`}
                                style={serif}
                            >
                                {title}
                            </h1>
                            <div className="mt-1 flex items-center gap-2 text-sm max-sm:hidden">
                                {!isDashboard && (
                                    <Link
                                        href="/dashboard"
                                        className={isDark ? 'text-white/70 hover:text-white' : 'text-[#374151] hover:text-[#A04040]'}
                                    >
                                        Home
                                    </Link>
                                )}
                                {!isDashboard && (
                                    <span className={isDark ? 'text-white/60' : 'text-[#374151]'}>›</span>
                                )}
                                {trail.map((t) => (
                                    <span
                                        key={t.label}
                                        className="flex items-center gap-2"
                                    >
                                        <Link
                                            href={t.href ?? '#'}
                                            className={isDark ? 'text-white/70 hover:text-white' : 'text-[#374151] hover:text-[#A04040]'}
                                        >
                                            {t.label}
                                        </Link>
                                        <span className={isDark ? 'text-white/60' : 'text-[#374151]'}>›</span>
                                    </span>
                                ))}
                                <span
                                    className={`rounded-full px-2.5 py-0.5 font-semibold ${
                                        isDark
                                            ? 'border border-[#E9A12B]/70 bg-[#E9A12B]/15 text-white'
                                            : 'border border-[#A04040]/25 bg-[#F9EDEF] text-[#A04040]'
                                    }`}
                                >
                                    {isDashboard ? 'Home' : title}
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
                                    : 'text-[#6B7280] hover:bg-[#F8F8F8] hover:text-[#A04040]'
                            }`}
                        >
                            {isDark ? (
                                <Sun className="size-5 text-[#f0c541]" />
                            ) : (
                                <Moon className="size-5 text-[#A04040]" />
                            )}
                        </button>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setProfileOpen(false);
                                    setNotificationsOpen((o) => !o);
                                }}
                                title="Notifications"
                                aria-label="Notifications"
                                className={`relative flex size-10 items-center justify-center rounded-2xl transition-colors cursor-pointer ${
                                    isDark
                                        ? 'text-white/70 hover:bg-white/10 hover:text-white'
                                        : 'text-[#6B7280] hover:bg-[#F8F8F8] hover:text-[#A04040]'
                                }`}
                            >
                                <Bell className="size-5" />
                                {unreadNotificationsCount > 0 && (
                                    <span
                                        data-testid="notification-badge"
                                        className="absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#C44545] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-[#111111]"
                                    >
                                        {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                                    </span>
                                )}
                            </button>

                            {notificationsOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setNotificationsOpen(false)}
                                    />
                                    <div className="absolute top-[calc(100%+14px)] right-0 z-[9999] w-[320px] sm:w-[360px] overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-2xl dark:border-white/10 dark:bg-[#111111]">
                                        <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-[#F8F8F8] px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#4B5563] dark:text-white">
                                                    Notifications
                                                </span>
                                                {unreadNotificationsCount > 0 && (
                                                    <span className="rounded-full bg-[#F9EDEF] px-2 py-0.5 text-[11px] font-bold text-[#A04040] dark:bg-[#A04040]/20 dark:text-[#ffd7ba]">
                                                        {unreadNotificationsCount} unread
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {unreadNotificationsCount > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            router.post(
                                                                '/support/contact/mark-read',
                                                                {},
                                                                { preserveScroll: true },
                                                            );
                                                        }}
                                                        className="text-xs font-semibold text-[#A04040] hover:underline cursor-pointer dark:text-[#E9A12B]"
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                                {notificationItems.length > 0 && (
                                                    <button
                                                        type="button"
                                                        title="Delete all notifications"
                                                        aria-label="Delete all notifications"
                                                        onClick={() => {
                                                            router.delete('/support/contact', {
                                                                preserveScroll: true,
                                                            });
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#C44545] transition hover:bg-[#F9EDEF] cursor-pointer dark:hover:bg-[#C44545]/20"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                        <span>Clear all</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E5E5] dark:divide-white/10">
                                            {notificationItems.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-xs text-[#6B7280] dark:text-white/60">
                                                    No messages or notifications yet.
                                                </div>
                                            ) : (
                                                notificationItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={`flex items-start gap-2 px-4 py-3 transition hover:bg-[#F9EDEF]/40 dark:hover:bg-white/[0.06] ${
                                                            !item.is_read
                                                                ? 'bg-[#F9EDEF]/25 dark:bg-[#A04040]/10'
                                                                : ''
                                                        }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setNotificationsOpen(false);
                                                                const targetHref = item.href || '/support/contact?tab=inbox';
                                                                if (!item.is_read) {
                                                                    router.post(
                                                                        '/support/contact/mark-read',
                                                                        { message_id: item.id },
                                                                        {
                                                                            preserveScroll: true,
                                                                            onFinish: () => router.visit(targetHref),
                                                                        },
                                                                    );
                                                                } else {
                                                                    router.visit(targetHref);
                                                                }
                                                            }}
                                                            className="flex min-w-0 flex-1 items-start justify-between gap-2 text-left cursor-pointer"
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    {!item.is_read && (
                                                                        <span className="size-2 shrink-0 rounded-full bg-[#C44545]" />
                                                                    )}
                                                                    <span className="truncate text-xs font-bold text-[#4B5563] dark:text-white">
                                                                        {item.sender_name}
                                                                    </span>
                                                                    {item.sender_role && (
                                                                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#6B7280] dark:bg-white/10 dark:text-white/70">
                                                                            {item.sender_role}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="mt-1 truncate text-xs font-semibold text-[#A04040] dark:text-[#ffd7ba]">
                                                                    {item.subject}
                                                                </p>
                                                                <p className="mt-0.5 line-clamp-2 text-[11px] text-[#6B7280] dark:text-white/60">
                                                                    {item.message}
                                                                </p>
                                                            </div>
                                                            <span className="shrink-0 text-[10px] text-[#6B7280] dark:text-white/50">
                                                                {item.created_at}
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="Delete notification"
                                                            aria-label="Delete notification"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.delete(`/support/contact/${item.id}`, {
                                                                    preserveScroll: true,
                                                                });
                                                            }}
                                                            className="mt-0.5 shrink-0 rounded-lg p-1.5 text-[#C44545] transition hover:bg-[#F9EDEF] cursor-pointer dark:hover:bg-[#C44545]/20"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <Link
                                            href="/support/contact?tab=inbox"
                                            onClick={() => setNotificationsOpen(false)}
                                            className="block border-t border-[#E5E5E5] bg-[#F8F8F8] px-4 py-2.5 text-center text-xs font-bold text-[#A04040] transition hover:bg-[#F9EDEF] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#E9A12B] dark:hover:bg-white/10"
                                        >
                                            View All in Message Inbox
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="relative">
                            <div
                                onClick={() => {
                                    setNotificationsOpen(false);
                                    setProfileOpen((o) => !o);
                                }}
                                className={`group flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-2 transition hover:scale-[1.02] ${
                                    isDark ? 'hover:bg-white/10' : 'hover:bg-[#F8F8F8]'
                                }`}
                            >
                                <div className="text-right max-sm:hidden">
                                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-[#4B5563]'}`}>
                                        {username}
                                    </div>
                                    <div className={`text-[0.825rem] ${isDark ? 'text-[#ffd7ba]' : 'text-[#A04040]'}`}>
                                        {role}
                                    </div>
                                </div>
                                <div
                                    className="flex size-[50px] items-center justify-center rounded-2xl border-2 border-[#E9A12B] font-bold text-white transition group-hover:rotate-12"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #A04040, #8A3535)',
                                    }}
                                >
                                    {initials}
                                </div>
                                <ChevronDown
                                    className={`size-4 transition ${
                                        isDark ? 'text-white/70' : 'text-[#6B7280]'
                                    } ${profileOpen ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {profileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setProfileOpen(false)}
                                    />
                                    <div className="absolute top-[calc(100%+14px)] right-0 z-[9999] w-[260px] overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-2xl dark:border-white/10 dark:bg-[#111111]">
                                        <div
                                            className="border-b-[3px] border-[#E9A12B] px-5 py-[22px] text-center text-white"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #A04040 0%, #8A3535 100%)',
                                            }}
                                        >
                                            <div
                                                className="mx-auto mb-3 flex size-[60px] items-center justify-center rounded-full border-[3px] border-[#E9A12B] bg-white/20 text-2xl font-bold"
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
                                        <div className="py-2 text-sm text-[#4B5563] dark:text-[#F9EDEF]">
                                            <Link
                                                href="/settings/profile"
                                                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#F8F8F8] dark:hover:bg-white/10"
                                            >
                                                <User className="size-4 text-[#6B7280]" />{' '}
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/settings/appearance"
                                                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#F8F8F8] dark:hover:bg-white/10"
                                            >
                                                <Settings className="size-4 text-[#6B7280]" />{' '}
                                                Settings
                                            </Link>
                                            <div className="my-2 h-px bg-[#E5E5E5] dark:bg-white/10" />
                                            <button
                                                type="button"
                                                onClick={logout}
                                                className="flex w-full items-center gap-3 px-5 py-3 text-left text-[#C44545] transition hover:bg-[#F9EDEF] dark:hover:bg-[#C44545]/10 cursor-pointer"
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
                        className="w-full max-w-sm rounded-2xl bg-white border border-[#E5E5E5] p-6 shadow-xl text-[#4B5563] text-center relative dark:bg-[#111111] dark:border-white/10 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#F9EDEF] text-[#A04040] dark:bg-white/10 dark:text-[#E9A12B]">
                            <LogOut className="size-6" />
                        </div>
                        <h3 className="text-lg font-bold tracking-wider uppercase text-[#4B5563] dark:text-white">
                            LOG OUT
                        </h3>
                        <p className="mt-1.5 text-sm text-[#6B7280] dark:text-white/70">
                            Are you sure you want to log out?
                        </p>

                        <div className="flex items-center justify-center gap-3 pt-5 mt-4 border-t border-[#E5E5E5] dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => setShowLogoutConfirm(false)}
                                disabled={loggingOut}
                                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#4B5563] hover:bg-[#F8F8F8] transition cursor-pointer dark:text-white/80 dark:hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                disabled={loggingOut}
                                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#A04040] hover:bg-[#8A3535] text-white shadow-sm transition cursor-pointer disabled:opacity-50"
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