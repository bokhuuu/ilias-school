import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Category } from '@/types/models';

interface Props {
    categories: { data: Category[] };
}

export default function CategoriesIndex({ categories }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [processing, setProcessing] = useState(false);

    function handleDelete() {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/admin/categories/${deleteTarget.slug}`, {
            onFinish: () => { setProcessing(false); setDeleteTarget(null); },
        });
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'კატეგორიები', href: '/admin/categories' },
        ]}>
            <Head title="კატეგორიები" />
            <FlashMessage />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">კატეგორიები</h1>
                    <Button asChild><Link href="/admin/categories/create"><Plus className="h-4 w-4 mr-2" />ახალი კატეგორია</Link></Button>
                </div>

                {categories.data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">კატეგორიები არ მოიძებნა</div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium">სახელი</th>
                                    <th className="text-left p-3 font-medium">Slug</th>
                                    <th className="text-left p-3 font-medium">რიგითობა</th>
                                    <th className="text-right p-3 font-medium">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.data.map((category) => (
                                    <tr key={category.id} className="border-b last:border-0">
                                        <td className="p-3 font-medium">{category.name}</td>
                                        <td className="p-3 text-muted-foreground">{category.slug}</td>
                                        <td className="p-3 text-muted-foreground">{category.sort_order}</td>
                                        <td className="p-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/categories/${category.slug}/edit`}><Pencil className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(category)}>
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
