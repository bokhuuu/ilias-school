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

export default function AgeGroupsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '', age_range: '', description: '', is_active: true, sort_order: 0, image: null as File | null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/admin/age-groups', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'დეშბორდი', href: '/admin/dashboard' }, { title: 'ასაკობრივი ჯგუფები', href: '/admin/age-groups' }, { title: 'ახალი', href: '/admin/age-groups/create' }]}>
            <Head title="ახალი ასაკობრივი ჯგუფი" />
            <FlashMessage />
            <div className="p-6 max-w-xl">
                <h1 className="text-2xl font-bold mb-6">ახალი ასაკობრივი ჯგუფი</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">სათაური *</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1" />
                        <InputError message={errors.title} />
                    </div>
                    <div>
                        <Label htmlFor="age_range">ასაკობრივი დიაპაზონი *</Label>
                        <Input id="age_range" value={data.age_range} onChange={(e) => setData('age_range', e.target.value)} className="mt-1" placeholder="9-12" />
                        <InputError message={errors.age_range} />
                    </div>
                    <div>
                        <Label htmlFor="description">აღწერა</Label>
                        <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <Label htmlFor="image">სურათი</Label>
                        <Input id="image" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] || null; setData('image', f); if (f) setImagePreview(URL.createObjectURL(f)); }} className="mt-1" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="sort_order">რიგითობა</Label>
                            <Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} className="mt-1" />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(c) => setData('is_active', c as boolean)} />
                            <Label htmlFor="is_active">აქტიური</Label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'ინახება...' : 'შენახვა'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/age-groups">გაუქმება</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
