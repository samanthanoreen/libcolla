import React from 'react';
import { Link } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const cardStyle = {
        padding: '24px',
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
    };

    return (
        <div style={{ padding: '32px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>LibColla Management Dashboard</h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>Overview of academic curriculum and library holdings.</p>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>Academic Programs</span>
                    <span style={{ fontSize: '36px', fontWeight: 'bold', margin: '12px 0', color: '#111827' }}>{stats?.total_programs || 0}</span>
                    <Link href="/programs" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                        Manage Programs &rarr;
                    </Link>
                </div>

                <div style={cardStyle}>
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>Curriculum Prospectuses</span>
                    <span style={{ fontSize: '36px', fontWeight: 'bold', margin: '12px 0', color: '#111827' }}>{stats?.total_prospectuses || 0}</span>
                    <Link href="/prospectuses" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                        Manage Prospectuses &rarr;
                    </Link>
                </div>

                <div style={cardStyle}>
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>Course Subjects</span>
                    <span style={{ fontSize: '36px', fontWeight: 'bold', margin: '12px 0', color: '#111827' }}>{stats?.total_subjects || 0}</span>
                    <Link href="/course-subjects" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                        Manage Subjects &rarr;
                    </Link>
                </div>

                <div style={cardStyle}>
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>Library Books</span>
                    <span style={{ fontSize: '36px', fontWeight: 'bold', margin: '12px 0', color: '#111827' }}>{stats?.total_books || 0}</span>
                    <Link href="/books" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                        Manage Books &rarr;
                    </Link>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link href="/programs/create" style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                        + Add Program
                    </Link>
                    <Link href="/prospectuses/create" style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                        + Add Prospectus
                    </Link>
                    <Link href="/course-subjects/create" style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                        + Add Course Subject
                    </Link>
                    <Link href="/books/create" style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                        + Add Book
                    </Link>
                </div>
            </div>
        </div>
    );
}