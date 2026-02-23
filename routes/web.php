<?php

use App\Http\Controllers\Admin\AboutPageController;
use App\Http\Controllers\Admin\AgeGroupController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\LecturerController;
use App\Http\Controllers\Admin\SiteSettingController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('admin.dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('lecturers', LecturerController::class)->except(['show']);
    Route::post('lecturers/reorder', [LecturerController::class, 'reorder'])->name('lecturers.reorder');

    Route::resource('courses', CourseController::class)->except(['show']);
    Route::post('courses/reorder', [CourseController::class, 'reorder'])->name('courses.reorder');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::post('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');

    Route::resource('age-groups', AgeGroupController::class)->except(['show']);
    Route::post('age-groups/reorder', [AgeGroupController::class, 'reorder'])->name('age-groups.reorder');

    Route::resource('faqs', FaqController::class)->except(['show']);
    Route::post('faqs/reorder', [FaqController::class, 'reorder'])->name('faqs.reorder');

    Route::get('about', [AboutPageController::class, 'edit'])->name('about.edit');
    Route::put('about', [AboutPageController::class, 'update'])->name('about.update');

    Route::get('settings', [SiteSettingController::class, 'edit'])->name('settings.edit');
    Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');
});


require __DIR__ . '/settings.php';
