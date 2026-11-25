import React from 'react';
import {
    Zap,
    Database,
    Gauge,
    FileSpreadsheet,
    Lock,
    MessageSquare,
    FolderOpen,
} from 'lucide-react';
import PublicLayout, { PageHeading, InfoCard } from '@/layouts/public-layout';

const benefitsList = [
    {
        icon: Zap,
        title: 'Improved Efficiency',
        desc: 'Less manual cross-checking of holdings against program requirements.',
    },
    {
        icon: Database,
        title: 'Centralized Data Management',
        desc: 'Programs, subjects, books, and reports in one system.',
    },
    {
        icon: Gauge,
        title: 'Faster, Clearer Reporting',
        desc: 'Recency-based collection summaries are generated quickly.',
    },
    {
        icon: FileSpreadsheet,
        title: 'Organized Record-Keeping',
        desc: 'Consistent data entry reduces duplicate and inconsistent records.',
    },
    {
        icon: Lock,
        title: 'Controlled Access',
        desc: 'Role-based accounts limit who can add or edit records.',
    },
    {
        icon: MessageSquare,
        title: 'Better Communication',
        desc: 'Concerns and feedback are recorded and easy to follow up.',
    },
    {
        icon: FolderOpen,
        title: 'Accessibility and Organization',
        desc: 'Staff can easily find, update, and review academic and collection data.',
        centerCard: true,
    },
];

export default function Benefits() {
    return (
        <PublicLayout title="Benefits">
            <PageHeading>Benefits</PageHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefitsList.map((b) => (
                    <InfoCard
                        key={b.title}
                        icon={b.icon}
                        title={b.title}
                        desc={b.desc}
                        className={b.centerCard ? 'lg:col-start-2' : ''}
                    />
                ))}
            </div>
        </PublicLayout>
    );
}