<?php

namespace App\Services;

use App\Models\Course;
use Illuminate\Http\UploadedFile;

class CourseService
{
    public function index()
    {
        return Course::active()
            ->sorted()
            ->with(['lecturers', 'categories'])
            ->get();
    }


    public function all()
    {
        return Course::sorted()
            ->with(['lecturers', 'categories', 'ageGroup'])
            ->withCount('syllabusItems')
            ->get();
    }


    public function featured()
    {
        return Course::active()
            ->featuredSorted()
            ->with(['categories'])
            ->get();
    }


    public function store(array $data): Course
    {
        $course = Course::create($this->extractFields($data));

        $this->syncRelationships($course, $data);
        $this->syncSyllabusItems($course, $data);
        $this->handleMedia($course, $data);

        return $course;
    }


    public function update(Course $course, array $data): Course
    {
        $course->update($this->extractFields($data));

        $this->syncRelationships($course, $data);
        $this->syncSyllabusItems($course, $data);
        $this->handleMedia($course, $data);

        return $course;
    }


    public function delete(Course $course): void
    {
        $course->delete();
    }


    public function reorder(array $ids): void
    {
        foreach ($ids as $index => $id) {
            Course::where('id', $id)->update(['sort_order' => $index]);
        }
    }


    private function extractFields(array $data): array
    {
        return collect($data)->only([
            'title',
            'description',
            'short_description',
            'age_group_id',
            'format',
            'duration',
            'video_url',
            'meta_title',
            'meta_description',
            'is_active',
            'is_featured',
            'featured_sort_order',
            'sort_order',
        ])->toArray();
    }


    private function syncRelationships(Course $course, array $data): void
    {
        if (isset($data['lecturer_ids'])) {
            $course->lecturers()->sync($data['lecturer_ids']);
        }

        if (isset($data['category_ids'])) {
            $course->categories()->sync($data['category_ids']);
        }
    }


    private function syncSyllabusItems(Course $course, array $data): void
    {
        if (!isset($data['syllabus_items'])) {
            return;
        }

        $submittedIds = collect($data['syllabus_items'])
            ->pluck('id')
            ->filter()
            ->toArray();

        $course->syllabusItems()
            ->whereNotIn('id', $submittedIds)
            ->delete();

        foreach ($data['syllabus_items'] as $index => $item) {
            $course->syllabusItems()->updateOrCreate(
                ['id' => $item['id'] ?? null],
                [
                    'meeting_number' => $item['meeting_number'],
                    'title' => $item['title'],
                    'content' => $item['content'] ?? '',
                    'sort_order' => $item['sort_order'] ?? $index,
                ]
            );
        }
    }


    private function handleMedia(Course $course, array $data): void
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $course->addMedia($data['image'])->toMediaCollection('image');
        }

        if (isset($data['og_image']) && $data['og_image'] instanceof UploadedFile) {
            $course->addMedia($data['og_image'])->toMediaCollection('og_image');
        }

        if (isset($data['gallery']) && is_array($data['gallery'])) {
            foreach ($data['gallery'] as $file) {
                if ($file instanceof UploadedFile) {
                    $course->addMedia($file)->toMediaCollection('gallery');
                }
            }
        }

        if (!empty($data['gallery_remove'])) {
            $course->media()->whereIn('id', $data['gallery_remove'])->get()->each->delete();
        }

        if (!empty($data['gallery_order'])) {
            foreach ($data['gallery_order'] as $index => $mediaId) {
                $course->media()->where('id', $mediaId)->update(['order_column' => $index]);
            }
        }
    }
}
