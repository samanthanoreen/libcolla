import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function Index({ programs }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this program?')) {
            router.delete(`/programs/${id}`);
        }
    };

    return (
        <div style={{ padding: '32px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Academic Programs</h1>
                <Link href="/programs/create" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                    + New Program
                </Link>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px' }}>Code</th>
                        <th style={{ padding: '12px' }}>Name</th>
                        <th style={{ padding: '12px' }}>College</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.program_code}</td>
                            <td style={{ padding: '12px' }}>{p.program_name}</td>
                            <td style={{ padding: '12px' }}>{p.college}</td>
                            <td style={{ padding: '12px' }}>{p.status}</td>
                            <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                <Link href={`/programs/${p.id}/edit`} style={{ color: '#2563eb' }}>Edit</Link>
                                <button onClick={() => handleDelete(p.id)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}