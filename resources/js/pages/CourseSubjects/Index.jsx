import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function Index({ subjects }) {
    const handleDelete = (id) => {
        if (confirm('Delete this course subject?')) {
            router.delete(`/course-subjects/${id}`);
        }
    };

    return (
        <div
            style={{
                padding: '32px',
                fontFamily: 'sans-serif',
                maxWidth: '1000px',
                margin: '0 auto',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                <h1>Course Subjects</h1>
                <Link
                    href="/course-subjects/create"
                    style={{
                        padding: '8px 16px',
                        background: '#2563eb',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '4px',
                    }}
                >
                    + New Subject
                </Link>
            </div>

            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                }}
            >
                <thead>
                    <tr
                        style={{
                            background: '#f3f4f6',
                            borderBottom: '2px solid #e5e7eb',
                        }}
                    >
                        <th style={{ padding: '12px' }}>Code</th>
                        <th style={{ padding: '12px' }}>Title</th>
                        <th style={{ padding: '12px' }}>Units</th>
                        <th style={{ padding: '12px' }}>Program</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((s) => (
                        <tr
                            key={s.id}
                            style={{ borderBottom: '1px solid #e5e7eb' }}
                        >
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                {s.subject_code}
                            </td>
                            <td style={{ padding: '12px' }}>
                                {s.subject_title}
                            </td>
                            <td style={{ padding: '12px' }}>
                                {s.credit_units}
                            </td>
                            <td style={{ padding: '12px' }}>
                                {s.program?.program_code}
                            </td>
                            <td
                                style={{
                                    padding: '12px',
                                    display: 'flex',
                                    gap: '10px',
                                }}
                            >
                                <Link
                                    href={`/course-subjects/${s.id}/edit`}
                                    style={{ color: '#2563eb' }}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    style={{
                                        color: '#dc2626',
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
