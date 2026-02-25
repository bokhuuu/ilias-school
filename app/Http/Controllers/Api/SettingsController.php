<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SiteSettingService;

class SettingsController extends Controller
{
    public function index(SiteSettingService $service)
    {
        return response()->json($service->all());
    }
}
