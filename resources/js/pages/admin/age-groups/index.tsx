import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { AgeGroup } from '@/types/models';

interface Props {
    ageGroups: { data: AgeGroup[] };
}

export default function AgeGroupsIndex({ ageGroups }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<AgeGroup | null>(null);
    const [processing, setProcessing] = useState(false);

    function handleDelete() {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/admin/age-groups/${deleteTarget.id}`, {
            onFinish: () => { setProcessing(false); setDeleteTarget(null); },
        });
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'ასაკობრივი ჯგუფები', href: '/admin/age-groups' },
        ]}>
            <Head title="ასაკობრივი ჯგუფები" />
            <FlashMessage />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">ასაკობრივი ჯგუფები</h1>
                    <Button asChild><Link href="/admin/age-groups/create"><Plus className="h-4 w-4 mr-2" />ახალი ჯგუფი</Link></Button>
                </div>

                {ageGroups.data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">ჯგუფები არ მოიძებნა</div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium">სურათი</th>
                                    <th className="text-left p-3 font-medium">სათაური</th>
                                    <th className="text-left p-3 font-medium">ასაკი</th>
                                    <th className="text-left p-3 font-medium">სტატუსი</th>
                                    <th className="text-right p-3 font-medium">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ageGroups.data.map((group) => (
                                    <tr key={group.id} className="border-b last:border-0">
                                        <td className="p-3">
                                            {group.image_thumb ? (
                                                <img src={group.image_thumb} alt={group.title} className="h-10 w-10 rounded object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 rounded bg-muted" />
                                            )}
                                        </td>
                                        <td className="p-3 font-medium">{group.title}</td>
                                        <td className="p-3 text-muted-foreground">{group.age_range}</td>
                                        <td className="p-3">
                                            <Badge variant={group.is_active ? 'default' : 'secondary'}>
                                                {group.is_active ? 'აქტიური' : 'არააქტიური'}
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/age-groups/${group.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(group)}>
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
