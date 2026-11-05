<?php

namespace App\Http\Controllers;

use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\Prospectus;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/**
 * Prospectus and course subjects, managed from inside a program.
 */
class ProgramProspectusController extends Controller
{
    private const SECTIONS = [
        'FIRST YEAR — 1st Semester',
        'FIRST YEAR — 2nd Semester',
        'SECOND YEAR — 1st Semester',
        'SECOND YEAR — 2nd Semester',
        'THIRD YEAR — 1st Semester',
        'THIRD YEAR — 2nd Semester',
        'THIRD YEAR — Summer',
        'FOURTH YEAR — 1st Semester',
        'FOURTH YEAR — 2nd Semester',
    ];

    public function show(Program $program)
    {
        $prospectus = $this->currentProspectus($program);

        $subjects = $prospectus
            ? $prospectus->courseSubjects()->orderBy('id')->get()
            : collect();

        return Inertia::render('Programs/Prospectus', [
            'program' => $program,
            'prospectus' => $prospectus,
            'subjects' => $subjects,
        ]);
    }

    public function save(Request $request, Program $program)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'academic_year' => ['required', 'string', 'regex:/^\d{4}-\d{4}$/'],
        ], [
            'academic_year.regex' => 'Use the format 2024-2025.',
        ]);

        $prospectus = $this->currentProspectus($program);

        if ($prospectus) {
            $prospectus->update($data);
        } else {
            $program->prospectuses()->create($data + ['is_active' => true]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Prospectus updated!']);

        return back();
    }

    public function storeSubject(Request $request, Program $program)
    {
        $data = $request->validate($this->subjectRules());
        $prospectus = $this->ensureProspectus($program);

        CourseSubject::create($this->subjectAttributes($data) + [
            'program_id' => $program->id,
            'prospectus_id' => $prospectus->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject added!']);

        return back();
    }

    public function updateSubject(Request $request, Program $program, CourseSubject $subject)
    {
        abort_unless((int) $subject->program_id === (int) $program->id, 404);

        $data = $request->validate($this->subjectRules());

        $subject->update($this->subjectAttributes($data));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject updated!']);

        return back();
    }

    public function destroySubject(Program $program, CourseSubject $subject)
    {
        abort_unless((int) $subject->program_id === (int) $program->id, 404);

        $subject->delete();

        Inertia::flash('toast', ['type' => 'info', 'message' => 'Subject removed.']);

        return back();
    }

    private function subjectRules(): array
    {
        return [
            'year_semester' => ['required', Rule::in(self::SECTIONS)],
            'subject_code' => ['required', 'string', 'max:50'],
            'subject_title' => ['required', 'string', 'max:200'],
            'lec_hours' => ['nullable', 'integer', 'min:0', 'max:9'],
            'lab_hours' => ['nullable', 'integer', 'min:0', 'max:9'],
            'credit_units' => ['required', 'numeric', 'min:0', 'max:9'],
            'pre_requisite' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function subjectAttributes(array $data): array
    {
        return [
            'year_semester' => $data['year_semester'],
            'subject_code' => $data['subject_code'],
            'subject_title' => $data['subject_title'],
            'lec_hours' => $data['lec_hours'] ?? 0,
            'lab_hours' => $data['lab_hours'] ?? 0,
            'credit_units' => $data['credit_units'],
            'pre_requisite' => $data['pre_requisite'] ?: 'None',
            'semester_offered' => match (true) {
                Str::contains($data['year_semester'], 'Summer') => 'Summer',
                Str::contains($data['year_semester'], '2nd Semester') => '2nd Semester',
                default => '1st Semester',
            },
        ];
    }

    /** The program's active prospectus, or its latest one. */
    private function currentProspectus(Program $program): ?Prospectus
    {
        return $program->prospectuses()
            ->orderByDesc('is_active')
            ->orderByDesc('id')
            ->first();
    }

    private function ensureProspectus(Program $program): Prospectus
    {
        return $this->currentProspectus($program)
            ?? $program->prospectuses()->create([
                'title' => $program->program_name.' Prospectus',
                'academic_year' => now()->year.'-'.(now()->year + 1),
                'is_active' => true,
            ]);
    }
}
