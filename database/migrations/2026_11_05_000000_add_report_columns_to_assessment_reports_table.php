<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assessment_reports', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('program_id')->nullable()->constrained('programs')->nullOnDelete();
            $table->string('college', 150)->nullable();
            $table->string('program_name', 150)->nullable();
            $table->string('major', 150)->nullable();
            $table->longText('summary_data')->nullable();
            $table->longText('references_data')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('assessment_reports', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropConstrainedForeignId('program_id');
            $table->dropColumn(['college', 'program_name', 'major', 'summary_data', 'references_data']);
        });
    }
};