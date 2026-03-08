import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: PaginationLink[];
}

export function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="mt-6 flex items-center justify-center gap-1">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    preserveScroll
                    preserveState
                    className={`rounded-md px-3 py-1.5 text-sm ${
                        link.active
                            ? 'bg-primary text-primary-foreground'
                            : link.url
                              ? 'hover:bg-muted'
                              : 'cursor-not-allowed text-muted-foreground'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
