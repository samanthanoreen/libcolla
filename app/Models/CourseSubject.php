<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'prospectus_id',
        'year_semester',
        'subject_code',
        'subject_title',
        'course_description',
        'lec_hours',
        'lab_hours',
        'credit_units',
        'pre_requisite',
        'semester_offered',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function prospectus(): BelongsTo
    {
        return $this->belongsTo(Prospectus::class);
    }

    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'subject_id');
    }
}