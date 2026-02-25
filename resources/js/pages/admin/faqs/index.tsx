import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { ActiveToggle } from '@/components/admin/active-toggle';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { SortableTableBody } from '@/components/admin/sortable-table';
import { Button } from '@/components/ui/button';
import type { Faq } from '@/types/models';

interface Props {
    faqs: { data: Faq[] };
}

const breadcrumbs = [
    { title: 'დეშბორდი', href: '/admin/dashboard' },
    { title: 'FAQ', href: '/admin/faqs' },
];

export default function FaqsIndex({ faqs: { data: faqs } }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="FAQ" />
            <FlashMessage />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">ხშირად დასმული კითხვები</h1>
                    <Link href="/admin/faqs/create">
                        <Button><Plus className="mr-2 h-4 w-4" /> ახალი კითხვა</Button>
                    </Link>
                </div>
                {faqs.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">კითხვები არ მოიძებნა</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="w-8"></th>
                                    <th className="px-4 py-3 text-left">კითხვა</th>
                                    <th className="px-4 py-3 text-left">სტატუსი</th>
                                    <th className="px-4 py-3 text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <SortableTableBody
                                items={faqs}
                                reorderUrl="/admin/faqs/reorder"
                                renderRow={(item) => {
                                    const faq = item as Faq;
                                    return (
                                        <>
                                            <td className="px-4 py-3 font-medium">{faq.question}</td>
                                            <td className="px-4 py-3">
                                                <ActiveToggle isActive={faq.is_active} toggleUrl={`/admin/faqs/${faq.id}/toggle-active`} />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/faqs/${faq.id}/edit`}>
                                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(faq)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </>
                                    );
                                }}
                            />
                        </table>
                    </div>
                )}
            </div>
            <DeleteConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                deleteUrl={deleteTarget ? `/admin/faqs/${deleteTarget.id}` : ''}
                title="კითხვის წაშლა"
                description={`დარწმუნებული ხართ რომ გსურთ წაშლა?`}
            />
        </AppLayout>
    );
}
