import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { GalleryImage } from '@/types/models';

interface Props {
    images: GalleryImage[];
    onRemove: (id: number) => void;
    onReorder: (images: GalleryImage[]) => void;
    newFiles: File[];
    onNewFilesChange: (files: File[]) => void;
}

function SortableImage({ image, onRemove }: { image: GalleryImage; onRemove: (id: number) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <img src={image.thumb || image.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="absolute left-1 top-1 cursor-grab rounded bg-black/50 p-1 text-white opacity-0 group-hover:opacity-100"
            >
                <GripVertical className="h-3 w-3" />
            </button>
            <button
                type="button"
                onClick={() => onRemove(image.id)}
                className="absolute right-1 top-1 rounded bg-red-500/80 p-1 text-white opacity-0 hover:bg-red-600 group-hover:opacity-100"
            >
                <X className="h-3 w-3" />
            </button>
        </div>
    );
}

export function GalleryManager({ images, onRemove, onReorder, newFiles, onNewFilesChange }: Props) {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        onNewFilesChange([...newFiles, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
        e.target.value = '';
    };

    const removeNewFile = (index: number) => {
        const updated = [...newFiles];
        updated.splice(index, 1);
        onNewFilesChange(updated);
        URL.revokeObjectURL(previews[index]);
        const updatedPreviews = [...previews];
        updatedPreviews.splice(index, 1);
        setPreviews(updatedPreviews);
    };

    const handleDragEnd = (event: { active: { id: number | string }; over: { id: number | string } | null }) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = images.findIndex((img) => img.id === active.id);
        const newIndex = images.findIndex((img) => img.id === over.id);
        const reordered = [...images];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        onReorder(reordered);
    };

    return (
        <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                        {images.map((image) => (
                            <SortableImage key={image.id} image={image} onRemove={onRemove} />
                        ))}

                        {previews.map((preview, index) => (
                            <div key={`new-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
                                <img src={preview} alt="" className="h-full w-full object-cover" />
                                <div className="absolute left-1 top-1 rounded bg-blue-500/80 px-1.5 py-0.5 text-[10px] text-white">ახალი</div>
                                <button
                                    type="button"
                                    onClick={() => removeNewFile(index)}
                                    className="absolute right-1 top-1 rounded bg-red-500/80 p-1 text-white opacity-0 hover:bg-red-600 group-hover:opacity-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}

                        <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-muted/50">
                            <div className="text-center">
                                <Plus className="mx-auto h-6 w-6 text-muted-foreground" />
                                <span className="mt-1 block text-xs text-muted-foreground">დამატება</span>
                            </div>
                            <input type="file" multiple accept="image/*" onChange={handleFileAdd} className="hidden" />
                        </label>
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
