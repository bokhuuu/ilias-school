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
    onConfirm: () => void;
    title?: string;
    description?: string;
    processing?: boolean;
}

export function DeleteConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'წაშლის დადასტურება',
    description = 'დარწმუნებული ხართ, რომ გსურთ წაშლა? ეს მოქმედება შეუქცევადია.',
    processing = false,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={processing}>
                        გაუქმება
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={processing}>
                        {processing ? 'იშლება...' : 'წაშლა'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
