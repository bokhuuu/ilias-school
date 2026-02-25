<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lecturer\StoreLecturerRequest;
use App\Http\Requests\Lecturer\UpdateLecturerRequest;
use App\Http\Resources\LecturerResource;
use App\Models\Lecturer;
use App\Services\LecturerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerController extends Controller
{
    public function __construct(
        private LecturerService $service
    ) {}


    public function index()
    {
        return Inertia::render('admin/lecturers/index', [
            'lecturers' => LecturerResource::collection($this->service->all()),
        ]);
    }


    public function create()
    {
        return Inertia::render('admin/lecturers/create');
    }


    public function store(StoreLecturerRequest $request)
    {
        $this->service->store($request->validated());

        return redirect()
            ->route('admin.lecturers.index')
            ->with('success', 'ლექტორი წარმატებით დაემატა.');
    }


    public function edit(Lecturer $lecturer)
    {
        $lecturer->load('courses', 'media');

        return Inertia::render('admin/lecturers/edit', [
            'lecturer' => LecturerResource::make($lecturer),
        ]);
    }


    public function update(UpdateLecturerRequest $request, Lecturer $lecturer)
    {
        $this->service->update($lecturer, $request->validated());

        return redirect()
            ->route('admin.lecturers.index')
            ->with('success', 'ლექტორი წარმატებით განახლდა.');
    }


    public function destroy(Lecturer $lecturer)
    {
        $this->service->delete($lecturer);

        return redirect()
            ->route('admin.lecturers.index')
            ->with('success', 'ლექტორი წარმატებით წაიშალა.');
    }


    public function reorder(Request $request)
    {
        $request->validate(['ids' => ['required', 'array']]);

        $this->service->reorder($request->ids);

        return back()->with('success', 'თანმიმდევრობა განახლდა.');
    }


    public function toggleActive(Lecturer $lecturer)
    {
        $lecturer->update(['is_active' => !$lecturer->is_active]);
        return back();
    }
}
