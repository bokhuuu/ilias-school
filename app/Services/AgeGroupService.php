<?php

namespace App\Services;

use App\Models\AgeGroup;
use Illuminate\Http\UploadedFile;

class AgeGroupService
{
    public function index()
    {
        return AgeGroup::active()->sorted()->get();
    }


    public function all()
    {
        return AgeGroup::sorted()->get();
    }


    public function store(array $data): AgeGroup
    {
        $ageGroup = AgeGroup::create($this->extractFields($data));

        $this->handleMedia($ageGroup, $data);

        return $ageGroup;
    }


    public function update(AgeGroup $ageGroup, array $data): AgeGroup
    {
        $ageGroup->update($this->extractFields($data));

        $this->handleMedia($ageGroup, $data);

        return $ageGroup;
    }


    public function delete(AgeGroup $ageGroup): void
    {
        $ageGroup->delete();
    }


    public function reorder(array $ids): void
    {
        foreach ($ids as $index => $id) {
            AgeGroup::where('id', $id)->update(['sort_order' => $index]);
        }
    }


    private function extractFields(array $data): array
    {
        return collect($data)->only([
            'title',
            'age_range',
            'description',
            'is_active',
            'sort_order',
        ])->toArray();
    }


    private function handleMedia(AgeGroup $ageGroup, array $data): void
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $ageGroup->addMedia($data['image'])->toMediaCollection('image');
        }
    }
}
