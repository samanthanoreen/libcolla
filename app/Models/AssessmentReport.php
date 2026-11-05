<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'program_id',
        'college',
        'program_name',
        'major',
        'summary_data',
        'references_data',
    ];

    protected function casts(): array
    {
        return [
            'summary_data' => 'array',
            'references_data' => 'array',
        ];
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}