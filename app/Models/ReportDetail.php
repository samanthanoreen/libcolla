<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'subject_id',
        'book_id',
        'meets_recency',
    ];
}
