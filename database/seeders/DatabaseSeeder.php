<?php

namespace Database\Seeders;

use App\Models\AssessmentReport;
use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed System Users (Librarian, Staff, Program Head)
        $librarian = User::updateOrCreate(
            ['email' => 'samana@gmail.com'],
            [
                'name' => 'Samana Celest',
                'full_name' => 'Samana Celest',
                'username' => 'samanacele',
                'role' => 'librarian',
                'password' => Hash::make('samana123'),
            ]
        );

        $staff = User::updateOrCreate(
            ['email' => 'jaelbohol@gmail.com'],
            [
                'name' => 'jelly',
                'full_name' => 'Jael Bohol',
                'username' => 'jelly',
                'role' => 'staff',
                'password' => Hash::make('samana123'),
            ]
        );

        // 2. Seed the four CIC programs, their prospectuses and every subject
        //    (BSIT-BTM, BSIT-IS, BSCS, BLIS), then two dummy books per subject.
        $this->call([
            ProgramSeeder::class,
            ProspectusSeeder::class,
            CourseSubjectSeeder::class,
            BookSeeder::class,
        ]);

        $bsit = Program::where('program_code', 'BSIT-BTM')->firstOrFail();
        $btmProspectus = $bsit->prospectuses()->orderByDesc('is_active')->orderByDesc('id')->first();

        // 3. Seed Core Library Books (BSIT-BTM subjects). Scoped to the BTM prospectus,
        //    because BSIT-IS and BSCS share codes such as IC 111.
        $subject = fn (string $code) => CourseSubject::where('prospectus_id', $btmProspectus->id)
            ->where('subject_code', $code)
            ->first();

        $softEngSubject = $subject('IT 228');
        $prog1Subject = $subject('IC 111');
        $prog2Subject = $subject('IC 124');
        $dataStructSubject = $subject('IC 217');
        $infoMgmtSubject = $subject('IT 213');
        $networksSubject = $subject('IT 214');
        $hciSubject = $subject('IC 126');
        $analyticsSubject = $subject('ITBTM 327');

        $booksData = [
            [
                'program_id' => $bsit->id,
                'subject_id' => $softEngSubject?->id,
                'isbn' => '9780133943030',
                'title' => 'Software Engineering',
                'edition' => '10th',
                'publication_year' => 2020,
                'publisher' => 'Pearson',
                'total_copies' => 6,
                'availability_status' => 'Available',
                'author_first_name' => 'Ian',
                'author_last_name' => 'Sommerville',
                'call_number_value' => 'QA 76.758 .S65 2020',
                'shelf_location' => 'Circulation Section - Shelf 3A',
            ],
            [
                'program_id' => $bsit->id,
                'subject_id' => $prog1Subject?->id,
                'isbn' => '9781590282755',
                'title' => 'Python Programming: An Introduction to Computer Science',
                'edition' => '3rd',
                'publication_year' => 2021,
                'publisher' => 'Franklin, Beedle & Associates',
                'total_copies' => 8,
                'availability_status' => 'Available',
                'author_first_name' => 'John',
                'author_last_name' => 'Zelle',
                'call_number_value' => 'QA 76.73 .P98 Z45 2021',
                'shelf_location' => 'Circulation Section - Shelf 2B',
            ],
            [
                'program_id' => $bsit->id,
                'subject_id' => $prog2Subject?->id,
                'isbn' => '9780134685991',
                'title' => 'Effective Java',
                'edition' => '3rd',
                'publication_year' => 2021,
                'publisher' => 'Addison-Wesley',
                'total_copies' => 5,
                'availability_status' => 'Available',
                'author_first_name' => 'Joshua',
                'author_last_name' => 'Bloch',
                'call_number_value' => 'QA 76.73 .J38 B56 2021',
                'shelf_location' => 'Circulation Section - Shelf 2B',
            ],
            [
                'program_id' => $bsit->id,
                'subject_id' => $dataStructSubject?->id,
                'isbn' => '9780321573513',
                'title' => 'Algorithms',
                'edition' => '4th',
                'publication_year' => 2022,
                'publisher' => 'Addison-Wesley',
                'total_copies' => 5,
                'availability_status' => 'Available',
                'author_first_name' => 'Robert',
                'author_last_name' => 'Sedgewick',
                'call_number_value' => 'QA 76.9 .A43 S43 2022',
                'shelf_location' => 'Circulation Section - Shelf 3B',
            ],
            [
                'program_id' => $bsit->id,
                'subject_id' => $infoMgmtSubject?->id,
                'isbn' => '9780134773650',
                'title' => 'Modern Database Management',
                'edition' => '13th',
                'publication_year' => 2021,
                'publisher' => 'Pearson',
                'total_copies' => 7,
                'availability_status' => 'Available',
                'author_first_name' => 'Jeffrey',
                'author_last_name' => 'Hoffer',
                'call_number_value' => 'QA 76.9 .D3 H64 2021',
                'shelf_location' => 'Circulation Section - Shelf 4A',
            ],
            [
                'program_id' => $bsit->id,
                'subject_id' => $networksSubject?->id,
                'isbn' => '9780136681557',
                'title' => 'Computer Networking: A Top-Down Approach',
                'edition' => '8th',
                'publication_year' => 2022,
                'publisher' => 'Pearson',
                'total_copies' => 6,
                'availability_status' => 'Available',
                'author_first_name' => 'James',
                'author_last_name' => 'Kurose',
                'call_number_value' => 'TK 5105.5 .K87 2022',
                'shelf_location' => 'Circulation Section - Shelf 4B',
            ],
            [
                'program_id' => $bsit->id,
                'subject_id' => $hciSubject?->id,
                'isbn' => '9781119547259',
                'title' => 'Interaction Design: Beyond Human-Computer Interaction',
                'edition' => '5th',
                'publication_year' => 2023,
                'publisher' => 'Wiley',
                'total_copies' => 4,
                'availability_status' => 'Available',
                'author_first_name' => 'Helen',
                'author_last_name' => 'Sharp',
                'call_number_value' => 'QA 76.9 .H85 S53 2023',
                'shelf_location' => 'Circulation Section - Shelf 5A',
            ],
            [
                'program_id' => $bsit->id,
                'subject_id' => $analyticsSubject?->id,
                'isbn' => '9780135231678',
                'title' => 'Business Analytics: Methods, Models, and Decisions',
                'edition' => '3rd',
                'publication_year' => 2023,
                'publisher' => 'Pearson',
                'total_copies' => 4,
                'availability_status' => 'Available',
                'author_first_name' => 'James',
                'author_last_name' => 'Evans',
                'call_number_value' => 'HD 30.215 .E93 2023',
                'shelf_location' => 'Reserve Section - Shelf 1A',
            ],
        ];

        foreach ($booksData as $b) {
            Book::updateOrCreate(
                ['isbn' => $b['isbn']],
                $b
            );
        }

        // 4. Seed Sample Assessment Report
        $reportSummary = [
            [
                'classification' => 'Core',
                'courseName' => 'IT 228 - Software Engineering 1',
                'totalT' => 1,
                'totalV' => 6,
                'distinct5yr' => 0,
                'distinct10yr' => 1,
                'distinct20yr' => 0,
            ],
            [
                'classification' => 'Core',
                'courseName' => 'IC 111 - Programming Paradigm 1',
                'totalT' => 1,
                'totalV' => 8,
                'distinct5yr' => 1,
                'distinct10yr' => 0,
                'distinct20yr' => 0,
            ],
            [
                'classification' => 'Core',
                'courseName' => 'IC 124 - Programming Paradigm 2',
                'totalT' => 1,
                'totalV' => 5,
                'distinct5yr' => 1,
                'distinct10yr' => 0,
                'distinct20yr' => 0,
            ],
            [
                'classification' => 'Core',
                'courseName' => 'IC 217 - Data Structures',
                'totalT' => 1,
                'totalV' => 5,
                'distinct5yr' => 1,
                'distinct10yr' => 0,
                'distinct20yr' => 0,
            ],
            [
                'classification' => 'Core',
                'courseName' => 'IT 213 - Information Management',
                'totalT' => 1,
                'totalV' => 7,
                'distinct5yr' => 1,
                'distinct10yr' => 0,
                'distinct20yr' => 0,
            ],
            [
                'classification' => 'Core',
                'courseName' => 'IT 214 - Applied Computer Networks',
                'totalT' => 1,
                'totalV' => 6,
                'distinct5yr' => 1,
                'distinct10yr' => 0,
                'distinct20yr' => 0,
            ],
            [
                'classification' => 'Core',
                'courseName' => 'IC 126 - Interaction Design',
                'totalT' => 1,
                'totalV' => 4,
                'distinct5yr' => 1,
                'distinct10yr' => 0,
                'distinct20yr' => 0,
            ],
            [
                'classification' => 'Major',
                'courseName' => 'ITBTM 327 - Business Analytics',
                'totalT' => 1,
                'totalV' => 4,
                'distinct5yr' => 1,
                'distinct10yr' => 0,
                'distinct20yr' => 0,
            ],
        ];

        $reportReferences = [
            [
                'subject' => 'IT 228 - Software Engineering 1',
                'books' => [
                    [
                        'callNo' => 'QA 76.758 .S65 2020',
                        'title' => 'Software Engineering',
                        'author' => 'Ian Sommerville',
                        'year' => 2020,
                        'copies' => 6,
                    ],
                ],
            ],
            [
                'subject' => 'IC 111 - Programming Paradigm 1',
                'books' => [
                    [
                        'callNo' => 'QA 76.73 .P98 Z45 2021',
                        'title' => 'Python Programming: An Introduction to Computer Science',
                        'author' => 'John Zelle',
                        'year' => 2021,
                        'copies' => 8,
                    ],
                ],
            ],
            [
                'subject' => 'IC 124 - Programming Paradigm 2',
                'books' => [
                    [
                        'callNo' => 'QA 76.73 .J38 B56 2021',
                        'title' => 'Effective Java',
                        'author' => 'Joshua Bloch',
                        'year' => 2021,
                        'copies' => 5,
                    ],
                ],
            ],
            [
                'subject' => 'IC 217 - Data Structures',
                'books' => [
                    [
                        'callNo' => 'QA 76.9 .A43 S43 2022',
                        'title' => 'Algorithms',
                        'author' => 'Robert Sedgewick',
                        'year' => 2022,
                        'copies' => 5,
                    ],
                ],
            ],
            [
                'subject' => 'IT 213 - Information Management',
                'books' => [
                    [
                        'callNo' => 'QA 76.9 .D3 H64 2021',
                        'title' => 'Modern Database Management',
                        'author' => 'Jeffrey Hoffer',
                        'year' => 2021,
                        'copies' => 7,
                    ],
                ],
            ],
            [
                'subject' => 'IT 214 - Applied Computer Networks',
                'books' => [
                    [
                        'callNo' => 'TK 5105.5 .K87 2022',
                        'title' => 'Computer Networking: A Top-Down Approach',
                        'author' => 'James Kurose',
                        'year' => 2022,
                        'copies' => 6,
                    ],
                ],
            ],
            [
                'subject' => 'IC 126 - Interaction Design',
                'books' => [
                    [
                        'callNo' => 'QA 76.9 .H85 S53 2023',
                        'title' => 'Interaction Design: Beyond Human-Computer Interaction',
                        'author' => 'Helen Sharp',
                        'year' => 2023,
                        'copies' => 4,
                    ],
                ],
            ],
            [
                'subject' => 'ITBTM 327 - Business Analytics',
                'books' => [
                    [
                        'callNo' => 'HD 30.215 .E93 2023',
                        'title' => 'Business Analytics: Methods, Models, and Decisions',
                        'author' => 'James Evans',
                        'year' => 2023,
                        'copies' => 4,
                    ],
                ],
            ],
        ];

        AssessmentReport::updateOrCreate(
            [
                'program_id' => $bsit->id,
                'program_name' => $bsit->program_name,
            ],
            [
                'user_id' => $librarian->id,
                'college' => $bsit->college,
                'major' => $bsit->major,
                'summary_data' => $reportSummary,
                'references_data' => $reportReferences,
            ]
        );

        // 5. Seed Sample Contact Support Message
        if (DB::getSchemaBuilder()->hasTable('messages')) {
            DB::table('messages')->updateOrInsert(
                ['subject' => 'Inquiry on Latest BSIT Reference Acquisitions'],
                [
                    'sender_id' => $staff->id,
                    'recipient_id' => $librarian->id,
                    'message' => 'Good day, Ma\'am Samana. Just inquiring if the new acquisitions for IT 228 (Software Engineering) and IC 217 (Data Structures) have been cataloged in the assessment report. Thank you!',
                    'attachment' => null,
                    'is_read' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
