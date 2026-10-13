<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\CourseSubjectController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProspectusController;
use App\Models\Book;
use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\Prospectus;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dynamic Dashboard Route
    Route::get('/dashboard', function () {
        return inertia('Dashboard', [
            'stats' => [
                'total_programs'     => Program::count(),
                'total_prospectuses' => Prospectus::count(),
                'total_subjects'     => CourseSubject::count(),
                'total_books'        => Book::count(),
            ]
        ]);
    })->name('dashboard');

    // Collection Assessment Report Routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/generate', function () {
            return Inertia::render('Reports/Generate');
        })->name('generate');

        Route::get('/manage', function () {
            return Inertia::render('Reports/Manage');
        })->name('manage');
    });

    // LibColla Entities CRUD Routes (includes index, create, store, show, edit, update, destroy)
    Route::resource('programs', ProgramController::class);
    Route::resource('prospectuses', ProspectusController::class);
    Route::resource('course-subjects', CourseSubjectController::class);
    Route::resource('books', BookController::class);
});

require __DIR__.'/settings.php';