import { useState, type FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage } from '@/components/admin/flash-message';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { AboutPage, GalleryImage } from '@/types/models';

interface Props {
    aboutPage: { data: AboutPage };
}

const breadcrumbs = [
    { title: 'დეშბორდი', href: '/admin/dashboard' },
    { title: 'ჩვენ შესახებ', href: '#' },
];

export default function AboutEdit({ aboutPage: { data: about } }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT' as const,
        title: about.title || '',
        content: about.content || '',
        meta_title: about.meta_title || '',
        meta_description: about.meta_description || '',
        image: null as File | null,
        og_image: null as File | null,
        gallery: [] as File[],
        gallery_remove: [] as number[],
        gallery_order: [] as number[],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(about.gallery || []);

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
        post('/admin/about', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ჩვენ შესახებ" />
            <FlashMessage />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">ჩვენ შესახებ</h1>
                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">კონტენტი</h2>
                        <div>
                            <Label htmlFor="title">სათაური *</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            <InputError message={errors.title} />
                        </div>
                        <div>
                            <Label>შინაარსი</Label>
                            <TiptapEditor content={data.content} onChange={(html) => setData('content', html)} placeholder="ჩვენ შესახებ..." />
                        </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">სურათი</h2>
                        {about.image && !imagePreview && <img src={about.image_medium || about.image} alt="" className="mb-2 h-32 rounded-lg object-cover" />}
                        <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] || null; setData('image', f); if (f) setImagePreview(URL.createObjectURL(f)); }} />
                        {imagePreview && <img src={imagePreview} alt="" className="mt-2 h-32 rounded-lg object-cover" />}
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
                            <Label>Meta Title</Label>
                            <Input value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                        </div>
                        <div>
                            <Label>Meta Description</Label>
                            <textarea className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={2} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                        </div>
                        <div>
                            <Label>OG Image</Label>
                            {about.og_image && <img src={about.og_image} alt="" className="mb-2 h-16 rounded" />}
                            <Input type="file" accept="image/*" onChange={(e) => setData('og_image', e.target.files?.[0] || null)} />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>{processing ? 'იტვირთება...' : 'განახლება'}</Button>
                </form>
            </div>
        </AppLayout>
    );
}
