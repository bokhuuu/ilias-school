<?php

namespace App\Models;

use App\Traits\ClearsInertiaCache;
use App\Traits\HasUnicodeSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Sluggable\SlugOptions;
use Spatie\Translatable\HasTranslations;

class Category extends Model
{
    use HasTranslations, HasUnicodeSlug, ClearsInertiaCache, LogsActivity;


    protected $fillable = [
        'name',
        'sort_order',
    ];


    public array $translatable = [
        'name',
    ];


    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }


    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_category');
    }


    public function scopeSorted($query)
    {
        return $query->orderBy('sort_order');
    }


    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
