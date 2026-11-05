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
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('program_code', 20)->nullable();
            $table->string('program_name', 150);
            $table->string('college', 150);
            $table->string('major', 150)->nullable();
            $table->string('level', 50)->default('Bachelor');
            $table->integer('duration')->default(4);
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
