<?php

namespace App\Services;

use App\Models\AboutPage;
use App\Models\Course;
use App\Models\Lecturer;
use Illuminate\Http\UploadedFile;

class AboutPageService
{
    public function get(): AboutPage
    {
        return AboutPage::firstOrCreate(
            ['id' => 1],
            ['title' => ['ka' => 'პროექტის შესახებ'], 'content' => ['ka' => '']]
        );
    }


    public function update(array $data): AboutPage
    {
        $aboutPage = $this->get();

        $aboutPage->update($this->extractFields($data));

        $this->handleMedia($aboutPage, $data);

        return $aboutPage;
    }


    public function stats(): array
    {
        return [
            'lecturers_count' => Lecturer::active()->count(),
            'courses_count' => Course::active()->count(),
        ];
    }


    private function extractFields(array $data): array
    {
        return collect($data)->only([
            'title',
            'content',
            'meta_title',
            'meta_description',
        ])->toArray();
    }


    private function handleMedia(AboutPage $aboutPage, array $data): void
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $aboutPage->addMedia($data['image'])->toMediaCollection('image');
        }

        if (isset($data['og_image']) && $data['og_image'] instanceof UploadedFile) {
            $aboutPage->addMedia($data['og_image'])->toMediaCollection('og_image');
        }
    }
}
