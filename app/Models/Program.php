<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_code',
        'program_name',
        'college',
        'major',
        'level',
        'duration',
        'status',
    ];

    /**
     * Get the prospectuses associated with the program.
     */
    public function prospectuses(): HasMany
    {
        return $this->hasMany(Prospectus::class);
    }

    /**
     * Get the course subjects associated with the program.
     */
    public function courseSubjects(): HasMany
    {
        return $this->hasMany(CourseSubject::class);
    }
}
