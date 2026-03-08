import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ActiveToggle } from '@/components/admin/active-toggle';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { SortableTableBody } from '@/components/admin/sortable-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Course } from '@/types/models';
import { Pagination } from '@/components/admin/pagination';

interface Props {
    courses: {
        data: Course[];
        meta: {
            links: { url: string | null; label: string; active: boolean }[];
        };
    };
}

const breadcrumbs = [
    { title: 'დეშბორდი', href: '/admin/dashboard' },
    { title: 'კურსები', href: '/admin/courses' },
];

export default function CoursesIndex({ courses }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="კურსები" />
            <FlashMessage />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">კურსები</h1>
                    <Link href="/admin/courses/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> ახალი კურსი
                        </Button>
                    </Link>
                </div>

                {courses.data.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">
                        კურსები არ მოიძებნა
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
                                        სათაური
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        კატეგორიები
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        სილაბუსი
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        სტატუსი
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        გამორჩეული
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        მოქმედება
                                    </th>
                                </tr>
                            </thead>
                            <SortableTableBody
                                items={courses.data}
                                reorderUrl="/admin/courses/reorder"
                                renderRow={(item) => {
                                    const course = item as Course;
                                    return (
                                        <>
                                            <td className="px-4 py-3">
                                                {course.image_thumb ? (
                                                    <img
                                                        src={course.image_thumb}
                                                        alt=""
                                                        className="h-10 w-16 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-16 rounded bg-muted" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {course.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {course.categories?.map(
                                                        (cat) => (
                                                            <Badge
                                                                key={cat.id}
                                                                variant="outline"
                                                            >
                                                                {cat.name}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="secondary">
                                                    {course.syllabus_items_count ??
                                                        0}{' '}
                                                    შეხვედრა
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <ActiveToggle
                                                    isActive={course.is_active}
                                                    toggleUrl={`/admin/courses/${course.slug}/toggle-active`}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                {course.is_featured && (
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/courses/${course.slug}/edit`}
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
                                                                course,
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
                <Pagination links={courses.meta.links} />
            </div>

            <DeleteConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                deleteUrl={
                    deleteTarget ? `/admin/courses/${deleteTarget.slug}` : ''
                }
                title="კურსის წაშლა"
                description={`დარწმუნებული ხართ რომ გსურთ "${deleteTarget?.title}" წაშლა?`}
            />
        </AppLayout>
    );
}
