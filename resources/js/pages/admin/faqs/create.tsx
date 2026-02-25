import { Head, useForm, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

export default function FaqsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        question: '',
        answer: '',
        is_active: true,
        sort_order: 0,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/admin/faqs');
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'FAQ', href: '/admin/faqs' },
            { title: 'ახალი', href: '/admin/faqs/create' },
        ]}>
            <Head title="ახალი კითხვა" />
            <FlashMessage />
            <div className="p-6 max-w-xl">
                <h1 className="text-2xl font-bold mb-6">ახალი კითხვა</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="question">კითხვა *</Label>
                        <Input id="question" value={data.question} onChange={(e) => setData('question', e.target.value)} className="mt-1" />
                        <InputError message={errors.question} />
                    </div>
                    <div>
                        <Label htmlFor="answer">პასუხი *</Label>
                        <textarea id="answer" value={data.answer} onChange={(e) => setData('answer', e.target.value)} rows={6} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                        <InputError message={errors.answer} />
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
                        <Button variant="outline" asChild><Link href="/admin/faqs">გაუქმება</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
