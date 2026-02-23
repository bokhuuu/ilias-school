<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    public function all()
    {
        return Category::sorted()->get();
    }


    public function store(array $data): Category
    {
        return Category::create($data);
    }


    public function update(Category $category, array $data): Category
    {
        $category->update($data);

        return $category;
    }


    public function delete(Category $category): void
    {
        $category->delete();
    }


    public function reorder(array $ids): void
    {
        foreach ($ids as $index => $id) {
            Category::where('id', $id)->update(['sort_order' => $index]);
        }
    }
}
