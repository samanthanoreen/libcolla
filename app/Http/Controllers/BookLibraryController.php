<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
        $filter = $request->input('filter', '');
        $currentYear = (int) date('Y');
        $perPage = in_array((int) $request->input('per_page'), [10, 15, 25, 50], true)
            ? (int) $request->input('per_page')
            : 15;

        $booksOver2YearsCount = Book::where(function ($q) use ($currentYear) {
            $q->whereNull('publication_year')
              ->orWhere('publication_year', '<', $currentYear - 2);
        })->count();

        $isFiltered = in_array($filter, ['over_2_years', 'past_2_years', 'past_1_year'], true);

        $filteredBooks = null;
        if ($isFiltered) {
            $cutoff = ($filter === 'past_1_year') ? $currentYear : ($currentYear - 2);
            $filteredBooks = Book::with(['program', 'courseSubject'])
                ->where(function ($q) use ($cutoff) {
                    $q->whereNull('publication_year')
                      ->orWhere('publication_year', '<', $cutoff);
                })
                ->when($search !== '', function ($query) use ($search, $field) {
                    $like = "%{$search}%";
                    $query->where(function ($q) use ($field, $like) {
                        if ($field === 'title') {
                            $q->where('title', 'like', $like);
                        } elseif ($field === 'author') {
                            $q->where('author_first_name', 'like', $like)
                                ->orWhere('author_last_name', 'like', $like);
                        } elseif ($field === 'call_no') {
                            $q->where('call_number_value', 'like', $like);
                        } elseif ($field === 'program') {
                            $q->whereHas('program', fn ($p) => $p->where('program_name', 'like', $like)->orWhere('program_code', 'like', $like));
                        } else {
                            $q->where('title', 'like', $like)
                                ->orWhere('author_first_name', 'like', $like)
                                ->orWhere('author_last_name', 'like', $like)
                                ->orWhere('call_number_value', 'like', $like)
                                ->orWhere('isbn', 'like', $like)
                                ->orWhereHas('program', fn ($p) => $p->where('program_name', 'like', $like)->orWhere('program_code', 'like', $like))
                                ->orWhereHas('courseSubject', fn ($s) => $s->where('subject_code', 'like', $like)->orWhere('subject_title', 'like', $like));
                        }
                    });
                })
                ->orderBy('publication_year', 'desc')
                ->orderBy('title')
                ->paginate($perPage)
                ->withQueryString();
        }

        $programs = Program::query()
            ->withCount(['courseSubjects', 'books'])
            ->withSum('books', 'total_copies')
            ->when($search !== '' && !$isFiltered, function ($query) use ($search, $field) {
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
            'filteredBooks' => $filteredBooks,
            'currentYear' => $currentYear,
            'booksOver2YearsCount' => $booksOver2YearsCount,
            'booksPast1YearCount' => $booksOver2YearsCount,
            'filters' => [
                'search' => $search,
                'field' => $field,
                'filter' => $filter,
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
        return Inertia::render('Books/Programs', [
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
        abort_unless($request->user()?->can_add, 403, 'Unauthorized. Missing Add permission.');

        $data = $request->validate([
            'program_id' => ['required', 'exists:programs,id'],
            'subject_id' => [
                'required',
                Rule::exists('course_subjects', 'id')->where('program_id', $request->input('program_id')),
            ],
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
        abort_unless($request->user()?->can_edit, 403, 'Unauthorized. Missing Edit permission.');

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
        abort_unless(request()->user()?->can_delete, 403, 'Unauthorized. Missing Delete permission.');

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