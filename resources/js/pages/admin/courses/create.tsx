import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { Lecturer, Category } from '@/types/models';

interface Props {
    lecturers: { data: Lecturer[] };
    categories: { data: Category[] };
}

interface SyllabusItemForm {
    meeting_number: number;
    title: string;
    sort_order: number;
}

export default function CoursesCreate({ lecturers, categories }: Props) {
    const { data, setData, post, processing, errors, transform } = useForm({
        title: '',
        description: '',
        short_description: '',
        age_group: '',
        format: '',
        duration: '',
        video_url: '',
        meta_title: '',
        meta_description: '',
        is_active: true,
        is_featured: false,
        featured_sort_order: 0,
        sort_order: 0,
        image: null as File | null,
        og_image: null as File | null,
        lecturer_ids: [] as number[],
        category_ids: [] as number[],
        syllabus_items: [] as SyllabusItemForm[],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        if (file) setImagePreview(URL.createObjectURL(file));
    }

    function toggleLecturer(id: number) {
        const ids = data.lecturer_ids.includes(id)
            ? data.lecturer_ids.filter((i) => i !== id)
            : [...data.lecturer_ids, id];
        setData('lecturer_ids', ids);
    }

    function toggleCategory(id: number) {
        const ids = data.category_ids.includes(id)
            ? data.category_ids.filter((i) => i !== id)
            : [...data.category_ids, id];
        setData('category_ids', ids);
    }

    function addSyllabusItem() {
        setData('syllabus_items', [
            ...data.syllabus_items,
            {
                meeting_number: data.syllabus_items.length + 1,
                title: '',
                sort_order: data.syllabus_items.length,
            },
        ]);
    }

    function removeSyllabusItem(index: number) {
        setData(
            'syllabus_items',
            data.syllabus_items.filter((_, i) => i !== index),
        );
    }

    function updateSyllabusItem(
        index: number,
        field: keyof SyllabusItemForm,
        value: string | number,
    ) {
        const items = [...data.syllabus_items];
        items[index] = { ...items[index], [field]: value };
        setData('syllabus_items', items);
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        transform((data) => ({
            ...data,
            syllabus_items: data.syllabus_items.filter(
                (item) => item.title.trim() !== '',
            ),
        }));
        post('/admin/courses', { forceFormData: true });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'დეშბორდი', href: '/admin/dashboard' },
                { title: 'კურსები', href: '/admin/courses' },
                { title: 'ახალი', href: '/admin/courses/create' },
            ]}
        >
            <Head title="ახალი კურსი" />
            <FlashMessage />

            <div className="max-w-3xl p-6">
                <h1 className="mb-6 text-2xl font-bold">ახალი კურსი</h1>

                <form onSubmit={submit} className="space-y-6">
                    {/* Main Fields */}
                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">
                            ძირითადი ინფორმაცია
                        </h2>

                        <div>
                            <Label htmlFor="title">სათაური *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="mt-1"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div>
                            <Label htmlFor="short_description">
                                მოკლე აღწერა
                            </Label>
                            <textarea
                                id="short_description"
                                value={data.short_description}
                                onChange={(e) =>
                                    setData('short_description', e.target.value)
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <InputError message={errors.short_description} />
                        </div>

                        <div>
                            <Label htmlFor="description">სრული აღწერა</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={8}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="age_group">
                                    ასაკობრივი ჯგუფი
                                </Label>
                                <Input
                                    id="age_group"
                                    value={data.age_group}
                                    onChange={(e) =>
                                        setData('age_group', e.target.value)
                                    }
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="format">ფორმატი</Label>
                                <Input
                                    id="format"
                                    value={data.format}
                                    onChange={(e) =>
                                        setData('format', e.target.value)
                                    }
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="duration">ხანგრძლივობა</Label>
                                <Input
                                    id="duration"
                                    value={data.duration}
                                    onChange={(e) =>
                                        setData('duration', e.target.value)
                                    }
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="video_url">ვიდეოს URL</Label>
                            <Input
                                id="video_url"
                                value={data.video_url}
                                onChange={(e) =>
                                    setData('video_url', e.target.value)
                                }
                                className="mt-1"
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="sort_order">რიგითობა</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData(
                                            'sort_order',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(c) =>
                                        setData('is_active', c as boolean)
                                    }
                                />
                                <Label htmlFor="is_active">აქტიური</Label>
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Checkbox
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onCheckedChange={(c) =>
                                        setData('is_featured', c as boolean)
                                    }
                                />
                                <Label htmlFor="is_featured">
                                    გამორჩეული (სლაიდერი)
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Relationships */}
                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">ლექტორები</h2>
                        <div className="flex flex-wrap gap-3">
                            {lecturers.data.map((lecturer) => (
                                <label
                                    key={lecturer.id}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <Checkbox
                                        checked={data.lecturer_ids.includes(
                                            lecturer.id,
                                        )}
                                        onCheckedChange={() =>
                                            toggleLecturer(lecturer.id)
                                        }
                                    />
                                    <span className="text-sm">
                                        {lecturer.full_name}
                                    </span>
                                </label>
                            ))}
                            {lecturers.data.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    ჯერ არ არის ლექტორები
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">კატეგორიები</h2>
                        <div className="flex flex-wrap gap-3">
                            {categories.data.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <Checkbox
                                        checked={data.category_ids.includes(
                                            category.id,
                                        )}
                                        onCheckedChange={() =>
                                            toggleCategory(category.id)
                                        }
                                    />
                                    <span className="text-sm">
                                        {category.name}
                                    </span>
                                </label>
                            ))}
                            {categories.data.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    ჯერ არ არის კატეგორიები
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Syllabus */}
                    <div className="space-y-4 rounded-lg border p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">სილაბუსი</h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addSyllabusItem}
                            >
                                <Plus className="mr-1 h-4 w-4" /> შეხვედრა
                            </Button>
                        </div>

                        {data.syllabus_items.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-20">
                                    <Label>№</Label>
                                    <Input
                                        type="number"
                                        value={item.meeting_number}
                                        onChange={(e) =>
                                            updateSyllabusItem(
                                                index,
                                                'meeting_number',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label>სათაური</Label>
                                    <Input
                                        value={item.title}
                                        onChange={(e) =>
                                            updateSyllabusItem(
                                                index,
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-6"
                                    onClick={() => removeSyllabusItem(index)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}

                        {data.syllabus_items.length === 0 && (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                სილაბუსი ცარიელია
                            </p>
                        )}
                    </div>

                    {/* Image */}
                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">სურათი</h2>
                        <div>
                            <Label htmlFor="image">კურსის სურათი</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1"
                            />
                            <InputError message={errors.image} />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 h-32 rounded-lg object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">SEO</h2>
                        <div>
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input
                                id="meta_title"
                                value={data.meta_title}
                                onChange={(e) =>
                                    setData('meta_title', e.target.value)
                                }
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="meta_description">
                                Meta Description
                            </Label>
                            <textarea
                                id="meta_description"
                                value={data.meta_description}
                                onChange={(e) =>
                                    setData('meta_description', e.target.value)
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <Label htmlFor="og_image">OG Image</Label>
                            <Input
                                id="og_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'og_image',
                                        e.target.files?.[0] || null,
                                    )
                                }
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'ინახება...' : 'შენახვა'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/courses">გაუქმება</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
