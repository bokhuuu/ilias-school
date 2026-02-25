import { Head, useForm, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { Category } from '@/types/models';

interface Props {
    category: { data: Category };
}

export default function CategoriesEdit({ category: { data: category } }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        sort_order: category.sort_order,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/categories/${category.slug}`);
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'კატეგორიები', href: '/admin/categories' },
            { title: category.name, href: `/admin/categories/${category.slug}/edit` },
        ]}>
            <Head title={`რედაქტირება — ${category.name}`} />
            <FlashMessage />
            <div className="p-6 max-w-xl">
                <h1 className="text-2xl font-bold mb-6">კატეგორიის რედაქტირება</h1>
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
                        <Button type="submit" disabled={processing}>{processing ? 'ინახება...' : 'განახლება'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/categories">გაუქმება</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
