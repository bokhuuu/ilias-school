<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Translatable\HasTranslations;

class Course extends Model implements HasMedia
{
    use HasTranslations, HasSlug, InteractsWithMedia, LogsActivity, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'short_description',
        'age_group',
        'format',
        'duration',
        'video_url',
        'meta_title',
        'meta_description',
        'is_active',
        'is_featured',
        'featured_sort_order',
        'sort_order'
    ];


    public $translatable = [
        'title',
        'description',
        'short_description',
        'format',
        'duration',
        'meta_title',
        'meta_description'
    ];


    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean'
    ];


    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }


    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile();
        $this->addMediaCollection('gallery');
        $this->addMediaCollection('og_image')->singleFile();
    }


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }


    public function registerMediaConversions(?\Spatie\MediaLibrary\MediaCollections\Models\Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(250)
            ->sharpen(10);

        $this->addMediaConversion('medium')
            ->width(800)
            ->height(500);

        $this->addMediaConversion('large')
            ->width(1920)
            ->height(1080);
    }


    public function lecturers(): BelongsToMany
    {
        return $this->belongsToMany(Lecturer::class);
    }


    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }


    public function syllabusItems(): HasMany
    {
        return $this->hasMany(SyllabusItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }


    public function scopeSorted($query)
    {
        return $query->orderBy('sort_order');
    }


    public function scopeFeaturedSorted($query)
    {
        return $query->where('is_featured', true)->orderBy('featured_sort_order');
    }


    public function getRouteKeyName()
    {
        return 'slug';
    }
}
