<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'age_group' => $this->age_group,
            'format' => $this->format,
            'duration' => $this->duration,
            'video_url' => $this->video_url,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'featured_sort_order' => $this->featured_sort_order,
            'sort_order' => $this->sort_order,

            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,

            'image' => $this->getFirstMediaUrl('image'),
            'image_thumb' => $this->getFirstMediaUrl('image', 'thumb'),
            'image_medium' => $this->getFirstMediaUrl('image', 'medium'),
            'image_large' => $this->getFirstMediaUrl('image', 'large'),
            'og_image' => $this->getFirstMediaUrl('og_image'),

            'gallery' => $this->getMedia('gallery')->map(fn($media) => [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb' => $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : $media->getUrl(),
                'order' => $media->order_column,
            ])->sortBy('order')->values(),

            'lecturers' => LecturerResource::collection($this->whenLoaded('lecturers')),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'syllabus_items' => SyllabusItemResource::collection($this->whenLoaded('syllabusItems')),
            'syllabus_items_count' => $this->whenCounted('syllabusItems'),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
