<?php

namespace App\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'age_group_id' => ['nullable', 'exists:age_groups,id'],
            'format' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'video_url' => ['nullable', 'url', 'max:512'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'featured_sort_order' => ['integer', 'min:0'],
            'sort_order' => ['integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:2048'],
            'og_image' => ['nullable', 'image', 'max:2048'],

            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image', 'max:5120'],
            'gallery_remove' => ['nullable', 'array'],
            'gallery_remove.*' => ['integer'],
            'gallery_order' => ['nullable', 'array'],
            'gallery_order.*' => ['integer'],

            'lecturer_ids' => ['nullable', 'array'],
            'lecturer_ids.*' => ['exists:lecturers,id'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],

            'syllabus_items' => ['nullable', 'array'],
            'syllabus_items.*.id' => ['nullable', 'exists:syllabus_items,id'],
            'syllabus_items.*.meeting_number' => ['required', 'integer', 'min:1'],
            'syllabus_items.*.title' => ['required', 'string', 'max:255'],
            'syllabus_items.*.content' => ['nullable', 'string'],
            'syllabus_items.*.sort_order' => ['integer', 'min:0'],
        ];
    }
}
