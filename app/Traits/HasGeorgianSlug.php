<?php

namespace App\Traits;

use App\Support\SlugHelper;
use Spatie\Sluggable\HasSlug;

trait HasGeorgianSlug
{
    use HasSlug;

    protected function generateNonUniqueSlug(): string
    {
        $slugString = $this->getSlugSourceString();

        return $slugString ? SlugHelper::generate($slugString) : '';
    }
}
