<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SiteSetting\UpdateSiteSettingsRequest;
use App\Services\SiteSettingService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function __construct(
        private SiteSettingService $service
    ) {}


    public function edit(Request $request)
    {
        return Inertia::render('admin/settings/edit', [
            'settings' => $this->service->all(),
            'tokens' => $request->user()->tokens()->orderByDesc('created_at')->get()->map(fn($token) => [
                'id' => $token->id,
                'name' => $token->name,
                'created_at' => $token->created_at->toISOString(),
                'last_used_at' => $token->last_used_at?->toISOString(),
            ]),
            'newToken' => session('newToken'),
        ]);
    }


    public function update(UpdateSiteSettingsRequest $request)
    {
        $this->service->update($request->validated());

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', 'პარამეტრები წარმატებით განახლდა.');
    }


    public function createToken(Request $request)
    {
        $request->validate(['name' => ['required', 'string', 'max:255']]);

        $token = $request->user()->createToken($request->name);

        return redirect()
            ->route('admin.settings.edit')
            ->with('newToken', $token->plainTextToken);
    }


    public function revokeToken(Request $request, int $token)
    {
        $request->user()->tokens()->where('id', $token)->delete();

        return back()->with('success', 'ტოკენი წაიშალა.');
    }
}
