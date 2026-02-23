<?php

namespace App\Services;

use App\Models\Faq;

class FaqService
{
    public function index()
    {
        return Faq::active()->sorted()->get();
    }


    public function all()
    {
        return Faq::sorted()->get();
    }


    public function store(array $data): Faq
    {
        return Faq::create($data);
    }


    public function update(Faq $faq, array $data): Faq
    {
        $faq->update($data);

        return $faq;
    }


    public function delete(Faq $faq): void
    {
        $faq->delete();
    }


    public function reorder(array $ids): void
    {
        foreach ($ids as $index => $id) {
            Faq::where('id', $id)->update(['sort_order' => $index]);
        }
    }
}
