<?php

namespace App\Traits;

trait ClearsInertiaCache
{
    protected static function bootClearsInertiaCache(): void
    {
        static::created(fn() => cache()->increment('inertia_version'));
        static::updated(fn() => cache()->increment('inertia_version'));
        static::deleted(fn() => cache()->increment('inertia_version'));
    }
}
