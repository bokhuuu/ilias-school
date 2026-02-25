import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    open: boolean;
    onClose: () => void;
    deleteUrl: string;
    title?: string;
    description?: string;
}

export function DeleteConfirmDialog({
    open,
    onClose,
    deleteUrl,
    title = 'წაშლის დადასტურება',
    description = 'დარწმუნებული ხართ, რომ გსურთ წაშლა? ეს მოქმედება შეუქცევადია.',
}: Props) {
    const [processing, setProcessing] = useState(false);

    function handleDelete() {
        if (!deleteUrl) return;
        setProcessing(true);
        router.delete(deleteUrl, {
            onFinish: () => {
                setProcessing(false);
                onClose();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                    >
                        გაუქმება
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'იშლება...' : 'წაშლა'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
