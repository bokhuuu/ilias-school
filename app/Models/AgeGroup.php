<?php

namespace App\Models;

use App\Traits\ClearsInertiaCache;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

class AgeGroup extends Model implements HasMedia
{
    use HasTranslations, ClearsInertiaCache, InteractsWithMedia, LogsActivity;


    protected $fillable = [
        'title',
        'age_range',
        'description',
        'is_active',
        'sort_order',
    ];


    public array $translatable = [
        'title',
        'description',
    ];


    protected $casts = [
        'is_active' => 'boolean',
    ];


    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile();
    }


    public function registerMediaConversions(?\Spatie\MediaLibrary\MediaCollections\Models\Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->sharpen(10);
    }


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
