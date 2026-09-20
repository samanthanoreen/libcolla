import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function Index({ books }) {
    const handleDelete = (id) => {
        if (confirm('Delete this book record?')) {
            router.delete(`/books/${id}`);
        }
    };

    return (
        <div style={{ padding: '32px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Library Collection Books</h1>
                <Link href="/books/create" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                    + New Book
                </Link>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px' }}>Title</th>
                        <th style={{ padding: '12px' }}>ISBN</th>
                        <th style={{ padding: '12px' }}>Publisher</th>
                        <th style={{ padding: '12px' }}>Copies</th>
                        <th style={{ padding: '12px' }}>Subject</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{b.title}</td>
                            <td style={{ padding: '12px' }}>{b.isbn || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>{b.publisher}</td>
                            <td style={{ padding: '12px' }}>{b.total_copies}</td>
                            <td style={{ padding: '12px' }}>{b.course_subject?.subject_code}</td>
                            <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                <Link href={`/books/${b.id}/edit`} style={{ color: '#2563eb' }}>Edit</Link>
                                <button onClick={() => handleDelete(b.id)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}