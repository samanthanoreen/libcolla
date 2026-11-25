<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgramRequest;
use App\Http\Requests\UpdateProgramRequest;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $field = $request->input('field', 'all');
        $perPage = in_array((int) $request->input('per_page'), [10, 15, 25, 50], true)
            ? (int) $request->input('per_page')
            : 10;

        $programs = Program::query()
            ->withCount('courseSubjects')
            ->when($search, function ($query) use ($search, $field) {
                $like = "%{$search}%";

                $query->where(function ($q) use ($field, $like) {
                    if ($field === 'college') {
                        $q->where('college', 'like', $like);
                    } elseif ($field === 'name') {
                        $q->where('program_name', 'like', $like);
                    } elseif ($field === 'major') {
                        $q->where('major', 'like', $like);
                    } else {
                        $q->where('college', 'like', $like)
                            ->orWhere('program_name', 'like', $like)
                            ->orWhere('major', 'like', $like)
                            ->orWhere('level', 'like', $like);
                    }
                });
            })
            ->orderBy('college')
            ->orderBy('program_name')
            ->orderBy('major')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Programs/Index', [
            'programs' => $programs,
            'filters' => [
                'search' => $search ?? '',
                'field' => $field,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(StoreProgramRequest $request)
    {
        $validated = $request->validated();

        $validated['major'] = $validated['major'] ?? null;
        $validated['program_code'] = $this->makeCode($validated['program_name']);

        Program::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Program added successfully!']);

        return back();
    }

    public function update(UpdateProgramRequest $request, Program $program)
    {
        $validated = $request->validated();

        $validated['major'] = $validated['major'] ?? null;

        $program->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Program updated!']);

        return back();
    }

    public function destroy(Program $program)
    {
        abort_unless(request()->user()?->can_delete, 403, 'Unauthorized. Missing Delete permission.');

        $fromProspectus = str_contains(url()->previous(), "/programs/{$program->id}/prospectus");

        $program->delete();

        Inertia::flash('toast', ['type' => 'info', 'message' => 'Program deleted.']);

        return $fromProspectus ? redirect()->route('programs.index') : back();
    }

    /**
     * Initials of the program name (BSIT, BSCS...), with a numeric suffix on collision.
     */
    private function makeCode(string $name): string
    {
        $code = Str::upper(collect(preg_split('/\s+/', trim($name)))
            ->map(fn ($w) => mb_substr($w, 0, 1))
            ->implode(''));

        $code = mb_substr($code, 0, 20);

        if (Program::where('program_code', $code)->exists()) {
            $code = mb_substr($code, 0, 17).random_int(10, 99);
        }

        return $code;
    }
}