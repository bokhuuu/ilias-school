<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Translatable\HasTranslations;

class SyllabusItem extends Model
{
    use HasTranslations, LogsActivity;


    protected $fillable = [
        'course_id',
        'meeting_number',
        'title',
        'sort_order',
    ];


    public array $translatable = [
        'title',
    ];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }


    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }


    public function scopeSorted($query)
    {
        return $query->orderBy('sort_order');
    }
}
