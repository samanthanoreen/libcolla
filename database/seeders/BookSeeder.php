<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use Illuminate\Database\Seeder;

/**
 * Two dummy books for every subject of every program (about 428 records).
 * Each description starts with "[DUMMY]" so they are easy to find and remove:
 *
 *   Book::where('description', 'like', '[DUMMY]%')->delete();
 *
 * Run the curriculum seeders first. Safe to run more than once (matched by ISBN).
 *
 *   php artisan db:seed --class=BookSeeder
 */
class BookSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [];
        $subjects = [];

        foreach (Program::all() as $program) {
            $programs[$program->program_code] = $program;
        }

        $created = 0;

        foreach (CurriculumData::books() as $b) {
            $program = $programs[$b['program']] ?? null;

            if (! $program) {
                continue;
            }

            if (! isset($subjects[$b['program']])) {
                $prospectus = $program->prospectuses()->orderByDesc('is_active')->orderByDesc('id')->first();

                $subjects[$b['program']] = $prospectus
                    ? CourseSubject::where('prospectus_id', $prospectus->id)->get()
                        ->mapWithKeys(fn ($s) => [$s->year_semester.'|'.$s->subject_code => $s->id])
                        ->all()
                    : [];
            }

            $subjectId = $subjects[$b['program']][$b['section'].'|'.$b['code']] ?? null;

            if (! $subjectId) {
                continue;
            }

            $attributes = collect($b)->except(['program', 'section', 'code', 'isbn'])->all()
                + ['program_id' => $program->id, 'subject_id' => $subjectId];

            Book::updateOrCreate(['isbn' => $b['isbn']], $attributes);
            $created++;
        }

        $this->command?->info("Dummy books ready: {$created}.");
    }
}
