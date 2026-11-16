<?php

use App\Http\Controllers\AssessmentReportController;
use App\Http\Controllers\BookLibraryController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramProspectusController;
use App\Http\Controllers\SupportContactController;
use App\Http\Controllers\UserController;
use App\Models\AssessmentReport;
use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\Prospectus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Main')->name('home');
Route::inertia('/main', 'Main')->name('main');
Route::inertia('/features', 'Features')->name('features');
Route::inertia('/how-it-works', 'HowItWorks')->name('how-it-works');
Route::inertia('/benefits', 'Benefits')->name('benefits');

// Support GET & POST /logout directly
Route::match(['get', 'post'], '/logout', function (Request $request) {
    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/login')->with('status', 'You have been logged out successfully.');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dynamic Dashboard Route
    Route::get('/dashboard', function () {
        $totalSubjects = CourseSubject::count();
        $assessedSubjects = Book::distinct()->count('subject_id');
        $currentYear = (int) date('Y');
        $cutoffYear = $currentYear - 2; // e.g. 2026 - 2 = 2024; books published in 2023 or earlier (> 2 years old)
        $booksOver2Years = Book::where(function ($q) use ($cutoffYear) {
            $q->whereNull('publication_year')
              ->orWhere('publication_year', '<', $cutoffYear);
        })->count();

        return inertia('Dashboard', [
            'stats' => [
                'total_programs' => Program::count(),
                'total_prospectuses' => Prospectus::count(),
                'total_subjects' => $totalSubjects,
                'total_books' => Book::count(),
                'books_over_2_years' => $booksOver2Years,
                'books_past_2_years' => $booksOver2Years,
                'books_past_1_year' => $booksOver2Years,
                'past_year_books' => $booksOver2Years,
                'failed_current_year_books' => $booksOver2Years,
                'assessed_percentage' => $totalSubjects > 0 ? round(($assessedSubjects / $totalSubjects) * 100) : 0,
                'assessed_count' => $assessedSubjects,
                'total_reports' => AssessmentReport::count(),
            ],
            'currentYear' => $currentYear,
        ]);
    })->name('dashboard');

    // Collection Assessment Report Routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/generate', [AssessmentReportController::class, 'generate'])->name('generate');
        Route::get('/manage', [AssessmentReportController::class, 'manage'])->name('manage');
        Route::get('/preview/{program}', [AssessmentReportController::class, 'preview'])->name('preview');
        Route::post('/', [AssessmentReportController::class, 'store'])->name('store');
        Route::get('/{report}', [AssessmentReportController::class, 'show'])->name('show');
        Route::delete('/{report}', [AssessmentReportController::class, 'destroy'])->name('destroy');
    });

    // Prospectus and subjects, managed from inside a program
    Route::prefix('programs/{program}/prospectus')->name('programs.prospectus.')->group(function () {
        Route::get('/', [ProgramProspectusController::class, 'show'])->name('show');
        Route::put('/', [ProgramProspectusController::class, 'save'])->name('save');
        Route::post('subjects', [ProgramProspectusController::class, 'storeSubject'])->name('subjects.store');
        Route::put('subjects/{subject}', [ProgramProspectusController::class, 'updateSubject'])->name('subjects.update');
        Route::delete('subjects/{subject}', [ProgramProspectusController::class, 'destroySubject'])->name('subjects.destroy');
    });

    // LibColla Entities CRUD Routes
    Route::resource('programs', ProgramController::class)->except(['create', 'show', 'edit']);

    // Program Library and the book records of each program
    Route::get('books', [BookLibraryController::class, 'index'])->name('books.index');
    Route::get('books/program/{program}', [BookLibraryController::class, 'program'])->name('books.program');
    Route::post('books', [BookLibraryController::class, 'store'])->name('books.store');
    Route::put('books/{book}', [BookLibraryController::class, 'update'])->name('books.update');
    Route::delete('books/{book}', [BookLibraryController::class, 'destroy'])->name('books.destroy');

    // User Management Routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/manage', [UserController::class, 'index'])->name('users.manage');
    Route::get('/users/manageusers', [UserController::class, 'index'])->name('users.manageusers');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/request-access', [UserController::class, 'requestAccess'])->name('users.request-access');

    // Support / Contact Form Routes
    Route::get('/support/contact', [SupportContactController::class, 'index'])->name('support.contact');
    Route::get('/contact', [SupportContactController::class, 'index'])->name('contact');
    Route::post('/support/contact', [SupportContactController::class, 'store'])->name('support.contact.store');
    Route::post('/support/contact/mark-read', [SupportContactController::class, 'markRead'])->name('support.contact.markRead');
    Route::get('/support/contact/download/{message}', [SupportContactController::class, 'download'])->name('support.contact.download');

});

require __DIR__.'/settings.php';