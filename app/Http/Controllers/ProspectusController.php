<?php

namespace App\Http\Controllers;

use App\Models\Prospectus;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProspectusController extends Controller
{
    public function index()
    {
        return Inertia::render('Prospectuses/Index', [
            'prospectuses' => Prospectus::with('program')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Prospectuses/Create', [
            'programs' => Program::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id'    => 'required|exists:programs,id',
            'title'         => 'required|string|max:200',
            'academic_year' => 'required|string|max:20',
            'description'   => 'nullable|string',
            'is_active'     => 'boolean',
        ]);

        Prospectus::create($validated);

        return redirect()->route('prospectuses.index');
    }

    public function edit(Prospectus $prospectus)
    {
        return Inertia::render('Prospectuses/Update', [
            'prospectus' => $prospectus,
            'programs'   => Program::all()
        ]);
    }

    public function update(Request $request, Prospectus $prospectus)
    {
        $validated = $request->validate([
            'program_id'    => 'required|exists:programs,id',
            'title'         => 'required|string|max:200',
            'academic_year' => 'required|string|max:20',
            'description'   => 'nullable|string',
            'is_active'     => 'boolean',
        ]);

        $prospectus->update($validated);

        return redirect()->route('prospectuses.index');
    }

    public function destroy(Prospectus $prospectus)
    {
        $prospectus->delete();
        return redirect()->route('prospectuses.index');
    }
}