<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::active()
            ->sorted()
            ->with(['lecturers', 'categories', 'media']);

        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        return CourseResource::collection($query->get());
    }


    public function show(Course $course)
    {
        $course->load(['lecturers', 'lecturers.media', 'categories', 'syllabusItems', 'media']);

        return CourseResource::make($course);
    }
}
