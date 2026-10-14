import { Link, router, useForm } from '@inertiajs/react';
import { BookOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ books, filters = {} }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        field: filters.field || 'all',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get('/books', { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this book?')) {
            router.delete(`/books/${id}`, { preserveScroll: true });
        }
    };

    const rows = books?.data ?? [];

    return (
        <div className="p-6 md:p-10">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                {/* Card header */}
                <div className="flex items-center justify-between border-b border-border px-8 py-6">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                        <BookOpen className="size-6" />
                        Library Collection Books
                    </h1>
                    <Link
                        href="/books/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-bold tracking-wide text-primary-foreground transition hover:bg-primary/90"
                    >
                        <Plus className="size-4" />
                        ADD BOOK
                    </Link>
                </div>

                <div className="space-y-5 p-8">
                    {/* Search panel */}
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 p-5"
                    >
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="min-w-[200px] flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                        />
                        <select
                            value={data.field}
                            onChange={(e) => setData('field', e.target.value)}
                            className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                        >
                            <option value="all">All Fields</option>
                            <option value="title">Title</option>
                            <option value="isbn">ISBN</option>
                            <option value="publisher">Publisher</option>
                            <option value="subject">Subject</option>
                        </select>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-xs font-bold tracking-wide text-primary-foreground transition hover:bg-primary/90"
                        >
                            <Search className="size-4" />
                            SEARCH
                        </button>
                    </form>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="px-4 py-3 font-bold">Title</th>
                                    <th className="px-4 py-3 font-bold">ISBN</th>
                                    <th className="px-4 py-3 font-bold">Publisher</th>
                                    <th className="px-4 py-3 font-bold">Copies</th>
                                    <th className="px-4 py-3 font-bold">Subject</th>
                                    <th className="px-4 py-3 font-bold">Status</th>
                                    <th className="px-4 py-3 font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {rows.length > 0 ? (
                                    rows.map((book) => (
                                        <tr key={book.id} className="transition hover:bg-muted/50">
                                            <td className="px-4 py-4 font-medium text-foreground">
                                                {book.title}
                                            </td>
                                            <td className="px-4 py-4 text-foreground">{book.isbn || '-'}</td>
                                            <td className="px-4 py-4 text-foreground">{book.publisher}</td>
                                            <td className="px-4 py-4 text-foreground">{book.total_copies}</td>
                                            <td className="px-4 py-4 text-foreground">
                                                {book.course_subject?.subject_code || '-'}
                                            </td>
                                            <td className="px-4 py-4 text-foreground">
                                                {book.availability_status || '-'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/books/${book.id}/edit`}
                                                        title="Edit"
                                                        className="rounded-md bg-muted p-2 text-foreground transition hover:bg-accent"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        onClick={() => handleDelete(book.id)}
                                                        className="rounded-md bg-muted p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                            No books found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {books?.links && books.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1 pt-2">
                            {books.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-md border px-3 py-1.5 text-xs transition ${
                                        link.active
                                            ? 'border-primary bg-primary font-bold text-primary-foreground'
                                            : 'bg-background text-foreground hover:bg-muted'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}