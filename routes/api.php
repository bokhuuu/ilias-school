<?php

use App\Http\Controllers\Api\AboutPageController;
use App\Http\Controllers\Api\AgeGroupController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\HomePageController;
use App\Http\Controllers\Api\LecturerController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/homepage', [HomePageController::class, 'index']);

    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);

    Route::get('/lecturers', [LecturerController::class, 'index']);
    Route::get('/lecturers/{lecturer}', [LecturerController::class, 'show']);

    Route::get('/categories', [CategoryController::class, 'index']);

    Route::get('/about', [AboutPageController::class, 'index']);
    Route::get('/faqs', [FaqController::class, 'index']);

    Route::get('/age-groups', [AgeGroupController::class, 'index']);

    Route::get('/settings', [SettingsController::class, 'index']);
});
