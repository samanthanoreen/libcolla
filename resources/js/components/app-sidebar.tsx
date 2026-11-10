import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Database,
    FileText,
    FolderGit2,
    HelpCircle,
    LayoutGrid,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Collection Assessment',
        icon: FileText,
        items: [
            {
                title: 'Generate Report',
                href: '/reports/generate',
            },
            {
                title: 'Manage Reports',
                href: '/reports/manage',
            },
        ],
    },
    {
        title: 'Database',
        icon: Database,
        items: [
            {
                title: 'Program',
                href: '/programs',
            },
            {
                title: 'Books',
                href: '/books',
            },
        ],
    },
    {
        title: 'Tools',
        icon: Wrench,
        items: [],
    },
    {
        title: 'Support',
        icon: HelpCircle,
        items: [],
    },
    {
        title: 'Users',
        icon: Users,
        items: [
            {
                title: 'Manage Users',
                href: '/users/manage',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
