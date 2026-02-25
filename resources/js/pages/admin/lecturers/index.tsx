import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Lecturer } from '@/types/models';

interface Props {
    lecturers: { data: Lecturer[] };
}

export default function LecturersIndex({ lecturers }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Lecturer | null>(null);
    const [processing, setProcessing] = useState(false);

    function handleDelete() {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/admin/lecturers/${deleteTarget.slug}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteTarget(null);
            },
        });
    }

    function toggleActive(lecturer: Lecturer) {
        router.patch(`/admin/lecturers/${lecturer.slug}`, {
            ...lecturer,
            is_active: !lecturer.is_active,
        }, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'ლექტორები', href: '/admin/lecturers' },
        ]}>
            <Head title="ლექტორები" />
            <FlashMessage />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">ლექტორები</h1>
                    <Button asChild>
                        <Link href="/admin/lecturers/create">
                            <Plus className="h-4 w-4 mr-2" />
                            ახალი ლექტორი
                        </Link>
                    </Button>
                </div>

                {lecturers.data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        ლექტორები არ მოიძებნა
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium">სურათი</th>
                                    <th className="text-left p-3 font-medium">სახელი</th>
                                    <th className="text-left p-3 font-medium">თანამდებობა</th>
                                    <th className="text-left p-3 font-medium">სტატუსი</th>
                                    <th className="text-left p-3 font-medium">რიგითობა</th>
                                    <th className="text-right p-3 font-medium">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lecturers.data.map((lecturer) => (
                                    <tr key={lecturer.id} className="border-b last:border-0">
                                        <td className="p-3">
                                            {lecturer.image_thumb ? (
                                                <img
                                                    src={lecturer.image_thumb}
                                                    alt={lecturer.full_name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
                                                    {lecturer.full_name.charAt(0)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 font-medium">{lecturer.full_name}</td>
                                        <td className="p-3 text-muted-foreground">{lecturer.title || '—'}</td>
                                        <td className="p-3">
                                            <button onClick={() => toggleActive(lecturer)}>
                                                <Badge variant={lecturer.is_active ? 'default' : 'secondary'}>
                                                    {lecturer.is_active ? 'აქტიური' : 'არააქტიური'}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="p-3 text-muted-foreground">{lecturer.sort_order}</td>
                                        <td className="p-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/lecturers/${lecturer.slug}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteTarget(lecturer)}
                                                >
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

            <DeleteConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                processing={processing}
                description={`დარწმუნებული ხართ, რომ გსურთ "${deleteTarget?.full_name}" ლექტორის წაშლა?`}
            />
        </AppLayout>
    );
}
