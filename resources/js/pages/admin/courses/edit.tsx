import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type {
    Category,
    Course,
    GalleryImage,
    Lecturer,
    SyllabusItemForm,
} from '@/types/models';

interface Props {
    course: { data: Course };
    lecturers: { data: Lecturer[] };
    categories: { data: Category[] };
    ageGroups: { data: { id: number; title: string; age_range: string }[] };
}

type Tab = 'basic' | 'syllabus';

export default function CourseEdit({
    course: { data: course },
    lecturers: { data: lecturers },
    categories: { data: categories },
    ageGroups: { data: ageGroups },
}: Props) {
    const breadcrumbs = [
        { title: 'დეშბორდი', href: '/admin/dashboard' },
        { title: 'კურსები', href: '/admin/courses' },
        { title: 'რედაქტირება', href: '#' },
    ];

    const [activeTab, setActiveTab] = useState<Tab>('basic');

    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'PUT' as const,
        title: course.title || '',
        description: course.description || '',
        short_description: course.short_description || '',
        age_group_id: course.age_group_id || ('' as number | ''),
        format: course.format || '',
        duration: course.duration || '',
        video_url: course.video_url || '',
        meta_title: course.meta_title || '',
        meta_description: course.meta_description || '',
        is_active: course.is_active,
        is_featured: course.is_featured,
        featured_sort_order: course.featured_sort_order || 0,
        sort_order: course.sort_order || 0,
        image: null as File | null,
        og_image: null as File | null,
        gallery: [] as File[],
        gallery_remove: [] as number[],
        gallery_order: [] as number[],
        lecturer_ids: course.lecturers?.map((l) => l.id) || [],
        category_ids: course.categories?.map((c) => c.id) || [],
        syllabus_items: (course.syllabus_items || []).map((s) => ({
            meeting_number: s.meeting_number,
            title: s.title,
            content: s.content || '',
            sort_order: s.sort_order,
        })) as SyllabusItemForm[],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
        course.gallery || [],
    );

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        if (file) setImagePreview(URL.createObjectURL(file));
    }

    function handleGalleryRemove(id: number) {
        setGalleryImages((prev) => prev.filter((img) => img.id !== id));
        setData('gallery_remove', [...data.gallery_remove, id]);
    }

    function handleGalleryReorder(images: GalleryImage[]) {
        setGalleryImages(images);
        setData(
            'gallery_order',
            images.map((img) => img.id),
        );
    }

    function toggleLecturer(id: number) {
        setData(
            'lecturer_ids',
            data.lecturer_ids.includes(id)
                ? data.lecturer_ids.filter((l) => l !== id)
                : [...data.lecturer_ids, id],
        );
    }

    function toggleCategory(id: number) {
        setData(
            'category_ids',
            data.category_ids.includes(id)
                ? data.category_ids.filter((c) => c !== id)
                : [...data.category_ids, id],
        );
    }

    function addSyllabusItem() {
        setData('syllabus_items', [
            ...data.syllabus_items,
            {
                meeting_number: data.syllabus_items.length + 1,
                title: '',
                content: '',
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
        transform((d) => ({
            ...d,
            syllabus_items: d.syllabus_items.filter(
                (item) => item.title.trim() !== '',
            ),
        }));
        post(`/admin/courses/${course.slug}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`რედაქტირება: ${course.title}`} />
            <FlashMessage />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">კურსის რედაქტირება</h1>

                {/* Tabs */}
                <div className="mb-6 flex gap-1 rounded-lg border bg-muted/30 p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('basic')}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'basic'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        ძირითადი
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('syllabus')}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'syllabus'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        სილაბუსი ({data.syllabus_items.length})
                    </button>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    {/* Basic Tab */}
                    {activeTab === 'basic' && (
                        <>
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
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div>
                                    <Label>მოკლე აღწერა</Label>
                                    <textarea
                                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                        rows={2}
                                        value={data.short_description}
                                        onChange={(e) =>
                                            setData(
                                                'short_description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>სრული აღწერა</Label>
                                    <TiptapEditor
                                        content={data.description}
                                        onChange={(html) =>
                                            setData('description', html)
                                        }
                                        placeholder="კურსის აღწერა..."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label>ასაკობრივი ჯგუფი</Label>
                                        <select
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            value={data.age_group_id}
                                            onChange={(e) =>
                                                setData(
                                                    'age_group_id',
                                                    e.target.value
                                                        ? Number(e.target.value)
                                                        : ('' as unknown as number),
                                                )
                                            }
                                        >
                                            <option value="">
                                                -- არჩევა --
                                            </option>
                                            {ageGroups.map((ag) => (
                                                <option
                                                    key={ag.id}
                                                    value={ag.id}
                                                >
                                                    {ag.title} ({ag.age_range})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label>ფორმატი</Label>
                                        <Input
                                            value={data.format}
                                            onChange={(e) =>
                                                setData(
                                                    'format',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>ხანგრძლივობა</Label>
                                        <Input
                                            value={data.duration}
                                            onChange={(e) =>
                                                setData(
                                                    'duration',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>ვიდეოს URL</Label>
                                    <Input
                                        value={data.video_url}
                                        onChange={(e) =>
                                            setData('video_url', e.target.value)
                                        }
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    'is_active',
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        აქტიური
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) =>
                                                setData(
                                                    'is_featured',
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        გამორჩეული სლაიდერში
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border p-6">
                                <h2 className="text-lg font-semibold">
                                    ლექტორები
                                </h2>
                                {lecturers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        ჯერ არ არის ლექტორი
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {lecturers.map((lecturer) => (
                                            <label
                                                key={lecturer.id}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.lecturer_ids.includes(
                                                        lecturer.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleLecturer(
                                                            lecturer.id,
                                                        )
                                                    }
                                                />
                                                {lecturer.full_name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 rounded-lg border p-6">
                                <h2 className="text-lg font-semibold">
                                    კატეგორიები
                                </h2>
                                {categories.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        ჯერ არ არის კატეგორია
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <label
                                                key={category.id}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.category_ids.includes(
                                                        category.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleCategory(
                                                            category.id,
                                                        )
                                                    }
                                                />
                                                {category.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 rounded-lg border p-6">
                                <h2 className="text-lg font-semibold">
                                    სურათი
                                </h2>
                                <div>
                                    <Label>კურსის სურათი</Label>
                                    {course.image && !imagePreview && (
                                        <img
                                            src={
                                                course.image_thumb ||
                                                course.image
                                            }
                                            alt=""
                                            className="mb-2 h-24 rounded-lg object-cover"
                                        />
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="mt-2 h-24 rounded-lg object-cover"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border p-6">
                                <h2 className="text-lg font-semibold">
                                    გალერეა
                                </h2>
                                <GalleryManager
                                    images={galleryImages}
                                    onRemove={handleGalleryRemove}
                                    onReorder={handleGalleryReorder}
                                    newFiles={data.gallery}
                                    onNewFilesChange={(files) =>
                                        setData('gallery', files)
                                    }
                                />
                            </div>

                            <div className="space-y-4 rounded-lg border p-6">
                                <h2 className="text-lg font-semibold">SEO</h2>
                                <div>
                                    <Label>Meta Title</Label>
                                    <Input
                                        value={data.meta_title}
                                        onChange={(e) =>
                                            setData(
                                                'meta_title',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Meta Description</Label>
                                    <textarea
                                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                        rows={2}
                                        value={data.meta_description}
                                        onChange={(e) =>
                                            setData(
                                                'meta_description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>OG Image</Label>
                                    {course.og_image && (
                                        <img
                                            src={course.og_image}
                                            alt=""
                                            className="mb-2 h-16 rounded"
                                        />
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData(
                                                'og_image',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Syllabus Tab */}
                    {activeTab === 'syllabus' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    სილაბუსი
                                </h2>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addSyllabusItem}
                                >
                                    <Plus className="mr-1 h-4 w-4" /> შეხვედრა
                                </Button>
                            </div>

                            {data.syllabus_items.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-12 text-center">
                                    <p className="text-muted-foreground">
                                        სილაბუსი ცარიელია
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-4"
                                        onClick={addSyllabusItem}
                                    >
                                        <Plus className="mr-1 h-4 w-4" />{' '}
                                        პირველი შეხვედრის დამატება
                                    </Button>
                                </div>
                            ) : (
                                data.syllabus_items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="space-y-3 rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                N°
                                            </span>
                                            <Input
                                                className="w-16"
                                                type="number"
                                                value={item.meeting_number}
                                                onChange={(e) =>
                                                    updateSyllabusItem(
                                                        index,
                                                        'meeting_number',
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                            <Input
                                                className="flex-1"
                                                placeholder="შეხვედრის სათაური"
                                                value={item.title}
                                                onChange={(e) =>
                                                    updateSyllabusItem(
                                                        index,
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeSyllabusItem(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <div>
                                            <Label className="mb-1">
                                                შინაარსი
                                            </Label>
                                            <TiptapEditor
                                                content={item.content}
                                                onChange={(html) =>
                                                    updateSyllabusItem(
                                                        index,
                                                        'content',
                                                        html,
                                                    )
                                                }
                                                placeholder="შეხვედრის შინაარსი..."
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Submit - always visible */}
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'იტვირთება...' : 'განახლება'}
                        </Button>
                        <Link href="/admin/courses">
                            <Button variant="outline" type="button">
                                გაუქმება
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
