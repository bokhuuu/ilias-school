<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AboutPage\UpdateAboutPageRequest;
use App\Http\Resources\AboutPageResource;
use App\Services\AboutPageService;
use Inertia\Inertia;

class AboutPageController extends Controller
{
    public function __construct(
        private AboutPageService $service
    ) {}


    public function edit()
    {
        return Inertia::render('admin/about/edit', [
            'aboutPage' => AboutPageResource::make($this->service->get()),
            'stats' => $this->service->stats(),
        ]);
    }


    public function update(UpdateAboutPageRequest $request)
    {
        $this->service->update($request->validated());

        return redirect()
            ->route('admin.about.edit')
            ->with('success', 'ინფორმაცია წარმატებით განახლდა.');
    }
}
