<?php

use App\Http\Controllers\AssessmentReportController;
use App\Http\Controllers\BookLibraryController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramProspectusController;
use App\Models\AssessmentReport;
use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\Prospectus;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dynamic Dashboard Route
    Route::get('/dashboard', function () {
        $totalSubjects = CourseSubject::count();
        $assessedSubjects = Book::distinct()->count('subject_id');

        return inertia('Dashboard', [
            'stats' => [
                'total_programs' => Program::count(),
                'total_prospectuses' => Prospectus::count(),
                'total_subjects' => $totalSubjects,
                'total_books' => Book::count(),
                'assessed_percentage' => $totalSubjects > 0 ? round(($assessedSubjects / $totalSubjects) * 100) : 0,
                'assessed_count' => $assessedSubjects,
                'total_reports' => AssessmentReport::count(),
            ],
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
});

require __DIR__.'/settings.php';