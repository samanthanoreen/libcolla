<?php

namespace App\Http\Controllers;

use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\Prospectus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseSubjectController extends Controller
{
    public function index()
    {
        return Inertia::render('CourseSubjects/Index', [
            'subjects' => CourseSubject::with(['program', 'prospectus'])->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('CourseSubjects/Create', [
            'programs'     => Program::all(),
            'prospectuses' => Prospectus::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id'       => 'required|exists:programs,id',
            'prospectus_id'    => 'required|exists:prospectuses,id',
            'subject_code'     => 'required|string|max:20',
            'subject_title'    => 'required|string|max:200',
            'credit_units'     => 'required|numeric',
            'semester_offered' => 'nullable|string',
        ]);

        CourseSubject::create($validated);

        return redirect()->route('course-subjects.index');
    }

    public function edit(CourseSubject $courseSubject)
    {
        return Inertia::render('CourseSubjects/Update', [
            'subject'      => $courseSubject,
            'programs'     => Program::all(),
            'prospectuses' => Prospectus::all()
        ]);
    }

    public function update(Request $request, CourseSubject $courseSubject)
    {
        $validated = $request->validate([
            'program_id'       => 'required|exists:programs,id',
            'prospectus_id'    => 'required|exists:prospectuses,id',
            'subject_code'     => 'required|string|max:20',
            'subject_title'    => 'required|string|max:200',
            'credit_units'     => 'required|numeric',
            'semester_offered' => 'nullable|string',
        ]);

        $courseSubject->update($validated);

        return redirect()->route('course-subjects.index');
    }

    public function destroy(CourseSubject $courseSubject)
    {
        $courseSubject->delete();
        return redirect()->route('course-subjects.index');
    }
}