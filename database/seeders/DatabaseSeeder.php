<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Prospectus;
use App\Models\CourseSubject;
use App\Models\Book;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a Program
        $program = Program::create([
            'program_code' => 'BSIT',
            'program_name' => 'BS Information Technology',
            'college' => 'CIC',
            'major' => 'BTM',
            'level' => 'Bachelor',
            'duration' => 4,
            'status' => 'active',
        ]);

        // 2. Create a Prospectus for that Program
        $prospectus = Prospectus::create([
            'program_id' => $program->id,
            'title' => 'BSIT Curriculum 2025-2026',
            'academic_year' => '2025-2026',
            'is_active' => true,
        ]);

        // 3. Create a Course Subject
        $subject = CourseSubject::create([
            'program_id' => $program->id,
            'prospectus_id' => $prospectus->id,
            'subject_code' => 'IT 228',
            'subject_title' => 'Software Engineering I',
            'credit_units' => 3.0,
            'semester_offered' => 'First',
        ]);

        // 4. Create a Book assigned to that Subject
        Book::create([
            'program_id' => $program->id,
            'subject_id' => $subject->id,
            'isbn' => '9780133943030',
            'title' => 'Software Engineering',
            'edition' => '10th',
            'publication_year' => 2020,
            'publisher' => 'Pearson',
            'total_copies' => 5,
            'availability_status' => 'Available',
            'author_first_name' => 'Ian',
            'author_last_name' => 'Sommerville',
        ]);
    }
}