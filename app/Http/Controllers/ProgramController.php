<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Programs/Index', [
            'programs' => Program::withCount(['prospectuses', 'courseSubjects'])->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Programs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_code' => 'required|string|max:20|unique:programs,program_code',
            'program_name' => 'required|string|max:150',
            'college'      => 'required|string|max:150',
            'major'        => 'nullable|string|max:150',
            'level'        => 'required|string',
            'duration'     => 'required|integer|min:1',
            'status'       => 'required|string',
        ]);

        Program::create($validated);

        return redirect()->route('programs.index');
    }

    public function edit(Program $program)
    {
        return Inertia::render('Programs/Update', [
            'program' => $program
        ]);
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'program_code' => 'required|string|max:20|unique:programs,program_code,' . $program->id,
            'program_name' => 'required|string|max:150',
            'college'      => 'required|string|max:150',
            'major'        => 'nullable|string|max:150',
            'level'        => 'required|string',
            'duration'     => 'required|integer|min:1',
            'status'       => 'required|string',
        ]);

        $program->update($validated);

        return redirect()->route('programs.index');
    }

    public function destroy(Program $program)
    {
        $program->delete();
        return redirect()->route('programs.index');
    }
}