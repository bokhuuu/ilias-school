import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Course } from '@/types/models';

interface Props {
    courses: { data: Course[] };
}

export default function CoursesIndex({ courses }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
    const [processing, setProcessing] = useState(false);

    function handleDelete() {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/admin/courses/${deleteTarget.slug}`, {
            onFinish: () => {
                setProcessing(false);
                setDeleteTarget(null);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'კურსები', href: '/admin/courses' },
        ]}>
            <Head title="კურსები" />
            <FlashMessage />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">კურსები</h1>
                    <Button asChild>
                        <Link href="/admin/courses/create">
                            <Plus className="h-4 w-4 mr-2" />
                            ახალი კურსი
                        </Link>
                    </Button>
                </div>

                {courses.data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        კურსები არ მოიძებნა
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium">სურათი</th>
                                    <th className="text-left p-3 font-medium">სათაური</th>
                                    <th className="text-left p-3 font-medium">კატეგორიები</th>
                                    <th className="text-left p-3 font-medium">სტატუსი</th>
                                    <th className="text-left p-3 font-medium">გამორჩეული</th>
                                    <th className="text-right p-3 font-medium">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.data.map((course) => (
                                    <tr key={course.id} className="border-b last:border-0">
                                        <td className="p-3">
                                            {course.image_thumb ? (
                                                <img
                                                    src={course.image_thumb}
                                                    alt={course.title}
                                                    className="h-10 w-16 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs">—</div>
                                            )}
                                        </td>
                                        <td className="p-3 font-medium">{course.title}</td>
                                        <td className="p-3">
                                            <div className="flex gap-1 flex-wrap">
                                                {course.categories?.map((cat) => (
                                                    <Badge key={cat.id} variant="outline" className="text-xs">
                                                        {cat.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant={course.is_active ? 'default' : 'secondary'}>
                                                {course.is_active ? 'აქტიური' : 'არააქტიური'}
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            {course.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/courses/${course.slug}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteTarget(course)}
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
                description={`დარწმუნებული ხართ, რომ გსურთ "${deleteTarget?.title}" კურსის წაშლა?`}
            />
        </AppLayout>
    );
}
