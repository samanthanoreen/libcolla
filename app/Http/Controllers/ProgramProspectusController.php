<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgramSubjectRequest;
use App\Http\Requests\UpdateProgramSubjectRequest;
use App\Http\Requests\UpdateProspectusRequest;
use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\Prospectus;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Prospectus and course subjects, managed from inside a program.
 */
class ProgramProspectusController extends Controller
{
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

    public function save(UpdateProspectusRequest $request, Program $program)
    {
        $data = $request->validated();

        $prospectus = $this->currentProspectus($program);

        if ($prospectus) {
            $prospectus->update($data);
        } else {
            $program->prospectuses()->create($data + ['is_active' => true]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Prospectus updated!']);

        return back();
    }

    public function storeSubject(StoreProgramSubjectRequest $request, Program $program)
    {
        $data = $request->validated();
        $prospectus = $this->ensureProspectus($program);

        CourseSubject::create($this->subjectAttributes($data) + [
            'program_id' => $program->id,
            'prospectus_id' => $prospectus->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject added!']);

        return back();
    }

    public function updateSubject(UpdateProgramSubjectRequest $request, Program $program, CourseSubject $subject)
    {
        abort_unless((int) $subject->program_id === (int) $program->id, 404);

        $subject->update($this->subjectAttributes($request->validated()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Subject updated!']);

        return back();
    }

    public function destroySubject(Program $program, CourseSubject $subject)
    {
        abort_unless(request()->user()?->can_delete, 403, 'Unauthorized. Missing Delete permission.');

        abort_unless((int) $subject->program_id === (int) $program->id, 404);

        $subject->delete();

        Inertia::flash('toast', ['type' => 'info', 'message' => 'Subject removed.']);

        return back();
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
            'pre_requisite' => ($data['pre_requisite'] ?? null) ?: 'None',
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
