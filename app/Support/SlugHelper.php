<?php

namespace App\Support;

class SlugHelper
{
    public static function generate(string $string): string
    {
        $slug = mb_strtolower($string, 'UTF-8');
        $slug = preg_replace('/\s+/u', '-', trim($slug));
        $slug = preg_replace('/[^\p{L}\p{N}\-]/u', '', $slug);
        $slug = preg_replace('/-+/', '-', $slug);

        return trim($slug, '-');
    }
}
