<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('option_groups', function (Blueprint $table): void {
            $table->string('selection_type', 16)->default('multiple')->after('description');
            $table->unsignedSmallInteger('min_selections')->default(0)->after('selection_type');
            $table->unsignedSmallInteger('max_selections')->nullable()->after('min_selections');
            $table->boolean('is_active')->default(true)->after('max_selections');
        });
    }

    public function down(): void
    {
        Schema::table('option_groups', function (Blueprint $table): void {
            $table->dropColumn([
                'selection_type',
                'min_selections',
                'max_selections',
                'is_active',
            ]);
        });
    }
};
