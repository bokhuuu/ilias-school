<?php

namespace App\Services;

use App\Models\Lecturer;
use Illuminate\Http\UploadedFile;

class LecturerService
{
    public function index()
    {
        return Lecturer::active()
            ->sorted()
            ->get();
    }


    public function all()
    {
        return Lecturer::sorted()->paginate(20);
    }


    public function list()
    {
        return Lecturer::sorted()->get();
    }


    public function store(array $data): Lecturer
    {
        $lecturer = Lecturer::create($this->extractFields($data));

        $this->handleMedia($lecturer, $data);

        return $lecturer;
    }


    public function update(Lecturer $lecturer, array $data): Lecturer
    {
        $lecturer->update($this->extractFields($data));

        $this->handleMedia($lecturer, $data);

        return $lecturer;
    }


    public function delete(Lecturer $lecturer): void
    {
        $lecturer->delete();
    }


    public function reorder(array $ids): void
    {
        foreach ($ids as $index => $id) {
            Lecturer::where('id', $id)->update(['sort_order' => $index]);
        }
    }


    private function extractFields(array $data): array
    {
        return collect($data)->only([
            'full_name',
            'title',
            'bio',
            'short_bio',
            'meta_title',
            'meta_description',
            'is_active',
            'sort_order',
        ])->toArray();
    }


    private function handleMedia(Lecturer $lecturer, array $data): void
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $lecturer->addMedia($data['image'])->toMediaCollection('image');
        }

        if (isset($data['og_image']) && $data['og_image'] instanceof UploadedFile) {
            $lecturer->addMedia($data['og_image'])->toMediaCollection('og_image');
        }

        if (isset($data['gallery']) && is_array($data['gallery'])) {
            foreach ($data['gallery'] as $file) {
                if ($file instanceof UploadedFile) {
                    $lecturer->addMedia($file)->toMediaCollection('gallery');
                }
            }
        }

        if (!empty($data['gallery_remove'])) {
            $lecturer->media()->whereIn('id', $data['gallery_remove'])->get()->each->delete();
        }

        if (!empty($data['gallery_order'])) {
            foreach ($data['gallery_order'] as $index => $mediaId) {
                $lecturer->media()->where('id', $mediaId)->update(['order_column' => $index]);
            }
        }
    }
}
