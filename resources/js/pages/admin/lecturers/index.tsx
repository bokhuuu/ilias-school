import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ActiveToggle } from '@/components/admin/active-toggle';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { SortableTableBody } from '@/components/admin/sortable-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Lecturer } from '@/types/models';
import { Pagination } from '@/components/admin/pagination';

interface Props {
    lecturers: {
        data: Lecturer[];
        meta: {
            links: { url: string | null; label: string; active: boolean }[];
        };
    };
}

const breadcrumbs = [
    { title: 'დეშბორდი', href: '/admin/dashboard' },
    { title: 'ლექტორები', href: '/admin/lecturers' },
];

export default function LecturersIndex({ lecturers }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Lecturer | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ლექტორები" />
            <FlashMessage />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">ლექტორები</h1>
                    <Link href="/admin/lecturers/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> ახალი ლექტორი
                        </Button>
                    </Link>
                </div>

                {lecturers.data.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">
                        ლექტორები არ მოიძებნა
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="w-8"></th>
                                    <th className="px-4 py-3 text-left">
                                        სურათი
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        სახელი
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        თანამდებობა
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        სტატუსი
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        მოქმედება
                                    </th>
                                </tr>
                            </thead>
                            <SortableTableBody
                                items={lecturers.data}
                                reorderUrl="/admin/lecturers/reorder"
                                renderRow={(item) => {
                                    const lecturer = item as Lecturer;
                                    return (
                                        <>
                                            <td className="px-4 py-3">
                                                {lecturer.image_thumb ? (
                                                    <img
                                                        src={
                                                            lecturer.image_thumb
                                                        }
                                                        alt=""
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-muted" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {lecturer.full_name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {lecturer.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <ActiveToggle
                                                    isActive={
                                                        lecturer.is_active
                                                    }
                                                    toggleUrl={`/admin/lecturers/${lecturer.slug}/toggle-active`}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/lecturers/${lecturer.slug}/edit`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                lecturer,
                                                            )
                                                        }
                                                    >
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
                <Pagination links={lecturers.meta.links} />
            </div>

            <DeleteConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                deleteUrl={
                    deleteTarget ? `/admin/lecturers/${deleteTarget.slug}` : ''
                }
                title="ლექტორის წაშლა"
                description={`დარწმუნებული ხართ რომ გსურთ "${deleteTarget?.full_name}" წაშლა?`}
            />
        </AppLayout>
    );
}
