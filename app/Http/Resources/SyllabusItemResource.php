<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SyllabusItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'course_id' => $this->course_id,
            'meeting_number' => $this->meeting_number,
            'title' => $this->title,
            'sort_order' => $this->sort_order,
        ];
    }
}
