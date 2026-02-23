<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Translatable\HasTranslations;

class Faq extends Model
{
    use HasTranslations, LogsActivity;


    protected $fillable = [
        'question',
        'answer',
        'is_active',
        'sort_order',
    ];


    public array $translatable = [
        'question',
        'answer',
    ];


    protected $casts = [
        'is_active' => 'boolean',
    ];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }


    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }


    public function scopeSorted($query)
    {
        return $query->orderBy('sort_order');
    }
}
