<?php

namespace App\Models;

use App\Traits\HasGeorgianSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\SlugOptions;
use Spatie\Translatable\HasTranslations;

class Lecturer extends Model implements HasMedia
{
    use HasTranslations, HasGeorgianSlug, InteractsWithMedia, LogsActivity, SoftDeletes;

    protected $fillable = [
        'full_name',
        'title',
        'bio',
        'short_bio',
        'meta_title',
        'meta_description',
        'is_active',
        'sort_order'
    ];


    public $translatable = [
        'full_name',
        'title',
        'bio',
        'short_bio',
        'meta_title',
        'meta_description'
    ];


    protected $casts = [
        'is_active' => 'boolean'
    ];


    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('full_name')
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
            ->width(300)
            ->height(300)
            ->sharpen(10);

        $this->addMediaConversion('medium')
            ->width(600)
            ->height(600);
    }


    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class);
    }


    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }


    public function scopeSorted($query)
    {
        return $query->orderBy('sort_order');
    }


    public function getRouteKeyName()
    {
        return 'slug';
    }
}
