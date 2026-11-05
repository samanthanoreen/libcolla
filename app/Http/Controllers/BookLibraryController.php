<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Program Library (list of programs) and the per-program book records page.
 * The PHP version stored call_no / author / publish_year / copies, so those four
 * form fields are mapped onto the Laravel columns here.
 */
class BookLibraryController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $field = $request->input('field', 'all');
        $perPage = in_array((int) $request->input('per_page'), [10, 15, 25, 50], true)
            ? (int) $request->input('per_page')
            : 15;

        $programs = Program::query()
            ->when($search !== '', function ($query) use ($search, $field) {
                $like = "%{$search}%";

                $query->where(function ($q) use ($field, $like) {
                    if ($field === 'college') {
                        $q->where('college', 'like', $like);
                    } elseif ($field === 'program') {
                        $q->where('program_name', 'like', $like);
                    } else {
                        $q->where('college', 'like', $like)
                            ->orWhere('program_name', 'like', $like)
                            ->orWhere('major', 'like', $like);
                    }
                });
            })
            ->orderBy('college')
            ->orderBy('program_name')
            ->orderBy('major')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Books/Index', [
            'programs' => $programs,
            'filters' => [
                'search' => $search,
                'field' => $field,
                'per_page' => $perPage,
            ],
            // for the Add Book modal
            'allPrograms' => Program::orderBy('program_name')->orderBy('major')
                ->get(['id', 'program_code', 'program_name', 'major']),
            'subjects' => CourseSubject::orderBy('subject_code')
                ->get(['id', 'program_id', 'subject_code', 'subject_title']),
        ]);
    }

    public function program(Program $program)
    {
        return Inertia::render('Books/Program', [
            'program' => $program->only(['id', 'program_code', 'college', 'program_name', 'major']),
            'subjects' => $program->courseSubjects()
                ->orderBy('year_semester')
                ->orderBy('subject_code')
                ->get(['id', 'subject_code', 'subject_title']),
            'books' => Book::where('program_id', $program->id)
                ->orderBy('title')
                ->get()
                ->map(fn (Book $b) => $this->present($b))
                ->values(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_id' => ['required', 'exists:programs,id'],
            'subject_id' => ['required', 'exists:course_subjects,id'],
        ] + $this->rules());

        Book::create([
            'program_id' => $data['program_id'],
            'subject_id' => $data['subject_id'],
            'title' => $data['title'],
            'call_number_value' => $data['call_no'],
            'publication_year' => $data['year'],
            'total_copies' => $data['copies'],
            'publisher' => '',
        ] + $this->authorColumns($data['author']));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Book added successfully!']);

        return back();
    }

    public function update(Request $request, Book $book)
    {
        $data = $request->validate($this->rules());

        $book->update([
            'title' => $data['title'],
            'call_number_value' => $data['call_no'],
            'publication_year' => $data['year'],
            'total_copies' => $data['copies'],
        ] + $this->authorColumns($data['author']));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Book updated successfully!']);

        return back();
    }

    public function destroy(Book $book)
    {
        $book->delete();

        Inertia::flash('toast', ['type' => 'info', 'message' => 'Book deleted successfully!']);

        return back();
    }

    private function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:300'],
            'call_no' => ['required', 'string', 'max:50'],
            'author' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1000', 'max:'.(date('Y') + 1)],
            'copies' => ['required', 'integer', 'min:1'],
        ];
    }

    /** Keeps the single "Author" field in the two author columns (first names / last word). */
    private function authorColumns(string $author): array
    {
        $author = trim(preg_replace('/\s+/', ' ', $author));
        $pos = strrpos($author, ' ');

        return [
            'author_first_name' => $pos === false ? null : mb_substr(substr($author, 0, $pos), 0, 50),
            'author_last_name' => mb_substr($pos === false ? $author : substr($author, $pos + 1), 0, 50),
        ];
    }

    private function present(Book $b): array
    {
        return [
            'id' => $b->id,
            'subject_id' => $b->subject_id,
            'call_no' => $b->call_number_value ?? '',
            'title' => $b->title,
            'author' => trim(($b->author_first_name ?? '').' '.($b->author_last_name ?? '')),
            'year' => $b->publication_year,
            'copies' => $b->total_copies,
        ];
    }
}
