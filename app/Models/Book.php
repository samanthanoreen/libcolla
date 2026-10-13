<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'subject_id',
        'isbn',
        'title',
        'edition',
        'publication_year',
        'publisher',
        'total_copies',
        'availability_status',
        'description',
        'author_first_name',
        'author_last_name',
        'copyright_year',
        'copyright_holder',
        'license_type',
        'call_number_value',
        'classification_system',
        'shelf_location',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function courseSubject(): BelongsTo
    {
        return $this->belongsTo(CourseSubject::class, 'subject_id');
    }
}