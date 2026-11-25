<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prospectus extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'title',
        'academic_year',
        'description',
        'date_published',
        'is_active',
        'version',
        'file_path',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function courseSubjects(): HasMany
    {
        return $this->hasMany(CourseSubject::class);
    }
}
