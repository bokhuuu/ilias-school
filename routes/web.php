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

    Route::post('lecturers/reorder', [LecturerController::class, 'reorder'])->name('lecturers.reorder');
    Route::post('lecturers/{lecturer}/toggle-active', [LecturerController::class, 'toggleActive'])->name('lecturers.toggle-active');
    Route::resource('lecturers', LecturerController::class)->except(['show']);

    Route::post('courses/reorder', [CourseController::class, 'reorder'])->name('courses.reorder');
    Route::post('courses/{course}/toggle-active', [CourseController::class, 'toggleActive'])->name('courses.toggle-active');
    Route::resource('courses', CourseController::class)->except(['show']);

    Route::post('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');
    Route::resource('categories', CategoryController::class)->except(['show']);

    Route::post('age-groups/reorder', [AgeGroupController::class, 'reorder'])->name('age-groups.reorder');
    Route::post('age-groups/{ageGroup}/toggle-active', [AgeGroupController::class, 'toggleActive'])->name('age-groups.toggle-active');
    Route::resource('age-groups', AgeGroupController::class)->except(['show']);

    Route::post('faqs/reorder', [FaqController::class, 'reorder'])->name('faqs.reorder');
    Route::post('faqs/{faq}/toggle-active', [FaqController::class, 'toggleActive'])->name('faqs.toggle-active');
    Route::resource('faqs', FaqController::class)->except(['show']);

    Route::get('about', [AboutPageController::class, 'edit'])->name('about.edit');
    Route::put('about', [AboutPageController::class, 'update'])->name('about.update');

    Route::get('settings', [SiteSettingController::class, 'edit'])->name('settings.edit');
    Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');

    Route::post('settings/tokens', [SiteSettingController::class, 'createToken'])->name('settings.create-token');
    Route::delete('settings/tokens/{token}', [SiteSettingController::class, 'revokeToken'])->name('settings.revoke-token');
});


require __DIR__ . '/settings.php';
