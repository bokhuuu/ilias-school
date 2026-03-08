<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\AgeGroup;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::active()
            ->sorted()
            ->with(['lecturers', 'categories', 'media', 'ageGroup']);

        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        return CourseResource::collection($query->paginate(12));
    }


    public function show(Course $course)
    {
        $course->load(['lecturers', 'lecturers.media', 'categories', 'syllabusItems', 'media', 'ageGroup']);

        return CourseResource::make($course);
    }
}
