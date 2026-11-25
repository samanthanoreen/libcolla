<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseSubjectRequest;
use App\Http\Requests\UpdateCourseSubjectRequest;
use App\Models\CourseSubject;
use App\Models\Program;
use App\Models\Prospectus;
use Inertia\Inertia;

class CourseSubjectController extends Controller
{
    public function index()
    {
        return Inertia::render('CourseSubjects/Index', [
            'subjects' => CourseSubject::with(['program', 'prospectus'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('CourseSubjects/Create', [
            'programs' => Program::all(),
            'prospectuses' => Prospectus::all(),
        ]);
    }

    public function store(StoreCourseSubjectRequest $request)
    {
        CourseSubject::create($request->validated());

        return redirect()->route('course-subjects.index');
    }

    public function edit(CourseSubject $courseSubject)
    {
        return Inertia::render('CourseSubjects/Update', [
            'subject' => $courseSubject,
            'programs' => Program::all(),
            'prospectuses' => Prospectus::all(),
        ]);
    }

    public function update(UpdateCourseSubjectRequest $request, CourseSubject $courseSubject)
    {
        $courseSubject->update($request->validated());

        return redirect()->route('course-subjects.index');
    }

    public function destroy(CourseSubject $courseSubject)
    {
        $courseSubject->delete();

        return redirect()->route('course-subjects.index');
    }
}
