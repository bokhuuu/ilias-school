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
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn('age_group');
            $table->foreignId('age_group_id')->nullable()->after('short_description')->constrained('age_groups')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['age_group_id']);
            $table->dropColumn('age_group_id');
            $table->string('age_group')->nullable()->after('short_description');
        });
    }
};
