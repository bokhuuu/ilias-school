import { useState, type FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage } from '@/components/admin/flash-message';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { Category, Lecturer, SyllabusItemForm } from '@/types/models';

interface Props {
    lecturers: { data: Lecturer[] };
    categories: { data: Category[] };
}

const breadcrumbs = [
    { title: 'დეშბორდი', href: '/admin/dashboard' },
    { title: 'კურსები', href: '/admin/courses' },
    { title: 'ახალი', href: '#' },
];

export default function CourseCreate({ lecturers: { data: lecturers }, categories: { data: categories } }: Props) {
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
        gallery: [] as File[],
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
        setData('lecturer_ids', data.lecturer_ids.includes(id) ? data.lecturer_ids.filter((l) => l !== id) : [...data.lecturer_ids, id]);
    }

    function toggleCategory(id: number) {
        setData('category_ids', data.category_ids.includes(id) ? data.category_ids.filter((c) => c !== id) : [...data.category_ids, id]);
    }

    function addSyllabusItem() {
        setData('syllabus_items', [...data.syllabus_items, { meeting_number: data.syllabus_items.length + 1, title: '', sort_order: data.syllabus_items.length }]);
    }

    function removeSyllabusItem(index: number) {
        setData('syllabus_items', data.syllabus_items.filter((_, i) => i !== index));
    }

    function updateSyllabusItem(index: number, field: keyof SyllabusItemForm, value: string | number) {
        const items = [...data.syllabus_items];
        items[index] = { ...items[index], [field]: value };
        setData('syllabus_items', items);
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        transform((d) => ({
            ...d,
            syllabus_items: d.syllabus_items.filter((item) => item.title.trim() !== ''),
        }));
        post('/admin/courses', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ახალი კურსი" />
            <FlashMessage />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">ახალი კურსი</h1>

                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">ძირითადი ინფორმაცია</h2>

                        <div>
                            <Label htmlFor="title">სათაური *</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            <InputError message={errors.title} />
                        </div>

                        <div>
                            <Label>მოკლე აღწერა</Label>
                            <textarea className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={2} value={data.short_description} onChange={(e) => setData('short_description', e.target.value)} />
                        </div>

                        <div>
                            <Label>სრული აღწერა</Label>
                            <TiptapEditor content={data.description} onChange={(html) => setData('description', html)} placeholder="კურსის აღწერა..." />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="age_group">ასაკობრივი ჯგუფი</Label>
                                <Input id="age_group" value={data.age_group} onChange={(e) => setData('age_group', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="format">ფორმატი</Label>
                                <Input id="format" value={data.format} onChange={(e) => setData('format', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="duration">ხანგრძლივობა</Label>
                                <Input id="duration" value={data.duration} onChange={(e) => setData('duration', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="video_url">ვიდეოს URL</Label>
                            <Input id="video_url" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} placeholder="https://youtube.com/..." />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                აქტიური
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
                                გამორჩეული სლაიდერში
                            </label>
                        </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-3">
                        <h2 className="text-lg font-semibold">ლექტორები</h2>
                        {lecturers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">ჯერ არ არის ლექტორი</p>
                        ) : (
                            <div className="space-y-2">
                                {lecturers.map((lecturer) => (
                                    <label key={lecturer.id} className="flex items-center gap-2">
                                        <input type="checkbox" checked={data.lecturer_ids.includes(lecturer.id)} onChange={() => toggleLecturer(lecturer.id)} />
                                        {lecturer.full_name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border p-6 space-y-3">
                        <h2 className="text-lg font-semibold">კატეგორიები</h2>
                        {categories.length === 0 ? (
                            <p className="text-sm text-muted-foreground">ჯერ არ არის კატეგორია</p>
                        ) : (
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <label key={category.id} className="flex items-center gap-2">
                                        <input type="checkbox" checked={data.category_ids.includes(category.id)} onChange={() => toggleCategory(category.id)} />
                                        {category.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">სილაბუსი</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addSyllabusItem}>
                                <Plus className="mr-1 h-4 w-4" /> შეხვედრა
                            </Button>
                        </div>
                        {data.syllabus_items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">N°</span>
                                <Input className="w-16" type="number" value={item.meeting_number} onChange={(e) => updateSyllabusItem(index, 'meeting_number', Number(e.target.value))} />
                                <span className="text-sm text-muted-foreground">სათაური</span>
                                <Input className="flex-1" value={item.title} onChange={(e) => updateSyllabusItem(index, 'title', e.target.value)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSyllabusItem(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">სურათი</h2>
                        <div>
                            <Label htmlFor="image">კურსის სურათი</Label>
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />}
                        </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">SEO</h2>
                        <div>
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                        </div>
                        <div>
                            <Label>Meta Description</Label>
                            <textarea className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={2} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="og_image">OG Image</Label>
                            <Input id="og_image" type="file" accept="image/*" onChange={(e) => setData('og_image', e.target.files?.[0] || null)} />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'იტვირთება...' : 'შენახვა'}
                        </Button>
                        <Link href="/admin/courses">
                            <Button variant="outline" type="button">გაუქმება</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
