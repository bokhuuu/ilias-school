import { useState, type FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage } from '@/components/admin/flash-message';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { AgeGroup } from '@/types/models';

interface Props {
    ageGroup: { data: AgeGroup };
}

export default function AgeGroupEdit({ ageGroup: { data: ageGroup } }: Props) {
    const breadcrumbs = [
        { title: 'დეშბორდი', href: '/admin/dashboard' },
        { title: 'ასაკობრივი ჯგუფები', href: '/admin/age-groups' },
        { title: 'რედაქტირება', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT' as const, title: ageGroup.title || '', age_range: ageGroup.age_range || '', description: ageGroup.description || '',
        is_active: ageGroup.is_active, sort_order: ageGroup.sort_order || 0, image: null as File | null,
    });
    const [preview, setPreview] = useState<string | null>(null);

    function submit(e: FormEvent) {
        e.preventDefault();
        post(`/admin/age-groups/${ageGroup.id}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`რედაქტირება: ${ageGroup.title}`} />
            <FlashMessage />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">ჯგუფის რედაქტირება</h1>
                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-lg border p-6 space-y-4">
                        <div>
                            <Label htmlFor="title">სათაური *</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            <InputError message={errors.title} />
                        </div>
                        <div>
                            <Label htmlFor="age_range">ასაკი *</Label>
                            <Input id="age_range" value={data.age_range} onChange={(e) => setData('age_range', e.target.value)} />
                            <InputError message={errors.age_range} />
                        </div>
                        <div>
                            <Label>აღწერა</Label>
                            <TiptapEditor content={data.description} onChange={(html) => setData('description', html)} placeholder="ჯგუფის აღწერა..." />
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
                        {ageGroup.image && !preview && <img src={ageGroup.image_thumb || ageGroup.image} alt="" className="mb-2 h-24 rounded-lg object-cover" />}
                        <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] || null; setData('image', f); if (f) setPreview(URL.createObjectURL(f)); }} />
                        {preview && <img src={preview} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'იტვირთება...' : 'განახლება'}</Button>
                        <Link href="/admin/age-groups"><Button variant="outline" type="button">გაუქმება</Button></Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
