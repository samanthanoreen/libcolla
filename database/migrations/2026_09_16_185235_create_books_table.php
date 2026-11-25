<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->foreignId('subject_id')->references('id')->on('course_subjects')->onDelete('cascade');
            $table->string('isbn', 13)->nullable();
            $table->string('title', 300);
            $table->string('edition', 20)->nullable();
            $table->integer('publication_year');
            $table->string('publisher', 150);
            $table->integer('total_copies')->default(1);
            $table->string('availability_status', 20)->default('Available');
            $table->text('description')->nullable();
            $table->string('author_first_name', 50)->nullable();
            $table->string('author_last_name', 50)->nullable();
            $table->integer('copyright_year')->nullable();
            $table->string('copyright_holder', 150)->nullable();
            $table->string('license_type', 50)->default('All Rights Reserved');
            $table->string('call_number_value', 50)->nullable();
            $table->string('classification_system', 20)->nullable();
            $table->string('shelf_location', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
