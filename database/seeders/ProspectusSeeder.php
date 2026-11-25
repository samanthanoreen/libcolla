<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

/**
 * One active prospectus per program (Effective SY 2018-2019). Run ProgramSeeder first.
 *
 *   php artisan db:seed --class=ProspectusSeeder
 */
class ProspectusSeeder extends Seeder
{
    public function run(): void
    {
        foreach (CurriculumData::programs() as $data) {
            $program = Program::where('program_code', $data['key'])->first();

            if (! $program) {
                $this->command?->error("Program {$data['key']} not found. Run ProgramSeeder first.");

                continue;
            }

            $attributes = $data['prospectus'] + ['is_active' => true];

            // Same rule the app uses to pick a program's current prospectus.
            $prospectus = $program->prospectuses()
                ->orderByDesc('is_active')
                ->orderByDesc('id')
                ->first();

            if ($prospectus) {
                $prospectus->update($attributes);
            } else {
                $program->prospectuses()->create($attributes + ['version' => 1]);
            }
        }

        $this->command?->info('Prospectuses ready.');
    }
}
