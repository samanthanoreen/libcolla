<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'program_id',
        'prospectus_id',
        'target_recency_years',
        'summary_data',
        'references_data',
        'compliance_percentage',
        'report_file_path',
        'status',
        'approved_by',
        'approval_date',
        'notes',
    ];
}