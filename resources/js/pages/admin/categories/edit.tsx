import { type FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage } from '@/components/admin/flash-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { Category } from '@/types/models';

interface Props {
    category: { data: Category };
}

export default function CategoryEdit({ category: { data: category } }: Props) {
    const breadcrumbs = [
        { title: 'დეშბორდი', href: '/admin/dashboard' },
        { title: 'კატეგორიები', href: '/admin/categories' },
        { title: 'რედაქტირება', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({ name: category.name || '', sort_order: category.sort_order || 0 });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`რედაქტირება: ${category.name}`} />
            <FlashMessage />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">კატეგორიის რედაქტირება</h1>
                <form onSubmit={submit} className="max-w-md space-y-4">
                    <div>
                        <Label htmlFor="name">სახელი *</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'იტვირთება...' : 'განახლება'}</Button>
                        <Link href="/admin/categories"><Button variant="outline" type="button">გაუქმება</Button></Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
