<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use Illuminate\Database\Seeder;

/**
 * Every subject of the four prospectuses. Run ProgramSeeder and ProspectusSeeder first.
 * Safe to run more than once: existing subjects are updated, not duplicated, and any
 * books already attached to a subject are kept.
 *
 *   php artisan db:seed --class=CourseSubjectSeeder
 */
class CourseSubjectSeeder extends Seeder
{
    public function run(): void
    {
        foreach (CurriculumData::programs() as $data) {
            $program = Program::where('program_code', $data['key'])->first();
            $prospectus = $program?->prospectuses()->orderByDesc('is_active')->orderByDesc('id')->first();

            if (! $prospectus) {
                $this->command?->error("No prospectus for {$data['key']}. Run ProspectusSeeder first.");

                continue;
            }

            // Codes an earlier seed made up that are not on the printed prospectus.
            foreach ($data['renames'] as [$section, $old, $new]) {
                $row = $this->find($prospectus->id, $section, $old);

                if (! $row) {
                    continue;
                }

                $target = $this->find($prospectus->id, $section, $new);

                if ($target) {
                    $this->mergeInto($row, $target);
                } else {
                    $row->update(['subject_code' => $new]);
                }
            }

            foreach ($data['subjects'] as $s) {
                CourseSubject::updateOrCreate(
                    [
                        'prospectus_id' => $prospectus->id,
                        'year_semester' => $s['section'],
                        'subject_code' => $s['code'],
                    ],
                    [
                        'program_id' => $program->id,
                        'subject_title' => $s['title'],
                        'lec_hours' => $s['lec'],
                        'lab_hours' => $s['lab'],
                        'credit_units' => $s['units'],
                        'pre_requisite' => $s['prereq'],
                        'semester_offered' => CurriculumData::semesterOffered($s['section']),
                    ],
                );
            }

            // Placeholder subjects from an earlier seed: drop them unless a book points at them.
            foreach ($data['legacy_subjects'] as [$section, $code]) {
                $row = $this->find($prospectus->id, $section, $code);

                if ($row && ! Book::where('subject_id', $row->id)->exists()) {
                    $row->delete();
                }
            }

            // A subject saved without a year/semester that duplicates a real one: fold it in.
            CourseSubject::where('prospectus_id', $prospectus->id)
                ->whereNull('year_semester')
                ->get()
                ->each(function (CourseSubject $orphan) use ($prospectus) {
                    $real = CourseSubject::where('prospectus_id', $prospectus->id)
                        ->whereNotNull('year_semester')
                        ->where('subject_code', $orphan->subject_code)
                        ->first();

                    if ($real) {
                        $this->mergeInto($orphan, $real);
                    }
                });

            $this->command?->info("{$data['key']}: ".count($data['subjects']).' subjects.');
        }
    }

    private function find(int $prospectusId, string $section, string $code): ?CourseSubject
    {
        return CourseSubject::where('prospectus_id', $prospectusId)
            ->where('year_semester', $section)
            ->where('subject_code', $code)
            ->first();
    }

    /** Move the books over, then remove the duplicate subject. */
    private function mergeInto(CourseSubject $from, CourseSubject $to): void
    {
        Book::where('subject_id', $from->id)->update(['subject_id' => $to->id]);
        $from->delete();
    }
}
