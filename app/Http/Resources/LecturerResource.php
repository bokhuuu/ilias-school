<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LecturerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'slug' => $this->slug,
            'title' => $this->title,
            'bio' => $this->bio,
            'short_bio' => $this->short_bio,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,

            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,

            'image' => $this->getFirstMediaUrl('image'),
            'image_thumb' => $this->getFirstMediaUrl('image', 'thumb'),
            'image_medium' => $this->getFirstMediaUrl('image', 'medium'),
            'og_image' => $this->getFirstMediaUrl('og_image'),

            'gallery' => $this->getMedia('gallery')->map(fn($media) => [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb' => $media->getUrl('thumb'),
                'order' => $media->order_column,
            ])->sortBy('order')->values(),

            'courses' => CourseResource::collection($this->whenLoaded('courses')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
