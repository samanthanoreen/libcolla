import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

type BaseNavItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};

export type NavSubItem = BaseNavItem & {
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = BaseNavItem & {
    items?: NavSubItem[];
};
