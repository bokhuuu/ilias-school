import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Faq } from '@/types/models';

interface Props {
    faqs: { data: Faq[] };
}

export default function FaqsIndex({ faqs }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);
    const [processing, setProcessing] = useState(false);

    function handleDelete() {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/admin/faqs/${deleteTarget.id}`, {
            onFinish: () => { setProcessing(false); setDeleteTarget(null); },
        });
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'FAQ', href: '/admin/faqs' },
        ]}>
            <Head title="FAQ" />
            <FlashMessage />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">FAQ</h1>
                    <Button asChild><Link href="/admin/faqs/create"><Plus className="h-4 w-4 mr-2" />ახალი კითხვა</Link></Button>
                </div>

                {faqs.data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">კითხვები არ მოიძებნა</div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium">კითხვა</th>
                                    <th className="text-left p-3 font-medium">სტატუსი</th>
                                    <th className="text-left p-3 font-medium">რიგითობა</th>
                                    <th className="text-right p-3 font-medium">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.data.map((faq) => (
                                    <tr key={faq.id} className="border-b last:border-0">
                                        <td className="p-3 font-medium max-w-md truncate">{faq.question}</td>
                                        <td className="p-3">
                                            <Badge variant={faq.is_active ? 'default' : 'secondary'}>
                                                {faq.is_active ? 'აქტიური' : 'არააქტიური'}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-muted-foreground">{faq.sort_order}</td>
                                        <td className="p-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/faqs/${faq.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(faq)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <DeleteConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} processing={processing} />
        </AppLayout>
    );
}
