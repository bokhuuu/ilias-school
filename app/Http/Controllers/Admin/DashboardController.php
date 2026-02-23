<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Faq;
use App\Models\Lecturer;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'lecturers_count' => Lecturer::active()->count(),
                'courses_count' => Course::active()->count(),
                'total_lecturers' => Lecturer::count(),
                'total_courses' => Course::count(),
                'total_faqs' => Faq::count(),
            ],
        ]);
    }
}
