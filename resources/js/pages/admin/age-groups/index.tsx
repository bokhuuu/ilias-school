import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ActiveToggle } from '@/components/admin/active-toggle';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { SortableTableBody } from '@/components/admin/sortable-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { AgeGroup } from '@/types/models';

interface Props {
    ageGroups: { data: AgeGroup[] };
}

const breadcrumbs = [
    { title: 'დეშბორდი', href: '/admin/dashboard' },
    { title: 'ასაკობრივი ჯგუფები', href: '/admin/age-groups' },
];

export default function AgeGroupsIndex({ ageGroups: { data: ageGroups } }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<AgeGroup | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ასაკობრივი ჯგუფები" />
            <FlashMessage />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">ასაკობრივი ჯგუფები</h1>
                    <Link href="/admin/age-groups/create">
                        <Button><Plus className="mr-2 h-4 w-4" /> ახალი ჯგუფი</Button>
                    </Link>
                </div>
                {ageGroups.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">ჯგუფები არ მოიძებნა</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="w-8"></th>
                                    <th className="px-4 py-3 text-left">სურათი</th>
                                    <th className="px-4 py-3 text-left">სათაური</th>
                                    <th className="px-4 py-3 text-left">ასაკი</th>
                                    <th className="px-4 py-3 text-left">სტატუსი</th>
                                    <th className="px-4 py-3 text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <SortableTableBody
                                items={ageGroups}
                                reorderUrl="/admin/age-groups/reorder"
                                renderRow={(item) => {
                                    const ag = item as AgeGroup;
                                    return (
                                        <>
                                            <td className="px-4 py-3">
                                                {ag.image_thumb ? <img src={ag.image_thumb} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-muted" />}
                                            </td>
                                            <td className="px-4 py-3 font-medium">{ag.title}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{ag.age_range}</td>
                                            <td className="px-4 py-3">
                                                <ActiveToggle isActive={ag.is_active} toggleUrl={`/admin/age-groups/${ag.id}/toggle-active`} />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/age-groups/${ag.id}/edit`}>
                                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(ag)}>
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
                deleteUrl={deleteTarget ? `/admin/age-groups/${deleteTarget.id}` : ''}
                title="ჯგუფის წაშლა"
                description={`დარწმუნებული ხართ რომ გსურთ "${deleteTarget?.title}" წაშლა?`}
            />
        </AppLayout>
    );
}
