<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgeGroupResource;
use App\Models\AgeGroup;

class AgeGroupController extends Controller
{
    public function index()
    {
        return AgeGroupResource::collection(
            AgeGroup::active()->sorted()->with('media')->get()
        );
    }
}
