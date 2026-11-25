<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

/**
 * The four CIC programs: BSIT (Business Technology Management), BSIT (Information
 * Security), BSCS and BLIS. Safe to run more than once.
 *
 *   php artisan db:seed --class=ProgramSeeder
 */
class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        foreach (CurriculumData::programs() as $data) {
            $attributes = Arr::only($data, ['program_name', 'college', 'major', 'level', 'duration', 'status'])
                + ['program_code' => $data['key']];

            // An older seed saved the BTM program under the plain code "BSIT".
            $program = Program::where('program_code', $data['key'])->first()
                ?? ($data['legacy_codes']
                    ? Program::whereIn('program_code', $data['legacy_codes'])->first()
                    : null);

            if ($program) {
                $program->update($attributes);
            } else {
                Program::create($attributes);
            }
        }

        $this->command?->info('Programs ready: '.count(CurriculumData::programs()).'.');
    }
}
