import { Head, useForm, Link } from '@inertiajs/react';
import type { FormEvent} from 'react';
import { useState } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

export default function LecturersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        title: '',
        bio: '',
        short_bio: '',
        meta_title: '',
        meta_description: '',
        is_active: true,
        sort_order: 0,
        image: null as File | null,
        og_image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/admin/lecturers', {
            forceFormData: true,
        });
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'ლექტორები', href: '/admin/lecturers' },
            { title: 'ახალი', href: '/admin/lecturers/create' },
        ]}>
            <Head title="ახალი ლექტორი" />
            <FlashMessage />

            <div className="p-6 max-w-3xl">
                <h1 className="text-2xl font-bold mb-6">ახალი ლექტორი</h1>

                <form onSubmit={submit} className="space-y-6">
                    {/* Main Fields */}
                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">ძირითადი ინფორმაცია</h2>

                        <div>
                            <Label htmlFor="full_name">სახელი და გვარი *</Label>
                            <Input
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                className="mt-1"
                            />
                            <InputError message={errors.full_name} />
                        </div>

                        <div>
                            <Label htmlFor="title">თანამდებობა</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div>
                            <Label htmlFor="short_bio">მოკლე ბიოგრაფია</Label>
                            <textarea
                                id="short_bio"
                                value={data.short_bio}
                                onChange={(e) => setData('short_bio', e.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <InputError message={errors.short_bio} />
                        </div>

                        <div>
                            <Label htmlFor="bio">სრული ბიოგრაფია</Label>
                            <textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                rows={8}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <InputError message={errors.bio} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="sort_order">რიგითობა</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className="mt-1"
                                />
                                <InputError message={errors.sort_order} />
                            </div>

                            <div className="flex items-center gap-2 pt-6">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active">აქტიური</Label>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">სურათი</h2>

                        <div>
                            <Label htmlFor="image">პროფილის სურათი</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1"
                            />
                            <InputError message={errors.image} />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 h-32 w-32 rounded-lg object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">SEO</h2>

                        <div>
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input
                                id="meta_title"
                                value={data.meta_title}
                                onChange={(e) => setData('meta_title', e.target.value)}
                                className="mt-1"
                            />
                            <InputError message={errors.meta_title} />
                        </div>

                        <div>
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <textarea
                                id="meta_description"
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <InputError message={errors.meta_description} />
                        </div>

                        <div>
                            <Label htmlFor="og_image">OG Image (1200x630)</Label>
                            <Input
                                id="og_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('og_image', e.target.files?.[0] || null)}
                                className="mt-1"
                            />
                            <InputError message={errors.og_image} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'ინახება...' : 'შენახვა'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/lecturers">გაუქმება</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
