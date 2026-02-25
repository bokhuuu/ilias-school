import { type FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage } from '@/components/admin/flash-message';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs = [
    { title: 'დეშბორდი', href: '/admin/dashboard' },
    { title: 'FAQ', href: '/admin/faqs' },
    { title: 'ახალი', href: '#' },
];

export default function FaqCreate() {
    const { data, setData, post, processing, errors } = useForm({
        question: '', answer: '', is_active: true, sort_order: 0,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/admin/faqs');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ახალი კითხვა" />
            <FlashMessage />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">ახალი კითხვა</h1>
                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-lg border p-6 space-y-4">
                        <div>
                            <Label htmlFor="question">კითხვა *</Label>
                            <Input id="question" value={data.question} onChange={(e) => setData('question', e.target.value)} />
                            <InputError message={errors.question} />
                        </div>
                        <div>
                            <Label>პასუხი *</Label>
                            <TiptapEditor content={data.answer} onChange={(html) => setData('answer', html)} placeholder="პასუხი..." />
                            <InputError message={errors.answer} />
                        </div>
                        <div className="flex items-center gap-4">
                            <Input type="number" className="w-24" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                აქტიური
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'იტვირთება...' : 'შენახვა'}</Button>
                        <Link href="/admin/faqs"><Button variant="outline" type="button">გაუქმება</Button></Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
