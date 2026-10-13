import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import React from 'react';

export default function Index({ programs, filters = {} }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        field: filters.field || 'all',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get('/programs', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this program?')) {
            router.delete(`/programs/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Academic Programs
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage university programs and academic departments.
                        </p>
                    </div>
                    <Link
                        href="/programs/create"
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        + ADD PROGRAM
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search programs..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
                    />

                    <select
                        value={data.field}
                        onChange={(e) => setData('field', e.target.value)}
                        className="rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
                    >
                        <option value="all">All Fields</option>
                        <option value="college">College</option>
                        <option value="name">Program Name</option>
                        <option value="major">Major / Track</option>
                    </select>

                    <button
                        type="submit"
                        className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        SEARCH
                    </button>
                </form>

                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead className="border-b bg-slate-100">
                            <tr>
                                <th className="p-3 font-semibold text-slate-700">COLLEGE</th>
                                <th className="p-3 font-semibold text-slate-700">PROGRAM NAME</th>
                                <th className="p-3 font-semibold text-slate-700">MAJOR / TRACK</th>
                                <th className="p-3 font-semibold text-slate-700">LEVEL</th>
                                <th className="p-3 text-right font-semibold text-slate-700">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {programs?.data && programs.data.length > 0 ? (
                                programs.data.map((program) => (
                                    <tr key={program.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-medium text-slate-900">
                                            {program.college}
                                        </td>
                                        <td className="p-3 text-slate-700">
                                            {program.name || '-'}
                                        </td>
                                        <td className="p-3 text-slate-700">
                                            {program.major || '-'}
                                        </td>
                                        <td className="p-3 text-slate-700">{program.level}</td>
                                        <td className="space-x-2 p-3 text-right">
                                            <Link
                                                href={`/programs/${program.id}/edit`}
                                                className="px-2 py-1 text-xs font-medium text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(program.id)}
                                                className="px-2 py-1 text-xs font-medium text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-500">
                                        No programs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {programs?.links && programs.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 pt-2">
                        {programs.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-md border px-3 py-1 text-xs transition ${
                                    link.active
                                        ? 'bg-slate-900 font-bold text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}