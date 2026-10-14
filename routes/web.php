<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramProspectusController;
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
            ],
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
    Route::resource('books', BookController::class);
});

require __DIR__.'/settings.php';