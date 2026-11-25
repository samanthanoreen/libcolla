<?php

namespace Tests\Feature;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\StoreCourseSubjectRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Requests\UpdateCourseSubjectRequest;
use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\Prospectus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class FormRequestValidationTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'permissions' => [
                'can_add' => true,
                'can_edit' => true,
                'can_delete' => true,
                'can_access_users' => true,
            ],
        ]);
    }

    private function restrictedUser(): User
    {
        return User::factory()->create([
            'role' => 'staff',
            'permissions' => [
                'can_add' => false,
                'can_edit' => false,
                'can_delete' => false,
                'can_access_users' => false,
            ],
        ]);
    }

    public function test_program_store_and_update_use_form_request_validation_and_authorization(): void
    {
        $restricted = $this->restrictedUser();
        $admin = $this->adminUser();

        $this->actingAs($restricted)
            ->post('/programs', [])
            ->assertForbidden();

        $this->actingAs($admin)
            ->post('/programs', ['level' => 'Invalid'])
            ->assertSessionHasErrors(['college', 'program_name', 'level']);

        $this->actingAs($admin)
            ->post('/programs', [
                'college' => 'College of Computing',
                'program_name' => 'Bachelor of Science in Information Technology',
                'major' => 'Information Security',
                'level' => 'Bachelor',
            ])
            ->assertRedirect();

        $program = Program::firstOrFail();

        $this->actingAs($restricted)
            ->put("/programs/{$program->id}", [])
            ->assertForbidden();

        $this->actingAs($admin)
            ->put("/programs/{$program->id}", [
                'college' => 'College of Computing',
                'program_name' => 'BSIT Updated',
                'level' => 'Master',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('programs', [
            'id' => $program->id,
            'program_name' => 'BSIT Updated',
            'level' => 'Master',
        ]);
    }

    public function test_program_prospectus_and_subject_validations_work(): void
    {
        $restricted = $this->restrictedUser();
        $admin = $this->adminUser();
        $program = Program::create([
            'college' => 'CIC',
            'program_name' => 'BSCS',
            'program_code' => 'BSCS',
            'level' => 'Bachelor',
        ]);

        $this->actingAs($restricted)
            ->put("/programs/{$program->id}/prospectus", [])
            ->assertForbidden();

        $this->actingAs($admin)
            ->put("/programs/{$program->id}/prospectus", [
                'title' => 'BSCS Prospectus',
                'academic_year' => '2024',
            ])
            ->assertSessionHasErrors(['academic_year' => 'Use the format 2024-2025.']);

        $this->actingAs($admin)
            ->put("/programs/{$program->id}/prospectus", [
                'title' => 'BSCS Prospectus',
                'academic_year' => '2024-2025',
            ])
            ->assertRedirect();

        $this->actingAs($restricted)
            ->post("/programs/{$program->id}/prospectus/subjects", [])
            ->assertForbidden();

        $this->actingAs($admin)
            ->post("/programs/{$program->id}/prospectus/subjects", [
                'year_semester' => 'Invalid Semester',
            ])
            ->assertSessionHasErrors(['year_semester', 'subject_code', 'subject_title', 'credit_units']);

        $this->actingAs($admin)
            ->post("/programs/{$program->id}/prospectus/subjects", [
                'year_semester' => 'FIRST YEAR — 1st Semester',
                'subject_code' => 'CS101',
                'subject_title' => 'Intro to Computing',
                'credit_units' => 3,
            ])
            ->assertRedirect();

        $subject = CourseSubject::firstOrFail();

        $this->actingAs($admin)
            ->put("/programs/{$program->id}/prospectus/subjects/{$subject->id}", [
                'year_semester' => 'FIRST YEAR — 2nd Semester',
                'subject_code' => 'CS102',
                'subject_title' => 'Programming 1',
                'credit_units' => 3,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('course_subjects', [
            'id' => $subject->id,
            'subject_code' => 'CS102',
            'semester_offered' => '2nd Semester',
        ]);
    }

    public function test_book_library_store_and_update_validations_work(): void
    {
        $restricted = $this->restrictedUser();
        $admin = $this->adminUser();
        $program = Program::create([
            'college' => 'CIC',
            'program_name' => 'BSIT',
            'program_code' => 'BSIT',
            'level' => 'Bachelor',
        ]);
        $prospectus = Prospectus::create([
            'program_id' => $program->id,
            'title' => 'BSIT Prospectus',
            'academic_year' => '2024-2025',
            'is_active' => true,
        ]);
        $subject = CourseSubject::create([
            'program_id' => $program->id,
            'prospectus_id' => $prospectus->id,
            'year_semester' => 'FIRST YEAR — 1st Semester',
            'subject_code' => 'IT101',
            'subject_title' => 'Intro to IT',
            'credit_units' => 3,
            'semester_offered' => '1st Semester',
        ]);

        $this->actingAs($restricted)
            ->post('/books', [])
            ->assertForbidden();

        $this->actingAs($admin)
            ->post('/books', ['program_id' => $program->id])
            ->assertSessionHasErrors(['subject_id', 'title', 'call_no', 'author', 'year', 'copies']);

        $this->actingAs($admin)
            ->post('/books', [
                'program_id' => $program->id,
                'subject_id' => $subject->id,
                'title' => 'Clean Code',
                'call_no' => 'QA76.76',
                'author' => 'Robert Martin',
                'year' => 2024,
                'copies' => 3,
            ])
            ->assertRedirect();

        $book = Book::firstOrFail();

        $this->actingAs($admin)
            ->put("/books/{$book->id}", [
                'title' => 'Clean Code 2nd Ed',
                'call_no' => 'QA76.77',
                'author' => 'Robert Martin',
                'year' => 2025,
                'copies' => 5,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('books', [
            'id' => $book->id,
            'title' => 'Clean Code 2nd Ed',
            'total_copies' => 5,
        ]);
    }

    public function test_assessment_report_support_contact_and_user_validations_work(): void
    {
        $restricted = $this->restrictedUser();
        $admin = $this->adminUser();
        $program = Program::create([
            'college' => 'CIC',
            'program_name' => 'BSIS',
            'program_code' => 'BSIS',
            'level' => 'Bachelor',
        ]);

        $this->actingAs($admin)
            ->get('/reports/generate')
            ->assertOk();

        $this->actingAs($admin)
            ->get("/reports/preview/{$program->id}")
            ->assertOk();

        $this->actingAs($restricted)
            ->post('/reports', [])
            ->assertForbidden();

        $this->actingAs($admin)
            ->post('/reports', [])
            ->assertSessionHasErrors(['program_id', 'summary', 'references']);

        $this->actingAs($admin)
            ->post('/reports', [
                'program_id' => $program->id,
                'summary' => [['courseName' => 'IS101']],
                'references' => [],
            ])
            ->assertRedirect('/reports/manage');

        $this->actingAs($admin)
            ->post('/support/contact', [])
            ->assertSessionHasErrors(['subject', 'message', 'recipients']);

        $this->actingAs($admin)
            ->post('/support/contact', [
                'subject' => 'Hello',
                'message' => 'Test message',
                'recipients' => [$restricted->email],
            ])
            ->assertRedirect();

        $this->actingAs($restricted)
            ->post('/users', [])
            ->assertForbidden();

        $this->actingAs($admin)
            ->post('/users', [
                'email' => $restricted->email,
                'role' => 'invalid-role',
            ])
            ->assertSessionHasErrors(['full_name', 'username', 'email', 'role', 'password']);

        $this->actingAs($admin)
            ->post('/users', [
                'full_name' => 'New Librarian',
                'username' => 'newlib',
                'email' => 'newlib@example.com',
                'role' => 'librarian',
                'password' => 'StrongPass123!',
            ])
            ->assertRedirect();

        $created = User::where('email', 'newlib@example.com')->firstOrFail();

        $this->actingAs($admin)
            ->put("/users/{$created->id}", [
                'full_name' => 'Updated Librarian',
                'username' => 'newlib',
                'email' => 'newlib@example.com',
                'role' => 'librarian',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $created->id,
            'full_name' => 'Updated Librarian',
        ]);
    }

    public function test_course_subject_and_book_form_request_rules_are_valid(): void
    {
        foreach ([StoreCourseSubjectRequest::class, UpdateCourseSubjectRequest::class] as $requestClass) {
            $request = new $requestClass;
            $this->assertTrue($request->authorize());
            $validator = Validator::make([], $request->rules());
            $this->assertTrue($validator->fails());
            $this->assertArrayHasKey('subject_code', $validator->errors()->toArray());
        }

        foreach ([StoreBookRequest::class, UpdateBookRequest::class] as $requestClass) {
            $request = new $requestClass;
            $this->assertTrue($request->authorize());
            $validator = Validator::make([], $request->rules());
            $this->assertTrue($validator->fails());
            $this->assertArrayHasKey('title', $validator->errors()->toArray());
        }
    }
}
