import React from 'react';
import PublicLayout, { PageHeading, InfoCard } from '@/layouts/public-layout';

const stepsList = [
    {
        num: 1,
        title: 'Login',
        desc: 'Sign in with your credentials and role.',
    },
    {
        num: 2,
        title: 'Set Up Academic Data',
        desc: 'Add academic programs and their course subjects.',
    },
    {
        num: 3,
        title: 'Build the Book Catalog',
        desc: 'Add book records and link them to programs and subjects.',
    },
    {
        num: 4,
        title: 'Run a Collection Assessment',
        desc: 'Select a program and generate a report of titles, volumes, and recency per subject.',
    },
    {
        num: 5,
        title: 'Review and Refine',
        desc: 'Review and edit the report, then export or download it.',
    },
    {
        num: 6,
        title: 'Manage and Communicate',
        desc: 'Manage reports and users, and send feedback through the contact page.',
    },
];

export default function HowItWorks() {
    return (
        <PublicLayout title="How It Works">
            <PageHeading>How It Works</PageHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stepsList.map((s) => (
                    <InfoCard key={s.num} num={s.num} title={s.title} desc={s.desc} />
                ))}
            </div>
        </PublicLayout>
    );
}