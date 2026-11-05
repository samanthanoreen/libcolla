<?php

namespace App\Http\Controllers;

use App\Models\AssessmentReport;
use App\Models\Book;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Collection Assessment: pick a program, preview the computed report,
 * save it, then view or delete saved reports.
 */
class AssessmentReportController extends Controller
{
    public function generate(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $by = $request->input('search_by', 'college');

        $programs = Program::query()
            ->when($search !== '', function ($query) use ($search, $by) {
                $like = "%{$search}%";

                $query->where(function ($q) use ($by, $like) {
                    if ($by === 'program') {
                        $q->where('program_name', 'like', $like);
                    } elseif ($by === 'course') {
                        $q->where('program_name', 'like', $like)
                            ->orWhere('major', 'like', $like)
                            ->orWhereHas('courseSubjects', fn ($s) => $s
                                ->where('subject_code', 'like', $like)
                                ->orWhere('subject_title', 'like', $like));
                    } else {
                        $q->where('college', 'like', $like);
                    }
                });
            })
            ->orderBy('college')
            ->orderBy('program_name')
            ->orderBy('major')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Reports/Generate', [
            'programs' => $programs,
            'filters' => ['search' => $search, 'search_by' => $by],
        ]);
    }

    public function preview(Program $program)
    {
        $year = (int) date('Y');
        $books = Book::where('program_id', $program->id)->orderBy('title')->get()->groupBy('subject_id');

        $summary = [];
        $references = [];
        $recent = 0;

        $subjects = $program->courseSubjects()->orderBy('year_semester')->orderBy('subject_code')->get();

        foreach ($subjects as $subject) {
            $subjectBooks = $books->get($subject->id, collect());
            $name = $subject->subject_code.' - '.$subject->subject_title;
            $d5 = $d10 = $d20 = 0;
            $rows = [];

            foreach ($subjectBooks as $b) {
                $age = $year - (int) $b->publication_year;

                if ($age <= 5) {
                    $d5++;
                    $recent++;
                } elseif ($age <= 10) {
                    $d10++;
                } elseif ($age <= 20) {
                    $d20++;
                }

                $rows[] = [
                    'callNo' => $b->call_number_value ?? '',
                    'title' => $b->title,
                    'author' => trim(($b->author_first_name ?? '').' '.($b->author_last_name ?? '')),
                    'year' => (int) $b->publication_year,
                    'copies' => (int) $b->total_copies,
                ];
            }

            if ($rows !== []) {
                $references[] = ['subject' => $name, 'books' => $rows];
            }

            $summary[] = [
                'classification' => 'Core',
                'courseName' => $name,
                'totalT' => count($rows),
                'totalV' => array_sum(array_column($rows, 'copies')),
                'distinct5yr' => $d5,
                'distinct10yr' => $d10,
                'distinct20yr' => $d20,
            ];
        }

        return Inertia::render('Reports/Preview', [
            'program' => $program->only(['id', 'college', 'program_name', 'major']),
            'summary' => $summary,
            'references' => $references,
            'recentCount' => $recent,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_id' => ['required', 'exists:programs,id'],
            'summary' => ['required', 'array', 'min:1'],
            'summary.*.classification' => ['nullable', 'string', 'max:100'],
            'summary.*.courseName' => ['required', 'string', 'max:300'],
            'summary.*.totalT' => ['required', 'integer', 'min:0'],
            'summary.*.totalV' => ['required', 'integer', 'min:0'],
            'summary.*.distinct5yr' => ['required', 'integer', 'min:0'],
            'summary.*.distinct10yr' => ['required', 'integer', 'min:0'],
            'summary.*.distinct20yr' => ['required', 'integer', 'min:0'],
            'references' => ['present', 'array'],
            'references.*.subject' => ['required', 'string', 'max:300'],
            'references.*.books' => ['required', 'array'],
            'references.*.books.*.callNo' => ['nullable', 'string', 'max:100'],
            'references.*.books.*.title' => ['required', 'string', 'max:300'],
            'references.*.books.*.author' => ['nullable', 'string', 'max:150'],
            'references.*.books.*.year' => ['required', 'integer', 'min:0'],
            'references.*.books.*.copies' => ['required', 'integer', 'min:0'],
        ]);

        $program = Program::findOrFail($data['program_id']);

        AssessmentReport::create([
            'user_id' => $request->user()->id,
            'program_id' => $program->id,
            'college' => $program->college,
            'program_name' => $program->program_name,
            'major' => $program->major,
            'summary_data' => $data['summary'],
            'references_data' => $data['references'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Report saved successfully!']);

        return redirect()->route('reports.manage');
    }

    public function manage(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $reports = AssessmentReport::query()
            ->when($search !== '', function ($query) use ($search) {
                $like = "%{$search}%";

                $query->where(fn ($q) => $q
                    ->where('college', 'like', $like)
                    ->orWhere('program_name', 'like', $like)
                    ->orWhere('major', 'like', $like));
            })
            ->latest()
            ->paginate(15, ['id', 'college', 'program_name', 'major', 'created_at'])
            ->withQueryString();

        return Inertia::render('Reports/Manage', [
            'reports' => $reports,
            'filters' => ['search' => $search],
        ]);
    }

    public function show(AssessmentReport $report)
    {
        return Inertia::render('Reports/View', [
            'report' => [
                'id' => $report->id,
                'college' => $report->college,
                'program_name' => $report->program_name,
                'major' => $report->major,
                'created_at' => $report->created_at?->format('M d, Y h:i A'),
                'summary' => $report->summary_data ?? [],
                'references' => $report->references_data ?? [],
            ],
        ]);
    }

    public function destroy(AssessmentReport $report)
    {
        $report->delete();

        Inertia::flash('toast', ['type' => 'info', 'message' => 'Report deleted.']);

        return redirect()->route('reports.manage');
    }
}