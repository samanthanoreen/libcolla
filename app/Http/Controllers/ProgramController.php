<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $field = $request->input('field', 'all');

        $programs = Program::query()
            ->when($search, function ($query) use ($search, $field) {
                if ($field === 'college') {
                    $query->where('college', 'like', "%{$search}%");
                } elseif ($field === 'name') {
                    $query->where('name', 'like', "%{$search}%");
                } elseif ($field === 'major') {
                    $query->where('major', 'like', "%{$search}%");
                } else {
                    $query->where('college', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('major', 'like', "%{$search}%")
                        ->orWhere('level', 'like', "%{$search}%");
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Programs/Index', [
            'programs' => $programs,
            'filters' => [
                'search' => $search ?? '',
                'field' => $field,
            ],
        ]);
    }

    public function destroy(Program $program)
    {
        $program->delete();

        return back()->with('success', 'Program deleted successfully.');
    }
}