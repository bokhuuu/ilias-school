<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Http\Resources\AgeGroupResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\LecturerResource;
use App\Models\AgeGroup;
use App\Models\Course;
use App\Services\CategoryService;
use App\Services\CourseService;
use App\Services\LecturerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function __construct(
        private CourseService $service,
        private LecturerService $lecturerService,
        private CategoryService $categoryService,
    ) {}


    public function index()
    {
        return Inertia::render('admin/courses/index', [
            'courses' => CourseResource::collection($this->service->all()),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/courses/create', [
            'lecturers' => LecturerResource::collection($this->lecturerService->list()),
            'categories' => CategoryResource::collection($this->categoryService->list()),
            'ageGroups' => AgeGroupResource::collection(AgeGroup::sorted()->get()),
        ]);
    }


    public function store(StoreCourseRequest $request)
    {
        $this->service->store($request->validated());

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'კურსი წარმატებით დაემატა.');
    }


    public function edit(Course $course)
    {
        $course->load('lecturers', 'categories', 'syllabusItems', 'media', 'ageGroup');

        return Inertia::render('admin/courses/edit', [
            'course' => CourseResource::make($course),
            'lecturers' => LecturerResource::collection($this->lecturerService->list()),
            'categories' => CategoryResource::collection($this->categoryService->list()),
            'ageGroups' => AgeGroupResource::collection(AgeGroup::sorted()->get()),
        ]);
    }


    public function update(UpdateCourseRequest $request, Course $course)
    {
        $this->service->update($course, $request->validated());

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'კურსი წარმატებით განახლდა.');
    }


    public function destroy(Course $course)
    {
        $this->service->delete($course);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'კურსი წარმატებით წაიშალა.');
    }


    public function reorder(Request $request)
    {
        $request->validate(['ids' => ['required', 'array']]);

        $this->service->reorder($request->ids);

        return back()->with('success', 'თანმიმდევრობა განახლდა.');
    }


    public function toggleActive(Course $course)
    {
        $course->update(['is_active' => !$course->is_active]);
        return back();
    }
}
