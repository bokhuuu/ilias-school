import { Head, useForm, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sort_order: 0,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/admin/categories');
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'კატეგორიები', href: '/admin/categories' },
            { title: 'ახალი', href: '/admin/categories/create' },
        ]}>
            <Head title="ახალი კატეგორია" />
            <FlashMessage />
            <div className="p-6 max-w-xl">
                <h1 className="text-2xl font-bold mb-6">ახალი კატეგორია</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">სახელი *</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1" />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label htmlFor="sort_order">რიგითობა</Label>
                        <Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} className="mt-1" />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'ინახება...' : 'შენახვა'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/categories">გაუქმება</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
