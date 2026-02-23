<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AgeGroup\StoreAgeGroupRequest;
use App\Http\Requests\AgeGroup\UpdateAgeGroupRequest;
use App\Http\Resources\AgeGroupResource;
use App\Models\AgeGroup;
use App\Services\AgeGroupService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgeGroupController extends Controller
{
    public function __construct(
        private AgeGroupService $service
    ) {}


    public function index()
    {
        return Inertia::render('admin/age-groups/index', [
            'ageGroups' => AgeGroupResource::collection($this->service->all()),
        ]);
    }


    public function create()
    {
        return Inertia::render('admin/age-groups/create');
    }


    public function store(StoreAgeGroupRequest $request)
    {
        $this->service->store($request->validated());

        return redirect()
            ->route('admin.age-groups.index')
            ->with('success', 'ასაკობრივი ჯგუფი წარმატებით დაემატა.');
    }


    public function edit(AgeGroup $ageGroup)
    {
        $ageGroup->load('media');

        return Inertia::render('admin/age-groups/edit', [
            'ageGroup' => AgeGroupResource::make($ageGroup),
        ]);
    }


    public function update(UpdateAgeGroupRequest $request, AgeGroup $ageGroup)
    {
        $this->service->update($ageGroup, $request->validated());

        return redirect()
            ->route('admin.age-groups.index')
            ->with('success', 'ასაკობრივი ჯგუფი წარმატებით განახლდა.');
    }


    public function destroy(AgeGroup $ageGroup)
    {
        $this->service->delete($ageGroup);

        return redirect()
            ->route('admin.age-groups.index')
            ->with('success', 'ასაკობრივი ჯგუფი წარმატებით წაიშალა.');
    }


    public function reorder(Request $request)
    {
        $request->validate(['ids' => ['required', 'array']]);

        $this->service->reorder($request->ids);

        return back()->with('success', 'თანმიმდევრობა განახლდა.');
    }
}
