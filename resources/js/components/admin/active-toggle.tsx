import { router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';

interface Props {
    isActive: boolean;
    toggleUrl: string;
}

export function ActiveToggle({ isActive, toggleUrl }: Props) {
    const toggle = () => {
        router.post(toggleUrl, {}, { preserveScroll: true });
    };

    return (
        <button type="button" onClick={toggle} title={isActive ? 'დააკლიკე გასათიშად' : 'დააკლიკე გასააქტიურებლად'}>
            <Badge variant={isActive ? 'default' : 'secondary'} className="cursor-pointer transition-colors">
                {isActive ? 'აქტიური' : 'არააქტიური'}
            </Badge>
        </button>
    );
}
