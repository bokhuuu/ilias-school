<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgeGroupResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\FaqResource;
use App\Http\Resources\AboutPageResource;
use App\Http\Resources\LecturerResource;
use App\Models\AgeGroup;
use App\Models\Course;
use App\Models\Faq;
use App\Models\Lecturer;
use App\Services\AboutPageService;
use App\Services\SiteSettingService;

class HomePageController extends Controller
{
    public function __construct(
        private AboutPageService $aboutService,
        private SiteSettingService $settingService,
    ) {}


    public function index()
    {
        return response()->json([
            'slider' => CourseResource::collection(
                Course::active()
                    ->featuredSorted()
                    ->with(['categories', 'media'])
                    ->get()
            ),
            'lecturers' => LecturerResource::collection(
                Lecturer::active()->sorted()->with('media')->get()
            ),
            'age_groups' => AgeGroupResource::collection(
                AgeGroup::active()->sorted()->get()
            ),
            'about' => AboutPageResource::make($this->aboutService->get()),
            'stats' => [
                'lecturers_count' => Lecturer::active()->count(),
                'courses_count' => Course::active()->count(),
            ],
            'faqs' => FaqResource::collection(
                Faq::active()->sorted()->get()
            ),
            'settings' => $this->settingService->all(),
        ]);
    }
}
