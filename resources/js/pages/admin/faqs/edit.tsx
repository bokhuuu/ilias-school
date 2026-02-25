import { Head, useForm, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { Faq } from '@/types/models';

interface Props { faq: { data: Faq }; }

export default function FaqsEdit({ faq: { data: faq } }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        question: faq.question,
        answer: faq.answer,
        is_active: faq.is_active,
        sort_order: faq.sort_order,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/faqs/${faq.id}`);
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'FAQ', href: '/admin/faqs' },
            { title: 'რედაქტირება', href: `/admin/faqs/${faq.id}/edit` },
        ]}>
            <Head title="FAQ რედაქტირება" />
            <FlashMessage />
            <div className="p-6 max-w-xl">
                <h1 className="text-2xl font-bold mb-6">კითხვის რედაქტირება</h1>
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
                        <Button type="submit" disabled={processing}>{processing ? 'ინახება...' : 'განახლება'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/faqs">გაუქმება</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
