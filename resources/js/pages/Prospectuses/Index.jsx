import { Link, router } from '@inertiajs/react';

export default function Index({ prospectuses }) {
    const handleDelete = (id) => {
        if (confirm('Delete this prospectus?')) {
            router.delete(`/prospectuses/${id}`);
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
                <h1>Curriculum Prospectuses</h1>
                <Link
                    href="/prospectuses/create"
                    style={{
                        padding: '8px 16px',
                        background: '#2563eb',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '4px',
                    }}
                >
                    + New Prospectus
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
                        <th style={{ padding: '12px' }}>Title</th>
                        <th style={{ padding: '12px' }}>Program</th>
                        <th style={{ padding: '12px' }}>Academic Year</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {prospectuses.map((p) => (
                        <tr
                            key={p.id}
                            style={{ borderBottom: '1px solid #e5e7eb' }}
                        >
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                {p.title}
                            </td>
                            <td style={{ padding: '12px' }}>
                                {p.program?.program_code}
                            </td>
                            <td style={{ padding: '12px' }}>
                                {p.academic_year}
                            </td>
                            <td
                                style={{
                                    padding: '12px',
                                    display: 'flex',
                                    gap: '10px',
                                }}
                            >
                                <Link
                                    href={`/prospectuses/${p.id}/edit`}
                                    style={{ color: '#2563eb' }}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(p.id)}
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
