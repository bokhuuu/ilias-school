<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SiteSetting\UpdateSiteSettingsRequest;
use App\Services\SiteSettingService;
use Inertia\Inertia;

class SiteSettingController extends Controller
{
    public function __construct(
        private SiteSettingService $service
    ) {}


    public function edit()
    {
        return Inertia::render('admin/settings/edit', [
            'settings' => $this->service->all(),
        ]);
    }


    public function update(UpdateSiteSettingsRequest $request)
    {
        $this->service->update($request->validated());

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', 'პარამეტრები წარმატებით განახლდა.');
    }
}
