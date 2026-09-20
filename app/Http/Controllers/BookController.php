<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Program;
use App\Models\CourseSubject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index()
    {
        return Inertia::render('Books/Index', [
            'books' => Book::with(['program', 'courseSubject'])->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Books/Create', [
            'programs' => Program::all(),
            'subjects' => CourseSubject::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id'          => 'required|exists:programs,id',
            'subject_id'          => 'required|exists:course_subjects,id',
            'title'               => 'required|string|max:300',
            'isbn'                => 'nullable|string|max:20',
            'publication_year'    => 'required|integer',
            'publisher'           => 'required|string|max:150',
            'total_copies'        => 'required|integer|min:1',
            'availability_status' => 'required|string',
        ]);

        Book::create($validated);

        return redirect()->route('books.index');
    }

    public function edit(Book $book)
    {
        return Inertia::render('Books/Update', [
            'book'     => $book,
            'programs' => Program::all(),
            'subjects' => CourseSubject::all()
        ]);
    }

    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'program_id'          => 'required|exists:programs,id',
            'subject_id'          => 'required|exists:course_subjects,id',
            'title'               => 'required|string|max:300',
            'isbn'                => 'nullable|string|max:20',
            'publication_year'    => 'required|integer',
            'publisher'           => 'required|string|max:150',
            'total_copies'        => 'required|integer|min:1',
            'availability_status' => 'required|string',
        ]);

        $book->update($validated);

        return redirect()->route('books.index');
    }

    public function destroy(Book $book)
    {
        $book->delete();
        return redirect()->route('books.index');
    }
}