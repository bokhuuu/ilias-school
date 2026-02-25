<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Faq\StoreFaqRequest;
use App\Http\Requests\Faq\UpdateFaqRequest;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Services\FaqService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function __construct(
        private FaqService $service
    ) {}


    public function index()
    {
        return Inertia::render('admin/faqs/index', [
            'faqs' => FaqResource::collection($this->service->all()),
        ]);
    }


    public function create()
    {
        return Inertia::render('admin/faqs/create');
    }


    public function store(StoreFaqRequest $request)
    {
        $this->service->store($request->validated());

        return redirect()
            ->route('admin.faqs.index')
            ->with('success', 'FAQ წარმატებით დაემატა.');
    }


    public function edit(Faq $faq)
    {
        return Inertia::render('admin/faqs/edit', [
            'faq' => FaqResource::make($faq),
        ]);
    }


    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $this->service->update($faq, $request->validated());

        return redirect()
            ->route('admin.faqs.index')
            ->with('success', 'FAQ წარმატებით განახლდა.');
    }


    public function destroy(Faq $faq)
    {
        $this->service->delete($faq);

        return redirect()
            ->route('admin.faqs.index')
            ->with('success', 'FAQ წარმატებით წაიშალა.');
    }


    public function reorder(Request $request)
    {
        $request->validate(['ids' => ['required', 'array']]);

        $this->service->reorder($request->ids);

        return back()->with('success', 'თანმიმდევრობა განახლდა.');
    }


    public function toggleActive(Faq $faq)
    {
        $faq->update(['is_active' => !$faq->is_active]);
        return back();
    }
}
