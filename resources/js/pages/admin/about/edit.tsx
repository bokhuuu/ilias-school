import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { AboutPage } from '@/types/models';

interface Props {
    aboutPage: { data: AboutPage };
}

export default function AboutEdit({ aboutPage: { data: about } }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: about.title,
        content: about.content || '',
        meta_title: about.meta_title || '',
        meta_description: about.meta_description || '',
        image: null as File | null,
        og_image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/admin/about', { forceFormData: true });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'დეშბორდი', href: '/admin/dashboard' },
                { title: 'შესახებ', href: '/admin/about' },
            ]}
        >
            <Head title="შესახებ გვერდი" />
            <FlashMessage />

            <div className="max-w-3xl p-6">
                <h1 className="mb-6 text-2xl font-bold">შესახებ გვერდი</h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">
                            ძირითადი ინფორმაცია
                        </h2>

                        <div>
                            <Label htmlFor="title">სათაური *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="mt-1"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div>
                            <Label htmlFor="content">კონტენტი</Label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                rows={12}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <InputError message={errors.content} />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">სურათი</h2>
                        <div>
                            <Label htmlFor="image">მთავარი სურათი</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0] || null;
                                    setData('image', f);
                                    if (f)
                                        setImagePreview(URL.createObjectURL(f));
                                }}
                                className="mt-1"
                            />
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 h-32 rounded-lg object-cover"
                                />
                            ) : about.image_medium ? (
                                <img
                                    src={about.image_medium}
                                    alt="About"
                                    className="mt-2 h-32 rounded-lg object-cover"
                                />
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">SEO</h2>
                        <div>
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input
                                id="meta_title"
                                value={data.meta_title}
                                onChange={(e) =>
                                    setData('meta_title', e.target.value)
                                }
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="meta_description">
                                Meta Description
                            </Label>
                            <textarea
                                id="meta_description"
                                value={data.meta_description}
                                onChange={(e) =>
                                    setData('meta_description', e.target.value)
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <Label htmlFor="og_image">OG Image</Label>
                            <Input
                                id="og_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'og_image',
                                        e.target.files?.[0] || null,
                                    )
                                }
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'ინახება...' : 'განახლება'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
