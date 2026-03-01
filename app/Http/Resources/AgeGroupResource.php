<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgeGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'age_range' => $this->age_range,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,

            'image' => $this->getFirstMediaUrl('image'),
            'image_thumb' => $this->getFirstMediaUrl('image', 'thumb'),
            'image_medium' => $this->getFirstMediaUrl('image', 'medium'),
        ];
    }
}
