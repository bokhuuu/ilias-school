import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { SortableTableBody } from '@/components/admin/sortable-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Category } from '@/types/models';

interface Props {
    categories: { data: Category[] };
}

const breadcrumbs = [
    { title: 'დეშბორდი', href: '/admin/dashboard' },
    { title: 'კატეგორიები', href: '/admin/categories' },
];

export default function CategoriesIndex({ categories: { data: categories } }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="კატეგორიები" />
            <FlashMessage />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">კატეგორიები</h1>
                    <Link href="/admin/categories/create">
                        <Button><Plus className="mr-2 h-4 w-4" /> ახალი კატეგორია</Button>
                    </Link>
                </div>

                {categories.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">კატეგორიები არ მოიძებნა</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="w-8"></th>
                                    <th className="px-4 py-3 text-left">სახელი</th>
                                    <th className="px-4 py-3 text-left">სლაგი</th>
                                    <th className="px-4 py-3 text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <SortableTableBody
                                items={categories}
                                reorderUrl="/admin/categories/reorder"
                                renderRow={(item) => {
                                    const category = item as Category;
                                    return (
                                        <>
                                            <td className="px-4 py-3 font-medium">{category.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/categories/${category.slug}/edit`}>
                                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(category)}>
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
                deleteUrl={deleteTarget ? `/admin/categories/${deleteTarget.slug}` : ''}
                title="კატეგორიის წაშლა"
                description={`დარწმუნებული ხართ რომ გსურთ "${deleteTarget?.name}" წაშლა?`}
            />
        </AppLayout>
    );
}
