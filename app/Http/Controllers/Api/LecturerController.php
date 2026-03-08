<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LecturerResource;
use App\Models\Lecturer;

class LecturerController extends Controller
{
    public function index()
    {
        return LecturerResource::collection(
            Lecturer::active()
                ->sorted()
                ->with('media')
                ->paginate(12)
        );
    }


    public function show(Lecturer $lecturer)
    {
        $lecturer->load(['courses', 'courses.media', 'courses.categories', 'media']);

        return LecturerResource::make($lecturer);
    }
}
