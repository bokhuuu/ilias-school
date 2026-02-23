<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AboutPageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,

            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,

            'image' => $this->getFirstMediaUrl('image'),
            'image_medium' => $this->getFirstMediaUrl('image', 'medium'),
            'og_image' => $this->getFirstMediaUrl('og_image'),
        ];
    }
}
