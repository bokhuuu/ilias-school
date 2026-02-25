import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import { GripVertical } from 'lucide-react';

interface SortableRowProps {
    id: number;
    children: React.ReactNode;
}

export function SortableRow({ id, children }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={isDragging ? 'bg-muted' : ''}
        >
            <td className="w-8 px-2">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab p-1 text-muted-foreground hover:text-foreground"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </td>
            {children}
        </tr>
    );
}

interface SortableTableBodyProps {
    items: { id: number }[];
    reorderUrl: string;
    renderRow: (item: { id: number }) => React.ReactNode;
}

export function SortableTableBody({
    items,
    reorderUrl,
    renderRow,
}: SortableTableBodyProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: {
        active: { id: number | string };
        over: { id: number | string } | null;
    }) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex(
            (item) => item.id === Number(active.id),
        );
        const newIndex = items.findIndex((item) => item.id === Number(over.id));

        const reordered = [...items];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        router.post(
            reorderUrl,
            { ids: reordered.map((item) => item.id) },
            { preserveScroll: true },
        );
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <tbody>
                    {items.map((item) => (
                        <SortableRow key={item.id} id={item.id}>
                            {renderRow(item)}
                        </SortableRow>
                    ))}
                </tbody>
            </SortableContext>
        </DndContext>
    );
}
