<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $field = $request->input('field', 'all');

        $books = Book::with(['program', 'courseSubject'])
            ->when($search, function ($query) use ($search, $field) {
                $like = "%{$search}%";

                $query->where(function ($q) use ($field, $like) {
                    $subject = fn ($s) => $s
                        ->where('subject_code', 'like', $like)
                        ->orWhere('subject_title', 'like', $like);

                    if ($field === 'title') {
                        $q->where('title', 'like', $like);
                    } elseif ($field === 'isbn') {
                        $q->where('isbn', 'like', $like);
                    } elseif ($field === 'publisher') {
                        $q->where('publisher', 'like', $like);
                    } elseif ($field === 'subject') {
                        $q->whereHas('courseSubject', $subject);
                    } else {
                        $q->where('title', 'like', $like)
                            ->orWhere('isbn', 'like', $like)
                            ->orWhere('publisher', 'like', $like)
                            ->orWhereHas('courseSubject', $subject);
                    }
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Books/Index', [
            'books' => $books,
            'filters' => [
                'search' => $search ?? '',
                'field' => $field,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Books/Create', [
            'programs' => Program::all(),
            'subjects' => CourseSubject::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'subject_id' => 'required|exists:course_subjects,id',
            'title' => 'required|string|max:300',
            'isbn' => 'nullable|string|max:20',
            'publication_year' => 'required|integer',
            'publisher' => 'required|string|max:150',
            'total_copies' => 'required|integer|min:1',
            'availability_status' => 'required|string',
        ]);

        Book::create($validated);

        return redirect()->route('books.index');
    }

    public function edit(Book $book)
    {
        return Inertia::render('Books/Update', [
            'book' => $book,
            'programs' => Program::all(),
            'subjects' => CourseSubject::all(),
        ]);
    }

    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'subject_id' => 'required|exists:course_subjects,id',
            'title' => 'required|string|max:300',
            'isbn' => 'nullable|string|max:20',
            'publication_year' => 'required|integer',
            'publisher' => 'required|string|max:150',
            'total_copies' => 'required|integer|min:1',
            'availability_status' => 'required|string',
        ]);

        $book->update($validated);

        return redirect()->route('books.index');
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return back()->with('success', 'Book deleted successfully.');
    }
}
