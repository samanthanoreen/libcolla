import React from 'react';
import {
    ShieldCheck,
    LayoutDashboard,
    GraduationCap,
    BookOpen,
    BookMarked,
    PieChart,
    FileSpreadsheet,
    Users,
    Mail,
} from 'lucide-react';
import PublicLayout, { PageHeading, InfoCard } from '@/layouts/public-layout';

const featuresList = [
    {
        icon: ShieldCheck,
        title: 'Secure Role-Based Login',
        desc: 'Access is limited to authorized users based on their role.',
    },
    {
        icon: LayoutDashboard,
        title: 'Dashboard Overview',
        desc: 'A quick view of key system data and links to each module.',
    },
    {
        icon: GraduationCap,
        title: 'Program Management',
        desc: 'Add, edit, and organize academic programs by college.',
    },
    {
        icon: BookOpen,
        title: 'Prospectus & Course Subject Management',
        desc: 'View subjects by year and semester and download a PDF prospectus.',
    },
    {
        icon: BookMarked,
        title: 'Book Catalog Management',
        desc: 'Manage book records linked to programs and subjects.',
    },
    {
        icon: PieChart,
        title: 'Collection Assessment & Reporting',
        desc: 'Count titles and volumes per subject, grouped by recency (5, 10, or 20 years).',
    },
    {
        icon: FileSpreadsheet,
        title: 'Report Generation & Management',
        desc: 'Generate, review, edit, and export assessment reports.',
    },
    {
        icon: Users,
        title: 'User Management',
        desc: 'Add and manage user accounts and roles.',
    },
    {
        icon: Mail,
        title: 'Contact & Messaging',
        desc: 'Send concerns or feedback to administrators.',
    },
];

export default function Features() {
    return (
        <PublicLayout title="Features">
            <PageHeading>Features</PageHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuresList.map((f) => (
                    <InfoCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
                ))}
            </div>
        </PublicLayout>
    );
}