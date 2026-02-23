<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $service
    ) {}


    public function index()
    {
        return Inertia::render('admin/categories/index', [
            'categories' => CategoryResource::collection($this->service->all()),
        ]);
    }


    public function create()
    {
        return Inertia::render('admin/categories/create');
    }


    public function store(StoreCategoryRequest $request)
    {
        $this->service->store($request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'კატეგორია წარმატებით დაემატა.');
    }


    public function edit(Category $category)
    {
        return Inertia::render('admin/categories/edit', [
            'category' => CategoryResource::make($category),
        ]);
    }


    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->service->update($category, $request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'კატეგორია წარმატებით განახლდა.');
    }


    public function destroy(Category $category)
    {
        $this->service->delete($category);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'კატეგორია წარმატებით წაიშალა.');
    }


    public function reorder(Request $request)
    {
        $request->validate(['ids' => ['required', 'array']]);

        $this->service->reorder($request->ids);

        return back()->with('success', 'თანმიმდევრობა განახლდა.');
    }
}
