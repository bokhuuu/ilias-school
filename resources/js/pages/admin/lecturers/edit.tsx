import { Head, Link, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { GalleryImage, Lecturer } from '@/types/models';

interface Props {
    lecturer: { data: Lecturer };
}

export default function LecturerEdit({ lecturer: { data: lecturer } }: Props) {
    const breadcrumbs = [
        { title: 'დეშბორდი', href: '/admin/dashboard' },
        { title: 'ლექტორები', href: '/admin/lecturers' },
        { title: 'რედაქტირება', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT' as const,
        full_name: lecturer.full_name || '',
        title: lecturer.title || '',
        bio: lecturer.bio || '',
        short_bio: lecturer.short_bio || '',
        meta_title: lecturer.meta_title || '',
        meta_description: lecturer.meta_description || '',
        is_active: lecturer.is_active,
        sort_order: lecturer.sort_order || 0,
        image: null as File | null,
        og_image: null as File | null,
        gallery: [] as File[],
        gallery_remove: [] as number[],
        gallery_order: [] as number[],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(lecturer.gallery || []);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        if (file) setImagePreview(URL.createObjectURL(file));
    }

    function handleGalleryRemove(id: number) {
        setGalleryImages((prev) => prev.filter((img) => img.id !== id));
        setData('gallery_remove', [...data.gallery_remove, id]);
    }

    function handleGalleryReorder(images: GalleryImage[]) {
        setGalleryImages(images);
        setData('gallery_order', images.map((img) => img.id));
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        post(`/admin/lecturers/${lecturer.slug}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`რედაქტირება: ${lecturer.full_name}`} />
            <FlashMessage />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">ლექტორის რედაქტირება</h1>

                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">ძირითადი ინფორმაცია</h2>

                        <div>
                            <Label htmlFor="full_name">სახელი და გვარი *</Label>
                            <Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                            <InputError message={errors.full_name} />
                        </div>

                        <div>
                            <Label htmlFor="title">თანამდებობა</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            <InputError message={errors.title} />
                        </div>

                        <div>
                            <Label>მოკლე ბიო</Label>
                            <textarea
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                rows={2}
                                value={data.short_bio}
                                onChange={(e) => setData('short_bio', e.target.value)}
                            />
                            <InputError message={errors.short_bio} />
                        </div>

                        <div>
                            <Label>ბიოგრაფია</Label>
                            <TiptapEditor content={data.bio} onChange={(html) => setData('bio', html)} placeholder="ლექტორის ბიოგრაფია..." />
                            <InputError message={errors.bio} />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                აქტიური
                            </label>
                        </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">სურათი</h2>
                        <div>
                            <Label htmlFor="image">პროფილის სურათი</Label>
                            {lecturer.image && !imagePreview && (
                                <img src={lecturer.image_thumb || lecturer.image} alt="" className="mb-2 h-24 w-24 rounded-lg object-cover" />
                            )}
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-24 w-24 rounded-lg object-cover" />}
                            <InputError message={errors.image} />
                        </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">გალერეა</h2>
                        <GalleryManager
                            images={galleryImages}
                            onRemove={handleGalleryRemove}
                            onReorder={handleGalleryReorder}
                            newFiles={data.gallery}
                            onNewFilesChange={(files) => setData('gallery', files)}
                        />
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">SEO</h2>
                        <div>
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <textarea
                                id="meta_description"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                rows={2}
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="og_image">OG Image</Label>
                            {lecturer.og_image && <img src={lecturer.og_image} alt="" className="mb-2 h-16 rounded" />}
                            <Input id="og_image" type="file" accept="image/*" onChange={(e) => setData('og_image', e.target.files?.[0] || null)} />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'იტვირთება...' : 'განახლება'}
                        </Button>
                        <Link href="/admin/lecturers">
                            <Button variant="outline" type="button">გაუქმება</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
