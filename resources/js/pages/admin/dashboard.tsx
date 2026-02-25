import { Head } from '@inertiajs/react';
import {
    GraduationCap,
    Layers,
    MessageSquare,
    Tags,
    Users,
} from 'lucide-react';
import { FlashMessage } from '@/components/admin/flash-message';
import AppLayout from '@/layouts/app-layout';

interface Props {
    stats: {
        lecturers_count: number;
        courses_count: number;
        total_lecturers: number;
        total_courses: number;
        total_faqs: number;
        total_categories: number;
        age_groups_count: number;
        total_age_groups: number;
    };
}

export default function Dashboard({ stats }: Props) {
    return (
        <AppLayout
            breadcrumbs={[{ title: 'დეშბორდი', href: '/admin/dashboard' }]}
        >
            <Head title="დეშბორდი" />
            <FlashMessage />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">დეშბორდი</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <StatCard
                        title="ლექტორები"
                        value={stats.lecturers_count}
                        total={stats.total_lecturers}
                        icon={<Users className="h-8 w-8 text-blue-500" />}
                    />
                    <StatCard
                        title="კურსები"
                        value={stats.courses_count}
                        total={stats.total_courses}
                        icon={
                            <GraduationCap className="h-8 w-8 text-green-500" />
                        }
                    />
                    <StatCard
                        title="FAQ"
                        value={stats.total_faqs}
                        icon={
                            <MessageSquare className="h-8 w-8 text-purple-500" />
                        }
                    />
                </div>

                <div className="mt-6 flex justify-center gap-6">
                    <div className="w-full max-w-xs md:w-1/3">
                        <StatCard
                            title="კატეგორიები"
                            value={stats.total_categories}
                            icon={<Tags className="h-8 w-8 text-orange-500" />}
                        />
                    </div>
                    <div className="w-full max-w-xs md:w-1/3">
                        <StatCard
                            title="ასაკობრივი ჯგუფები"
                            value={stats.age_groups_count}
                            total={stats.total_age_groups}
                            icon={<Layers className="h-8 w-8 text-cyan-500" />}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    total,
    icon,
}: {
    title: string;
    value: number;
    total?: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="mt-1 text-3xl font-bold">
                        {value}
                        {total !== undefined && (
                            <span className="text-lg font-normal text-muted-foreground">
                                {' '}
                                / {total}
                            </span>
                        )}
                    </p>
                </div>
                {icon}
            </div>
        </div>
    );
}
