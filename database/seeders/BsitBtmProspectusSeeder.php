<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\CourseSubject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Fills the BSIT (Business Technology Management) program with its full prospectus.
 * Safe to run more than once: existing subjects are updated, not duplicated.
 *
 *   php artisan db:seed --class=BsitBtmProspectusSeeder
 */
class BsitBtmProspectusSeeder extends Seeder
{
    private const TITLE = 'BSIT-BTM Prospectus — CMO No. 25 s.2015, Revised BOR Res. No. 75 s.2019, Effective SY 2018-2019';

    private const ACADEMIC_YEAR = '2018-2019';

    public function run(): void
    {
        $program = Program::where(function ($q) {
            $q->where('program_name', 'Bachelor of Science in Information Technology')
              ->orWhere('program_name', 'BS Information Technology')
              ->orWhere('program_code', 'BSIT');
        })->first();

        if (! $program) {
            $this->command?->error('BSIT - Business Technology Management program not found. Add it on the Program page first.');

            return;
        }

        $prospectus = $program->prospectuses()->latest('id')->first();

        if ($prospectus) {
            $prospectus->update(['title' => self::TITLE, 'academic_year' => self::ACADEMIC_YEAR, 'is_active' => true]);
        } else {
            $prospectus = $program->prospectuses()->create([
                'title' => self::TITLE,
                'academic_year' => self::ACADEMIC_YEAR,
                'is_active' => true,
            ]);
        }

        foreach ($this->subjects() as [$section, $code, $title, $lec, $lab, $units, $prereq]) {
            CourseSubject::updateOrCreate(
                [
                    'prospectus_id' => $prospectus->id,
                    'year_semester' => $section,
                    'subject_code' => $code,
                ],
                [
                    'program_id' => $program->id,
                    'subject_title' => $title,
                    'lec_hours' => $lec,
                    'lab_hours' => $lab,
                    'credit_units' => $units,
                    'pre_requisite' => $prereq,
                    'semester_offered' => match (true) {
                        Str::contains($section, 'Summer') => 'Summer',
                        Str::contains($section, '2nd Semester') => '2nd Semester',
                        default => '1st Semester',
                    },
                ],
            );
        }

        $this->command?->info('BSIT-BTM prospectus ready: '.count($this->subjects()).' subjects.');
    }

    /** [section, code, title, lec, lab, units, pre-requisite] */
    private function subjects(): array
    {
        return [
            ['FIRST YEAR — 1st Semester', 'GE 111', 'Purposive Communication', 3, 0, 3, 'None'],
            ['FIRST YEAR — 1st Semester', 'GE 112', 'Mathematics in the Modern World', 3, 0, 3, 'None'],
            ['FIRST YEAR — 1st Semester', 'IC 111', 'Programming Paradigm 1', 2, 1, 3, 'None'],
            ['FIRST YEAR — 1st Semester', 'IC 112', 'Professional Ethics in Computing', 3, 0, 3, 'None'],
            ['FIRST YEAR — 1st Semester', 'IC 113', 'Probability and Statistics for Computing', 3, 0, 3, 'None'],
            ['FIRST YEAR — 1st Semester', 'PE 111', 'Movement Enhancement', 0, 2, 2, 'None'],
            ['FIRST YEAR — 1st Semester', 'NSTP 111', 'National Service Training Program', 3, 0, 3, 'None'],
            ['FIRST YEAR — 2nd Semester', 'GE 113', 'Understanding the Self', 3, 0, 3, 'None'],
            ['FIRST YEAR — 2nd Semester', 'GE 114', 'Ethics', 3, 0, 3, 'None'],
            ['FIRST YEAR — 2nd Semester', 'IC 124', 'Programming Paradigm 2', 2, 1, 3, 'IC 111'],
            ['FIRST YEAR — 2nd Semester', 'IC 125', 'Discrete Math', 3, 0, 3, 'IC 113'],
            ['FIRST YEAR — 2nd Semester', 'IC 126', 'Interaction Design', 2, 1, 3, 'None'],
            ['FIRST YEAR — 2nd Semester', 'IT 121', 'Technopreneurship', 3, 0, 3, 'IC 112'],
            ['FIRST YEAR — 2nd Semester', 'PE 122', 'Fitness Exercise', 0, 2, 2, 'None'],
            ['FIRST YEAR — 2nd Semester', 'NSTP 122', 'National Service Training Program', 3, 0, 3, 'None'],
            ['SECOND YEAR — 1st Semester', 'GE 215', 'The Life and Works of Rizal', 3, 0, 3, 'None'],
            ['SECOND YEAR — 1st Semester', 'GE 216', 'Readings in Philippine History', 3, 0, 3, 'None'],
            ['SECOND YEAR — 1st Semester', 'IC 217', 'Data Structures', 2, 1, 3, 'IC 124, IC 125'],
            ['SECOND YEAR — 1st Semester', 'IT 212', 'IT Project Management', 3, 0, 3, 'IT 121'],
            ['SECOND YEAR — 1st Semester', 'IT 213', 'Information Management', 2, 1, 3, 'IC 124'],
            ['SECOND YEAR — 1st Semester', 'IT 214', 'Applied Computer Networks', 2, 1, 3, 'IC 125'],
            ['SECOND YEAR — 1st Semester', 'PE 213', 'Physical Activities Towards Health & Fitness I', 0, 2, 2, 'None'],
            ['SECOND YEAR — 2nd Semester', 'GE 217', 'Science, Technology and Society', 3, 0, 3, 'None'],
            ['SECOND YEAR — 2nd Semester', 'GE 218', 'Arts Appreciation', 3, 0, 3, 'None'],
            ['SECOND YEAR — 2nd Semester', 'IT 225', 'Applied Operating System', 2, 1, 3, 'IC 217'],
            ['SECOND YEAR — 2nd Semester', 'IT 226', 'Application Systems Development', 2, 1, 3, 'IT 213, IT 214'],
            ['SECOND YEAR — 2nd Semester', 'IT 227', 'Advanced Information Management', 2, 1, 3, 'IC 217, IT 213'],
            ['SECOND YEAR — 2nd Semester', 'IT 228', 'Software Engineering 1', 3, 0, 3, 'IT 212, IC 126'],
            ['SECOND YEAR — 2nd Semester', 'PE 224', 'Physical Activities Towards Health & Fitness II', 0, 2, 2, 'None'],
            ['THIRD YEAR — 1st Semester', 'EGE 311', 'General Education Elective 1', 3, 0, 3, 'None'],
            ['THIRD YEAR — 1st Semester', 'GE 319', 'Contemporary World', 3, 0, 3, 'None'],
            ['THIRD YEAR — 1st Semester', 'ITBTM 311', 'Introduction to Business Technology Management', 3, 0, 3, 'IT 226, IT 227'],
            ['THIRD YEAR — 1st Semester', 'ITBTM 312', 'IT Accounting', 3, 0, 3, 'IT 228'],
            ['THIRD YEAR — 1st Semester', 'ITBTM 313', 'Marketing Principles', 3, 0, 3, 'None'],
            ['THIRD YEAR — 1st Semester', 'ITBTM 314', 'Enterprise Resource Planning', 2, 1, 3, 'IT 227'],
            ['THIRD YEAR — 1st Semester', 'IT 319', 'Software Engineering 2', 2, 1, 3, 'IT 228, IT 225'],
            ['THIRD YEAR — 1st Semester', 'ICE 311', 'Professional Elective 1', 3, 0, 3, 'All prior Professional & Common Courses'],
            ['THIRD YEAR — 2nd Semester', 'EGE 312', 'General Education Elective 2', 3, 0, 3, 'None'],
            ['THIRD YEAR — 2nd Semester', 'EGE 313', 'General Education Elective 3', 3, 0, 3, 'None'],
            ['THIRD YEAR — 2nd Semester', 'ITBTM 325', 'E-Commerce', 2, 1, 3, 'ITBTM 312, ITBTM 314'],
            ['THIRD YEAR — 2nd Semester', 'ITBTM 326', 'Advanced Technopreneurship', 3, 0, 3, 'ITBTM 311, ITBTM 313'],
            ['THIRD YEAR — 2nd Semester', 'ITBTM 327', 'Business Analytics', 2, 1, 3, 'ITBTM 311, ITBTM 312, ITBTM 313'],
            ['THIRD YEAR — 2nd Semester', 'ICE 322', 'Professional Elective 2', 3, 0, 3, 'All prior Professional & Common Courses'],
            ['THIRD YEAR — 2nd Semester', 'ICE 323', 'Professional Elective 3', 3, 0, 3, 'All prior Professional & Common Courses'],
            ['THIRD YEAR — 2nd Semester', 'IT 3210', 'IT Research Paradigm', 3, 0, 3, 'IT 319'],
            ['THIRD YEAR — Summer', 'ITCP 400', 'IT Capstone Project*', 0, 2, 2, 'IT 3210'],
            ['THIRD YEAR — Summer', 'ITPR 401', 'IT Practicum*', 0, 5, 5, 'All prior Professional & Common Courses'],
            ['FOURTH YEAR — 1st Semester', 'ITPR 402', 'IT Practicum', 0, 4, 4, 'All prior Professional & Common Courses'],
            ['FOURTH YEAR — 1st Semester', 'ICE 414', 'Professional Elective 4', 3, 0, 3, 'All prior Professional & Common Courses'],
            ['FOURTH YEAR — 1st Semester', 'ICE 415', 'Professional Elective 5', 3, 0, 3, 'All prior Professional & Common Courses'],
            ['FOURTH YEAR — 1st Semester', 'ITCP 401', 'IT Capstone Project*', 0, 2, 2, 'IT 3210'],
            ['FOURTH YEAR — 2nd Semester', 'ITCP 402b', 'IT Capstone Project', 0, 2, 2, 'IT 3210'],
            ['FOURTH YEAR — 2nd Semester', 'IT 4211', 'IPR Management', 3, 0, 3, 'All prior Professional & Common Courses'],
        ];
    }
}