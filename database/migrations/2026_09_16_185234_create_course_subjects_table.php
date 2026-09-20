<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->foreignId('prospectus_id')->constrained('prospectuses')->onDelete('cascade');
            $table->string('year_semester', 100)->nullable();
            $table->string('subject_code', 50);
            $table->string('subject_title', 200);
            $table->text('course_description')->nullable();
            $table->integer('lec_hours')->nullable();
            $table->integer('lab_hours')->nullable();
            $table->decimal('credit_units', 3, 1)->default(3.0);
            $table->string('pre_requisite', 255)->nullable();
            $table->string('semester_offered', 20);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_subjects');
    }
};